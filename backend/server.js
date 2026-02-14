// Import Express
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import our database connection

// Create Express app
const app = express();

// Middleware - runs before your routes
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON bodies

// Define port
const PORT = 5000;

// --- ROUTES ---

// Test route - just to verify server is working
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to MicroLoan API! 🚀',
        status: 'Server is running'
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

// NEW: Get all users from database
app.get('/api/users', async (req, res) => {
    try {
        // Query database
        const result = await pool.query('SELECT id, email, full_name, role, created_at FROM users');
        
        // Return users as JSON
        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
});

// NEW: Create a new user
app.post('/api/users', async (req, res) => {
    try {
        // Get data from request body
        const { email, password, full_name, role } = req.body;
        
        // Validate required fields
        if (!email || !password || !full_name) {
            return res.status(400).json({
                success: false,
                error: 'Email, password, and full_name are required'
            });
        }
        
        // Insert into database
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, password, full_name, role || 'user']
        );
        
        // Return the created user
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error creating user:', error);
        
        // Handle duplicate email error
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to create user'
        });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});