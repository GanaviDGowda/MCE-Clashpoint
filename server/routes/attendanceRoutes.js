import express from 'express';
import { markAttendance } from '../controllers/attendanceController.js';
import { refreshEventQRCode } from '../utils/qrTokenUtils.js';
import { protect, hostOnly } from '../middlewares/authMiddleware.js';


const router = express.Router();


// Add this route - this provides the QR token that the frontend is requesting
router.get('/qr/:eventId', protect, async (req, res) => {
  try {
    const { eventId } = req.params;
    const token = await refreshEventQRCode(eventId);
    res.json({ qrToken: token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR token' });
  }
});

router.post('/mark', protect, markAttendance);

export default router;