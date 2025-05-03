import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { v2 as cloudinaryV2 } from 'cloudinary';
import streamifier from 'streamifier';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

const uploadToCloudinary = (buffer, folder, resourceType, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        folder: `mce-events/${folder}`,
        resource_type: resourceType,
        public_id: `${folder}-${Date.now()}-${filename}`.replace(/\s+/g, '-').toLowerCase()
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const uploadEventFiles = (req, res, next) => {
  const multerUpload = upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'photos', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]);

  multerUpload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: 'File upload failed', details: err.message });
    }

    try {
      const uploadedFiles = {};

      if (req.files?.banner) {
        const banner = req.files.banner[0];
        uploadedFiles.banner = [await uploadToCloudinary(banner.buffer, 'banners', 'image', banner.originalname)];
      }

      if (req.files?.photos) {
        uploadedFiles.photos = await Promise.all(
          req.files.photos.map(photo =>
            uploadToCloudinary(photo.buffer, 'photos', 'image', photo.originalname)
          )
        );
      }

      if (req.files?.videos) {
        uploadedFiles.videos = await Promise.all(
          req.files.videos.map(video =>
            uploadToCloudinary(video.buffer, 'videos', 'video', video.originalname)
          )
        );
      }

      req.uploadedFiles = uploadedFiles;  // Store uploaded URLs here for future use
      console.log('Uploaded files:', uploadedFiles);  // Debugging line
      next();
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      res.status(500).json({ error: 'Failed to upload files', details: uploadError.message });
    }
  });
};

