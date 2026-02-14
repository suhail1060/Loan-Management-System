-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create loans table (we'll use this soon!)
CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users for testing
INSERT INTO users (email, password_hash, full_name, role) 
VALUES 
    ('john@example.com', 'hashed_password_123', 'John Doe', 'user'),
    ('admin@example.com', 'hashed_password_456', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample loan for testing
INSERT INTO loans (user_id, amount, purpose, status)
VALUES 
    (1, 50000.00, 'Home Renovation', 'pending')
ON CONFLICT DO NOTHING;