import express from "express";
import {
  generateCertificate,
  getCertificate
} from "../controllers/certificateController.js";

import { protect,hostOnly, studentOnly } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Host generates certificate
router.post("/:eventId", protect, hostOnly, generateCertificate);

// Student views/downloads certificate
router.get("/:eventId", protect, studentOnly, getCertificate);

export default router;
