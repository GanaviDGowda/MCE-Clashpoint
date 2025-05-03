import express from "express";
import { uploadEventFiles } from '../middlewares/uploadMiddleware.js';
import mongoose from 'mongoose';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getRegisteredUsers,
  getEventsByStudent,
  getEventByHost,
  getEventsWithVideos
} from "../controllers/eventController.js";
import { protect, hostOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add a debug middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Event route hit: ${req.method} ${req.path}`);
  if (req.params.id) {
    console.log('Event ID:', req.params.id);
  }
  next();
});

// Public routes
router.get("/", getAllEvents);
router.get("/videos", getEventsWithVideos); // New route to get events with videos

// Protected routes - specific paths must come before dynamic :id routes
router.get("/host", protect, hostOnly, getEventByHost);
router.get('/student', protect, getEventsByStudent);

// Dynamic :id routes - must come after specific paths
router.get("/:id", getEventById);

// Host-only protected routes
router.post("/", protect, hostOnly, uploadEventFiles, createEvent);
router.put("/:id", protect, hostOnly, uploadEventFiles, updateEvent);
router.delete("/:id", protect, hostOnly, deleteEvent);

// Host can view registrations
router.get("/:id/registrations", protect, hostOnly, getRegisteredUsers);

export default router;