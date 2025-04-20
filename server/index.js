import app from './app.js';  // Import your Express app
import connectDB from './config/db.js';  // Import database connection
import dotenv from 'dotenv';  // Import dotenv

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

// Set the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
