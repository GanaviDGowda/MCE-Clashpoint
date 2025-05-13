import crypto from 'crypto';
import { Event } from '../models/Event.js';

const SECRET = process.env.QR_SECRET || 'your_super_secret_key';

// Generate time-based HMAC token for QR with expiry
export function generateQRToken(eventId, timestamp) {
  const data = `${eventId}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', SECRET).update(data).digest('hex');
  return `${eventId}.${timestamp}.${hmac}`;
}

// Verify the QR token, ensuring it's within allowed drift window
export function verifyQRToken(token, allowedDrift = 60) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [eventId, timestamp, hash] = parts;
    
    // Verify the hash
    const data = `${eventId}:${timestamp}`;
    const expectedHash = crypto.createHmac('sha256', SECRET).update(data).digest('hex');
    if (hash !== expectedHash) return null;

    // Verify time window
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > allowedDrift) return null;

    return eventId;
  } catch (err) {
    console.error('QR token verification error:', err);
    return null;
  }
}

// Refresh event QR token
export async function refreshEventQRCode(eventId) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const token = generateQRToken(eventId, timestamp);

    // Update the event with new expiry time
    await Event.findByIdAndUpdate(eventId, {
      qrExpiry: new Date(Date.now() + 60000) // Set expiry for 1 minute
    });
    
    return token;
  } catch (err) {
    console.error('Error refreshing QR code:', err);
    throw err;
  }
}