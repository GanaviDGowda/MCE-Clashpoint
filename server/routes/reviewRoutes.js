import express from "express";
import {
  submitReview,
  getReviews,
  deleteReview
} from "../controllers/reviewController.js";
import { protect, studentOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get reviews for an event (public route)
router.get("/:eventId", getReviews);

// Student submits review (protected route)
router.post("/:eventId", protect, studentOnly, submitReview);

// Student deletes their own review (protected route)
router.delete("/review/:reviewId", protect, deleteReview); // allow both students and hosts


export default router;