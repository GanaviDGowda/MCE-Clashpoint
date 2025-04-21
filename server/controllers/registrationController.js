import { Registration } from '../models/Registration.js';

// server/controllers/registrationController.js
export const registerForEvent = async (req, res) => {
  try {
    // Get eventId from params
    const eventId = req.params.eventId;
    const studentId = req.user.id;

    // Check if already registered
    const exists = await Registration.findOne({ 
      studentId, 
      eventId 
    });
    
    if (exists) {
      return res.status(400).json({ message: 'Already registered' });
    }

    // Create new registration
    const registration = new Registration({ studentId, eventId });
    await registration.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getStudentRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ 
      studentId: req.user.id 
    }).populate('eventId');
    
    res.status(200).json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};