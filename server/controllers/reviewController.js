import { Review } from '../models/Review.js';
import { Event } from '../models/Event.js'; // Make sure to import Event model

export const submitReview = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    console.log('Submit review request:', { eventId, rating, comment, userId });

    // Check if user already reviewed this event
    const alreadyReviewed = await Review.findOne({ eventId, studentId: userId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already submitted a review for this event.' });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Create new review
    const newReview = new Review({
      studentId: userId,
      eventId,
      rating: Number(rating),
      comment: comment || ''
    });

    await newReview.save();
    console.log('Review saved:', newReview);

    // Populate the review before sending response
    const populatedReview = await Review.findById(newReview._id)
      .populate('studentId', 'name email');

    res.status(201).json({
      message: 'Review submitted successfully',
      review: populatedReview
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error while submitting review', error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    console.log('Fetching reviews for event:', eventId);

    const reviews = await Review.find({ eventId })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 }); // Show newest reviews first

    console.log('Found reviews:', reviews.length);

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews', message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    console.log('Delete review request:', { reviewId, userId });

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Find the event to check if user is the host
    const event = await Event.findById(review.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check authorization: either the review author or the event host
    const isReviewAuthor = review.studentId.toString() === userId;
    const isEventHost = event.createdBy.toString() === userId;

    console.log('Authorization check:', { 
      isReviewAuthor, 
      isEventHost, 
      reviewStudentId: review.studentId.toString(), 
      eventCreatedBy: event.createdBy.toString(),
      currentUserId: userId 
    });

    if (!isReviewAuthor && !isEventHost) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this review. Only the review author or event host can delete reviews.' 
      });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    
    console.log('Review deleted successfully');
    res.status(200).json({ message: 'Review deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error while deleting review', error: error.message });
  }
};