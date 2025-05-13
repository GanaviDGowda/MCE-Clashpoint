// Event Schema with support for photos and videos
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  registrationEndDate: {
    type: Date,
    required: true
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    required: true 
  },
  link: {
    type: String
  }, // optional, if mode is online
  description: {
    type: String 
  },
  host: {
    type: String,
    required: true 
  }, // Name of department/club/etc.
  banner: {
    type: String
  }, // URL or file path to image
  photos: [{
    type: String
  }], // Array of photo URLs
  videos: [{
    type: String
  }], // Array of video URLs
  category: {
    type: String
  }, // eg. workshop, seminar
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, // host ID
  additionalDetails: {
    type: String
  },
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
    qrExpiry: { 
      type: Date, 
      default: Date.now 
    }
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);