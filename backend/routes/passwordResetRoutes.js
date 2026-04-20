const express = require('express');
const router = express.Router();
const pool = require('../db');
const crypto = require('crypto');

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
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 PASSWORD RESET EMAIL (Console Mode)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`To: ${user.email}`);
        console.log(`Name: ${user.full_name}`);
        console.log(`Reset Link: ${resetLink}`);
        console.log(`Expires: ${expiresAt.toLocaleString()}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

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

module.exports = router;