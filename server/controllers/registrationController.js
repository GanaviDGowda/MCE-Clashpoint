import { Registration } from '../models/Registration.js';

export const registerForEvent = async (req, res) => {
  try {
    const { eventID } = req.body;
    const studentID = req.user.id;

    const exists = await Registration.findOne({ studentId, eventId });
    if (exists) return res.status(400).json({ message: 'Already registered' });

    const registration = new Registration({ studentId, eventId });
    await registration.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
