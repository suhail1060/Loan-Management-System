const express = require('express');
const router = express.Router();
const pool = require('../db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sendPasswordResetEmail = require('../utils/sendEmail');

// POST - Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email provided
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        // Check if user exists
        const userResult = await pool.query(
            'SELECT id, email, full_name FROM users WHERE email = $1',
            [email]
        );

        // SECURITY: Always return success even if email doesn't exist
        // This prevents user enumeration attacks
        if (userResult.rows.length === 0) {
            console.log(`⚠️  Password reset requested for non-existent email: ${email}`);
            return res.json({
                success: true,
                message: 'If an account exists with this email, you will receive password reset instructions.'
            });
        }

        const user = userResult.rows[0];

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Set expiration to 1 hour from now
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Store token in database
        await pool.query(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, resetToken, expiresAt]
        );

        // TODO: In production, send email here
        // For now, log the reset link to console
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
        
        // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        // console.log('📧 PASSWORD RESET EMAIL (Console Mode)');
        // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        // console.log(`To: ${user.email}`);
        // console.log(`Name: ${user.full_name}`);
        // console.log(`Reset Link: ${resetLink}`);
        // console.log(`Expires: ${expiresAt.toLocaleString()}`);
        // console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await sendPasswordResetEmail(user.email, resetToken);

        res.json({
            success: true,
            message: 'If an account exists with this email, you will receive password reset instructions.'
        });

    } catch (error) {
        console.error('Error in forgot-password:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process password reset request'
        });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const client = await pool.connect();

    // Find valid token (not expired, not used)
    const tokenResult = await client.query(
      `SELECT * FROM password_resets 
       WHERE token = $1 AND used = false AND expires_at > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      client.release();
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const resetRecord = tokenResult.rows[0];

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password + mark token as used (atomic)
    await client.query('BEGIN');
    await client.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, resetRecord.user_id]
    );
    await client.query(
      'UPDATE password_resets SET used = true WHERE id = $1',
      [resetRecord.id]
    );
    await client.query('COMMIT');

    client.release();
    res.json({ message: 'Password reset successful' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;