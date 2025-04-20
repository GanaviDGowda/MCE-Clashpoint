// config/jwtConfig.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  console.log(JSON.parse(atob(token.split('.')[1])));
  // Decode the token to get the payload
  return jwt.verify(token, process.env.JWT_SECRET);
};
