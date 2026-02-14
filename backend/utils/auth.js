const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for JWT (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Hash a password
async function hashPassword(password) {
    const saltRounds = 10; // Higher = more secure but slower
    return await bcrypt.hash(password, saltRounds);
}

// Compare password with hashed password
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
function generateToken(user) {
    // Payload - data stored in token
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    
    // Sign token with secret, expires in 24 hours
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};