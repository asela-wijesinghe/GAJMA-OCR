// Import the required modules
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Simple route to return a working status
app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the app for testing or other use
