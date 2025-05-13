// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Middleware to protect routes with JWT
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use "id" as payload field
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

// Middleware to allow only hosts
export const hostOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'host') {
    return res.status(403).json({ message: 'Access denied: Hosts only' });
  }
  next();
};

// Middleware to allow only students
export const studentOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied: Students only' });
  }
  next();
};
