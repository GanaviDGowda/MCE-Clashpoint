import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import mongoose from 'mongoose';

// Create Event
export const createEvent = async (req, res) => {
  try {
    const bannerUrl = req.uploadedFiles?.banner?.[0] || ''; // Fetch uploaded banner URL

    // Process photos and videos if they exist
    const photoUrls = req.uploadedFiles?.photos || [];
    const videoUrls = req.uploadedFiles?.videos || [];

    const event = new Event({
      ...req.body,
      banner: bannerUrl,
      photos: photoUrls,
      videos: videoUrls,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Event
export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log('Fetching event with ID:', eventId);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(eventId)
      .populate('createdBy', 'name email')  // Populating creator info
      .lean(); // Convert to plain JavaScript object
      
    console.log('Found event:', event);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    console.log('Updating event with ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.uploadedFiles);

    // Validate the event ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    // First check if the event exists
    const eventExists = await Event.findById(req.params.id);
    if (!eventExists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // If there's a new banner file uploaded, use the new URL provided by Cloudinary
    if (req.uploadedFiles?.banner) {
      updateData.banner = req.uploadedFiles.banner[0];
      console.log('New banner URL:', updateData.banner);
    }

    // Process new photos if they exist
    if (req.uploadedFiles?.photos && req.uploadedFiles.photos.length > 0) {
      if (req.body.appendPhotos === 'true') {
        const newPhotos = req.uploadedFiles.photos.map(file => file);
        updateData.photos = [...(eventExists.photos || []), ...newPhotos];
      } else {
        updateData.photos = req.uploadedFiles.photos.map(file => file);
      }
    }

    // Process new videos if they exist
    if (req.uploadedFiles?.videos && req.uploadedFiles.videos.length > 0) {
      if (req.body.appendVideos === 'true') {
        const newVideos = req.uploadedFiles.videos.map(file => file);
        updateData.videos = [...(eventExists.videos || []), ...newVideos];
      } else {
        updateData.videos = req.uploadedFiles.videos.map(file => file);
      }
    }

    console.log('Final update data:', updateData);

    // Find and update the event using its ID
    const updated = await Event.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    console.log('Event updated successfully:', updated);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: err.message });
  }
};


// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Registered Users for an Event
export const getRegisteredUsers = async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.id })
      .populate('studentId', 'name email usn');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get events by host
export const getEventByHost = async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id);
    console.log("User role:", req.user.role);

    const events = await Event.find({ createdBy: req.user.id });

    console.log("Found events:", events);

    if (!events) {
      res.status(200).json([]);
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error in getEventByHost:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get events by student
export const getEventsByStudent = async (req, res) => {
  try {
    console.log("Fetching student events...");
    console.log("req.user:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated properly' });
    }

    const studentId = req.user.id; // Should be ObjectId
    console.log("Student ID:", studentId);

    // Find registrations where studentId matches logged in student
    const registrations = await Registration.find({ studentId: studentId })
      .populate('eventId');

    console.log("Found registrations:", registrations);

    // Extract events from registrations, handle potential null values
    const events = registrations
      .filter(reg => reg.eventId) // Filter out null eventId values
      .map(reg => reg.eventId);

    console.log("Mapped events:", events);

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error in getEventsByStudent:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all events with videos (for the home page promotion section)
export const getEventsWithVideos = async (req, res) => {
  try {
    const eventsWithVideos = await Event.find({
      videos: { $exists: true, $ne: [] }
    })
    .sort({ createdAt: -1 }) // Get the most recent events first
    .limit(6) // Limit to 6 videos for the carousel
    .populate('createdBy', 'name');
    
    res.status(200).json(eventsWithVideos);
  } catch (error) {
    console.error("Error fetching events with videos:", error);
    res.status(500).json({ message: 'Server error' });
  }
};