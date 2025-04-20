import { Attendance } from '../models/Attendance.js';
import { generateQRCode } from '../utils/qrCodeGenerator.js';

// Mark attendance for the student
export const markAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user.id;  // Get student ID from JWT token

    // Check if the student has already marked attendance for this event
    const existingAttendance = await Attendance.findOne({ studentID: studentId, eventID: eventId });
    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance already marked for this event." });
    }

    // Mark the attendance
    const attendance = new Attendance({
      studentID: studentId,
      eventID: eventId,
      attendanceTime: new Date(),
    });
    await attendance.save();

    // Generate QR code for the student
    const qrCodeData = `https://attendance.mceclashpoint.com/attendance?id=${studentId}&event=${eventId}`;
    const qrCodePath = await generateQRCode(qrCodeData, `generated_qrcodes/attendance_${studentId}_${eventId}.png`);

    // Respond with the QR code path and success message
    res.status(201).json({
      message: "Attendance marked successfully.",
      qrCodePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking attendance." });
  }
};

// Check if a student attended the event
export const checkAttendance = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;

    // Find the attendance record for the given student and event
    const attendance = await Attendance.findOne({ studentID: studentId, eventID: eventId });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found for this student." });
    }

    // Respond with attendance details
    res.status(200).json({
      message: "Attendance found.",
      attendanceTime: attendance.attendanceTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching attendance." });
  }
};
