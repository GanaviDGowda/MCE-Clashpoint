import mongoose from 'mongoose';
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },  // Optional URL for the video
});

export const Video = mongoose.model('Video', videoSchema);


