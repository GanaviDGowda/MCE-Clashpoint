import { Review } from '../models/Review.js';

export const submitReview = async (req, res) => {
  try {
    const { eventID, rating, comment } = req.body;
    const studentID = req.user.id;

    const review = new Review({ studentID, eventID, rating, comment });
    await review.save();

    res.status(201).json({ message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ eventID: req.params.id }).populate('studentID', 'name usn');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
