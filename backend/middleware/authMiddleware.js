const { verifyToken } = require('../utils/auth');

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    // Get token from Authorization header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token after "Bearer "
    
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
        });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
    
    // Attach user info to request object
    req.user = decoded;
    
    // Continue to the route handler
    next();
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
    // This middleware should be used AFTER authenticateToken
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Admin privileges required.'
        });
    }
    
    next();
}

module.exports = {
    authenticateToken,
    requireAdmin
};