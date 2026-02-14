const express = require('express');
const router = express.Router();
const pool = require('../db');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

// POST - Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;
        
        // Validate required fields
        if (!email || !password || !full_name) {
            return res.status(400).json({
                success: false,
                error: 'Email, password, and full_name are required'
            });
        }
        
        // Hash the password
        const password_hash = await hashPassword(password);
        
        // Insert user with hashed password
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, created_at',
            [email, password_hash, full_name, role || 'user']
        );
        
        const user = result.rows[0];
        
        // Generate token
        const token = generateToken(user);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user,
                token: token
            }
        });
        
    } catch (error) {
        console.error('Error registering user:', error);
        
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to register user'
        });
    }
});

// POST - Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        
        // Find user by email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }
        
        const user = result.rows[0];
        
        // Compare password
        const isValidPassword = await comparePassword(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }
        
        // Generate token
        const token = generateToken(user);
        
        // Return user info (WITHOUT password_hash!) and token
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                },
                token: token
            }
        });
        
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to login'
        });
    }
});

module.exports = router;