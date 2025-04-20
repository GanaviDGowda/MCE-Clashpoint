import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
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
  certificateURL: { 
    type: String, 
    required: true 

  } // file path or cloud link
}, { timestamps: true });

export const Certificate = mongoose.model("Certificate", certificateSchema);
