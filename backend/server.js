require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Add this line to import cors
const userRoutes = require('./routes/user');
const jobRoutes = require('./routes/jobs');
const quizRoutes = require('./routes/quizzes'); // Add this line

// Define the port from environment variables or default to 3000
const port = process.env.PORT || 3000;

// Create an Express application
const app = express();

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000', 
  'https://cerulean-pudding-c0e107.netlify.app', 
  'https://jobseeking-quizz-app-1.onrender.com'
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log request paths and methods
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// User routes
app.use('/api/user', userRoutes);

// Job routes
app.use('/api/jobs', jobRoutes);

// Quiz routes
app.use('/api/quizzes', quizRoutes); // Add this line

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Start the server after successful database connection
    app.listen(port, '0.0.0.0', () => {
      console.log(`Connected to DB & listening on port ${port}`);
    });
  })
  .catch((error) => {
    // Log database connection errors
    console.error('Database connection error:', error);
  });

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
