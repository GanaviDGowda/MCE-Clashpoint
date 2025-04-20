import { Certificate } from '../models/Certificate.js';
import { generateCertificateURL } from '../utils/certificateGenerator.js';

export const generateCertificate = async (req, res) => {
  try {
    const { studentID, eventID } = req.body;

    const url = await generateCertificateURL(studentID, eventID);

    const certificate = new Certificate({ studentID, eventID, certificateURL: url });
    await certificate.save();

    res.status(201).json({ message: 'Certificate generated', url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      studentID: req.user.id,
      eventID: req.params.eventID,
    });

    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
