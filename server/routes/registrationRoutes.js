// server/routes/registrationRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { registerForEvent, getStudentRegistrations } from '../controllers/registrationController.js';

const router = express.Router();

// Add your routes here
router.post('/:eventId', protect, registerForEvent);
router.get('/', protect, getStudentRegistrations);

export default router;