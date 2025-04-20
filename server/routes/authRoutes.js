import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserInfo } from "../controllers/userController.js";



const router = express.Router();

// Public routes
router.get("/me", protect, getUserInfo);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
