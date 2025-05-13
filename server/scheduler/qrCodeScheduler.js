import { refreshEventQRCode } from '../utils/qrTokenUtils.js';
import { Event } from '../models/Event.js';
import cron from 'node-cron';

// Refresh event QR codes every 60 seconds, but only for active events
cron.schedule('* * * * *', async () => {
  try {
    // Only get events happening today to avoid processing all events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const activeEvents = await Event.find({
      date: { 
        $gte: today,
        $lt: tomorrow
      }
    }).select('_id title');
    
    console.log(`Refreshing QR codes for ${activeEvents.length} active events`);
    
    // Process events in parallel with Promise.all
    await Promise.all(activeEvents.map(async (event) => {
      try {
        await refreshEventQRCode(event._id);
        console.log(`Updated QR code for event: ${event.title}`);
      } catch (err) {
        console.error(`Failed to update QR for event ${event._id}:`, err);
      }
    }));
  } catch (error) {
    console.error('Error in QR code refresh scheduler:', error);
  }
});