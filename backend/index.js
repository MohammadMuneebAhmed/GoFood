const express = require('express');
const cors = require('cors');
const mongoDB = require('./db');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port

mongoDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Configure allowed origin
}));
app.use(express.json());

// Routes
app.use('/api', require('./Routes/CreateUser'));
// app.use('/api', require('./Routes/DisplayData'));

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
