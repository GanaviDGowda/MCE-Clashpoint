import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import userRoutes from './routes/userRoutes.js'; // if used
import path from 'path';
import { fileURLToPath } from 'url'; // Import for file URL handling
import fileUploadRoutes from './routes/fileUploadRoutes.js'; // Import file upload route
import apiRoutes from './routes/apiRoutes.js';
dotenv.config();
connectDB();

const app = express();

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // ✅ Update this
  credentials: true
}));


app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data
// app.get('/', (req, res) => {
//   res.send('Server is up');
// });
// // File upload route
// app.use('/api/files', fileUploadRoutes); // Now this will handle /api/files/upload requests

// // Static files (for serving uploaded files)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api', apiRoutes); // Import and use the API routes
// // Other routes for different APIs
app.use('/api/auth', authRoutes);


app.use('/api/attendance', attendanceRoutes);


console.log("Setting up event routes...");
app.use('/api/events', eventRoutes);
console.log("Event routes configured");

app.use('/api/registrations', registrationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);
// // Route to fetch all event categories
app.get('/api/categories', async (req, res) => {
    try {
      const categories = await Category.find();  // Querying the Category model
      res.status(200).json(categories);           // Sending the data as JSON
    } catch (err) {
      res.status(500).json({ message: 'Error fetching categories', error: err });
    }
  });
  

  
  // app.use('*', (req, res) => {
  //   console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
  //   res.status(404).json({ message: 'Route not found' });
  // });
  
// Error handler middleware
app.use(errorHandler);

export default app;
