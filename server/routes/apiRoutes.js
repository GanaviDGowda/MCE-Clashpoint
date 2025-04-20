// server/routes/apiRoutes.js

import express from 'express';
import{ Video} from '../models/Video.js';  // Assuming a Video model is present

const router = express.Router();

// Route to fetch promotion videos
router.get('/promotion-videos', async (req, res) => {
  try {
    const videos = await Video.find();  // Fetch video data from the database
    res.status(200).json(videos);       // Send an array of videos as the response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching promotion videos', error: err });
  }
});

export default router;
