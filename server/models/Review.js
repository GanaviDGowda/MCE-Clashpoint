import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String,
    trim: true,
    maxlength: 500
  }
}, { 
  timestamps: true 
});

// Index for faster queries
reviewSchema.index({ eventId: 1, studentId: 1 });

// Ensure one review per student per event
reviewSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);