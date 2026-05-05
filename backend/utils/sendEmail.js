const nodemailer = require('nodemailer');

// Validate email credentials are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ Email credentials not configured. Set EMAIL_USER and EMAIL_PASS in .env file');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"MicroLoan" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">🏦 MicroLoan</h2>
        <p>You requested a password reset. Click the button below to set a new password.</p>
        <a href="${resetLink}" 
           style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; 
                  border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #666;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = sendPasswordResetEmail;