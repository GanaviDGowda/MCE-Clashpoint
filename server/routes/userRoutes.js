import express from "express";
import { getUserInfo } from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get user profile info
router.get("/info", protect, getUserInfo);

export default router;
