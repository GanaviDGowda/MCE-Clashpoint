import multer from 'multer';
import path from 'path';

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the directory to store uploaded files
  },
  filename: (req, file, cb) => {
    // Set file name (unique file name using timestamp)
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File filter to allow only specific file types (e.g., PDFs, images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']; // Allowed file types
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and image files are allowed.'));
  }
};

// Initialize multer with storage and file filter configuration
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
  fileFilter,
});

export default upload;
