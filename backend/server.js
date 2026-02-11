// Import the built-in http module
const http = require('http');

// Define the port number
const PORT = 5000;

// Create the server
const server = http.createServer((req, res) => {
    // This function runs every time someone makes a request
    console.log(`Request received: ${req.method} ${req.url}`);
    
    // Send response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from MicroLoan Backend! 🚀');
});

// Start listening for requests
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});