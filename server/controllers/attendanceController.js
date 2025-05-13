import { verifyQRToken } from '../utils/qrTokenUtils.js';
import Attendance from '../models/Attendance.js';
import {Registration} from '../models/Registration.js';

export const markAttendance = async (req, res) => {
  try {
    const { qrToken } = req.body;
    const userId = req.user.id;
    
    if (!qrToken) {
      return res.status(400).json({ error: 'QR token is required' });
    }

    const eventId = verifyQRToken(qrToken);
    if (!eventId) {
      return res.status(400).json({ error: 'Invalid or expired QR code' });
    }

    // Check if user is registered for this event
    const registration = await Registration.findOne({ 
      user: userId,
      event: eventId 
    });
    
    if (!registration) {
      return res.status(403).json({ 
        error: 'You must be registered for this event to mark attendance' 
      });
    }

    // Check if attendance already marked
    const existingAttendance = await Attendance.findOne({ 
      event: eventId, 
      user: userId 
    });
    
    if (existingAttendance) {
      return res.status(409).json({ 
        message: 'Your attendance has already been recorded for this event' 
      });
    }

    // Create new attendance record
    const attendance = new Attendance({ 
      user: userId, 
      event: eventId, 
      attendedAt: new Date() 
    });
    
    await attendance.save();
    
    res.status(200).json({ 
      success: true,
      message: 'Attendance marked successfully' 
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};
