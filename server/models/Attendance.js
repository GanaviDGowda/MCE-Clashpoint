import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 

  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', required: 
    true 

  },
  attendanceTime: { 
    type: Date, 
    default: Date.now 

  }
}, { timestamps: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
