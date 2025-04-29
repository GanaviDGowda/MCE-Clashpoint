// uploadMiddleware.js (ESM-compatible)
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mce-events',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: () => `banner-${Date.now()}`,
  },
});

const upload = multer({ storage });

export default upload;
