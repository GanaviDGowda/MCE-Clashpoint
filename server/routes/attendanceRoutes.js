import express from "express";
import { markAttendance, checkAttendance } from "../controllers/attendanceController.js";
import { protect,studentOnly } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/:eventId", protect, studentOnly, markAttendance);
router.get("/:eventId/:studentId", protect, checkAttendance);

export default router;