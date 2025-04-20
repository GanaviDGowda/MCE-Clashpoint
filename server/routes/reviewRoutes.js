import express from "express";
import {
  submitReview,
  getReviews
} from "../controllers/reviewController.js";

import { protect,studentOnly } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Student submits review
router.post("/:eventId", protect, studentOnly, submitReview);

// Publicly view reviews
router.get("/:eventId", getReviews);

export default router;
