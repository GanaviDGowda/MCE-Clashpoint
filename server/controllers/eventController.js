import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import mongoose from 'mongoose';

// Create Event
// controllers/eventController.js

export const createEvent = async (req, res) => {
  try {
    const bannerUrl = req.file?.path || ''; // Path is set by Cloudinary storage

    const event = new Event({
      ...req.body,
      banner: bannerUrl,
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
    // If there's a new banner file uploaded, use the new URL provided by Cloudinary.
    if (req.file) {
      req.body.banner = req.file.path; // Cloudinary will return the file URL after upload
    }

    // Find and update the event using its ID
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(updated);
  } catch (err) {
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