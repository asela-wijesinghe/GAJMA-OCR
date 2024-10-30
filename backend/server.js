// Import required modules
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Set up a simple route to return the working status
app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
