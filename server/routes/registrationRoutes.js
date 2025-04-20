import express from "express";
import {
  registerForEvent
} from "../controllers/registrationController.js";

import { protect,studentOnly } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Student-only
router.post("/", protect, studentOnly, registerForEvent);


export default router;
