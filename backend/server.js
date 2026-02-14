// Import Express
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import our database connection

// Import route files
const userRoutes=require('./routes/userRoutes');
const loanRoutes=require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');

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
        status: 'Server is running',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            loans: '/api/loans'
        }
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

// Use route files
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});