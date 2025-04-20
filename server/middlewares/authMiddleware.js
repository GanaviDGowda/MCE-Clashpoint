// Protect middleware (check for JWT token)
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';


export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader); // Debug log
     // Debug log
     
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log  
    
    // Make sure we're using 'id' not 'userId'
    const user = await User.findById(decoded.id).select('-password');
    console.log("Found user:", user); // Debug log

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

// Host-only middleware (check if the user role is 'host')
export const hostOnly = (req, res, next) => {
  
  if (req.user.role !== 'host') {
    return res.status(403).json({ message: 'Access denied: Hosts only' });
  }
  console.log
  next();
};

// Student-only middleware (check if the user role is 'student')
export const studentOnly = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied: Students only' });
  }
  next();
};
