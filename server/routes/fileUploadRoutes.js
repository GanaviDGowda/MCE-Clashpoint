import express from 'express';
import upload from '../utils/fileUpload.js';  // Import multer configuration
import { protect, hostOnly } from '../middlewares/authMiddleware.js'; // Protect route and restrict to host

const router = express.Router();

// File upload route
// Only hosts can upload files (this can be changed as per your requirement)
router.post('/upload', protect, hostOnly, upload.single('file'), (req, res) => {
  try {
    // If file uploaded successfully, req.file contains file information
    const file = req.file;
    res.status(200).json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${file.filename}`, // Return the file path (for accessing the file)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
