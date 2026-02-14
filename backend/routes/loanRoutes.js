// Import Express
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import our database connection

// GET all loans with user information
router.get('/', async (req, res) => {
    try {
        // SQL JOIN to get loans with user details
        const result = await pool.query(`
            SELECT 
                loans.id,
                loans.amount,
                loans.purpose,
                loans.status,
                loans.created_at,
                users.id as user_id,
                users.email,
                users.full_name
            FROM loans
            JOIN users ON loans.user_id = users.id
            ORDER BY loans.created_at DESC
        `);
        
        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch loans'
        });
    }
});

// POST - Create new loan application
router.post('/', async (req, res) => {
    try {
        // Get data from request body
        const { user_id, amount, purpose } = req.body;
        
        // Validate required fields
        if (!user_id || !amount || !purpose) {
            return res.status(400).json({
                success: false,
                error: 'user_id, amount, and purpose are required'
            });
        }
        
        // Validate amount is positive
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Amount must be greater than 0'
            });
        }
        
        // Insert loan application
        const result = await pool.query(
            'INSERT INTO loans (user_id, amount, purpose, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, amount, purpose, 'pending']
        );
        
        // Return created loan
        res.status(201).json({
            success: true,
            message: 'Loan application submitted successfully',
            data: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error creating loan:', error);
        
        // Handle foreign key constraint (invalid user_id)
        if (error.code === '23503') {
            return res.status(400).json({
                success: false,
                error: 'Invalid user_id - user does not exist'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to create loan application'
        });
    }
});

// GET single loan by ID with user information
router.get('/:id', async (req, res) => {
    try {
        // Get ID from URL parameter
        const loanId = req.params.id;
        
        // Query database for specific loan
        const result = await pool.query(`
            SELECT 
                loans.id,
                loans.amount,
                loans.purpose,
                loans.status,
                loans.created_at,
                loans.updated_at,
                users.id as user_id,
                users.email,
                users.full_name,
                users.role
            FROM loans
            JOIN users ON loans.user_id = users.id
            WHERE loans.id = $1
        `, [loanId]);
        
        // Check if loan exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Loan not found'
            });
        }
        
        res.json({
            success: true,
            data: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error fetching loan:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch loan'
        });
    }
});

module.exports = router;