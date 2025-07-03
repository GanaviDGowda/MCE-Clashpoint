import React, { useState, useEffect, useContext } from 'react';
import api from "../services/api";
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button, Card, ListGroup, Badge, Row, Col, Alert, Form } from 'react-bootstrap';
import { MapPin, Calendar, Globe, Trash2 } from 'lucide-react';
import eventLogo from '../assets/event-logo.png';
import EventQRCodeDisplayPage from './host/EventQRDisplayPage';
import ReactStars from 'react-stars';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [deletingReview, setDeletingReview] = useState(null); // Track which review is being deleted

  // Fetch event reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log('Fetching reviews for event:', id);
        const res = await api.get(`/reviews/${id}`);
        console.log('Reviews response:', res.data);
        setReviews(res.data);
        
        // Check if current user has already reviewed
        if (user) {
          const userReview = res.data.find(r => r.studentId?._id === user._id);
          if (userReview) {
            setReviewSubmitted(true);
            console.log('User has already reviewed this event');
          }
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
        setReviews([]);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id, user]);

  // Calculate average rating
  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings yet';

  // Handle review delete
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setDeletingReview(reviewId);
    
    try {
      console.log('Deleting review:', reviewId);
      await api.delete(`/reviews/review/${reviewId}`);
      
      // Remove the review from the local state
      setReviews(prevReviews => prevReviews.filter(r => r._id !== reviewId));
      
      // If it was the current user's review, allow them to review again
      if (user) {
        const deletedReview = reviews.find(r => r._id === reviewId);
        if (deletedReview && deletedReview.studentId?._id === user._id) {
          setReviewSubmitted(false);
        }
      }
      
      setFeedbackMsg({ type: "success", text: "Review deleted successfully!" });
      
      // Hide success message after 3 seconds
      setTimeout(() => setFeedbackMsg(null), 3000);
      
    } catch (err) {
      console.error("Review deletion error:", err);
      const errorMessage = err.response?.data?.message || 'Error deleting review';
      setFeedbackMsg({ type: "danger", text: errorMessage });
    } finally {
      setDeletingReview(null);
    }
  };

  // Handle review submit
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      setFeedbackMsg({ type: "danger", text: "Please select a rating between 1 and 5" });
      return;
    }

    setReviewLoading(true);
    
    try {
      console.log('Submitting review:', { rating, comment, eventId: id });
      
      const response = await api.post(`/reviews/${id}`, { 
        rating: Number(rating), 
        comment: comment.trim() 
      });
      
      console.log('Review submission response:', response.data);
      
      setReviewSubmitted(true);
      setComment("");
      setRating(0);
      setFeedbackMsg({ type: "success", text: "Review submitted successfully!" });

      // Refresh reviews
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
      
      // Hide success message after 3 seconds
      setTimeout(() => setFeedbackMsg(null), 3000);
      
    } catch (err) {
      console.error("Review submission error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Error submitting review';
      setFeedbackMsg({
        type: "danger",
        text: errorMessage
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleScanSuccess = async (qrToken) => {
    try {
      await api.post('/api/attendance/mark', { qrToken, eventId: id });
      setScanSuccess(true);
      alert('Attendance marked successfully!');
    } catch (error) {
      alert('Failed to mark attendance: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        console.log('Fetching event details for:', id);
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        console.log('Event details loaded:', response.data);

        // Check if user is registered for this event
        if (user) {
          try {
            const registrationsResponse = await api.get('/registrations');
            const registeredEvents = registrationsResponse.data;
            const isAlreadyRegistered = registeredEvents.some(reg =>
              reg.eventId && reg.eventId._id === id
            );
            setIsRegistered(isAlreadyRegistered);
          } catch (regError) {
            console.error('Error fetching registrations:', regError);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error.response || error);
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id, user]);

  const handleRegister = async () => {
    try {
      await api.post(`/registrations/${id}`);
      setIsRegistered(true);
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error.response || error);
      alert('Failed to register for the event');
    }
  };

  // Check if user can delete a review
  const canDeleteReview = (review) => {
    if (!user) return false;
    
    // User can delete if they are the author of the review
    const isReviewAuthor = review.studentId?._id === user._id;
    
    // User can delete if they are the host of the event
    const isEventHost = user.role === 'host' && event?.createdBy === user._id;
    
    return isReviewAuthor || isEventHost;
  };

  if (loading) return <div className="text-center mt-5">Loading event details...</div>;
  if (!event) return <div className="text-center mt-5">Event not found</div>;

  const dashboardLink = user?.role === 'host' ? '/host/dashboard' : '/student/dashboard';

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "800px" }}>
      <Card className="shadow rounded-4 border-0 overflow-hidden">
        <Card.Img
          variant="top"
          src={event.banner || eventLogo}
          alt="Event Banner"
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
        <Card.Body className="p-4">
          <h3 className="mb-2">{event.title}</h3>
          <p className="text-muted mb-3">{event.category} | Hosted by {event.host}</p>

          <div className="d-flex justify-content-between flex-wrap gap-3 mb-4">
            <Badge bg="dark" className="p-2 px-3">
              <Calendar size={16} className="me-2" />
              {new Date(event.date).toLocaleString()}
            </Badge>
            <Badge bg="secondary" className="p-2 px-3">
              <Globe size={16} className="me-2" />
              {event.mode}
            </Badge>
            <Badge bg="info" className="p-2 px-3">
              <MapPin size={16} className="me-2" />
              {event.venue || "Venue Not Specified"}
            </Badge>
          </div>

          {user?.role === 'host' && (
            <div className="mb-4">
              <strong>Event QR Code:</strong> <br />
              <EventQRCodeDisplayPage eventId={event._id} eventName={event.title} />
            </div>
          )}

          {user?.role === 'student' && isRegistered && (
            <div className="mt-4">
              <h4>Mark Attendance</h4>
              <p>To mark your attendance, scan the QR code provided by the event host.</p>
              <Link to={`/events/${event._id}/attendance`} className="btn btn-primary">
                Open QR Scanner
              </Link>
            </div>
          )}

          <Card.Text className="mb-4">
            <strong>Description:</strong> <br />
            {event.description}
          </Card.Text>

          <ListGroup variant="flush" className="mb-4">
            <ListGroup.Item>
              <strong>📅 Registration Deadline:</strong>{' '}
              {new Date(event.registrationEndDate).toLocaleDateString()}
            </ListGroup.Item>
            {event.link && (
              <ListGroup.Item>
                <strong>🔗 Event Link:</strong>{' '}
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  Click to Join
                </a>
              </ListGroup.Item>
            )}
            {event.additionalDetails && (
              <ListGroup.Item>
                <strong>ℹ️ Additional Info:</strong> {event.additionalDetails}
              </ListGroup.Item>
            )}
          </ListGroup>

          {user?.role === 'student' && (
            <div className="d-grid gap-2 mt-3">
              {isRegistered ? (
                <Button variant="success" disabled>
                  ✅ Already Registered
                </Button>
              ) : (
                <Button variant="primary" onClick={handleRegister}>
                  🚀 Register Now
                </Button>
              )}
            </div>
          )}

          {(event.photos?.length || event.videos?.length) && (
            <div className="mt-5">
              <h5>📸 Media Gallery</h5>

              {event.photos?.length > 0 && (
                <Row className="mt-3">
                  {event.photos.map((imgUrl, index) => (
                    <Col xs={6} md={4} key={`img-${index}`} className="mb-3">
                      <img
                        src={imgUrl}
                        alt={`Event Image ${index + 1}`}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                      />
                    </Col>
                  ))}
                </Row>
              )}

              {event.videos?.length > 0 && (
                <Row className="mt-3">
                  {event.videos.map((videoUrl, index) => (
                    <Col xs={12} key={`vid-${index}`} className="mb-4">
                      <video
                        src={videoUrl}
                        controls
                        className="w-100 rounded shadow-sm"
                        style={{ maxHeight: '400px' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      <hr className="my-4" />
      
      {/* Reviews Section */}
      <div className="mb-3">
        <h4>⭐ Event Reviews</h4>
        {reviews.length > 0 && (
          <div className="mb-3">
            <ReactStars 
              count={5} 
              value={parseFloat(averageRating) || 0} 
              size={24} 
              edit={false} 
              color2={'#ffd700'} 
            />
            <span className="ms-2 text-muted">
              {averageRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {feedbackMsg && (
        <Alert variant={feedbackMsg.type} className="mb-3">
          {feedbackMsg.text}
        </Alert>
      )}

      {/* Review Form - Only for students who haven't reviewed yet */}
      {user?.role === 'student' && !reviewSubmitted && (
        <Card className="mb-4">
          <Card.Body>
            <h5>Leave a Review</h5>
            <Form onSubmit={handleSubmitReview}>
              <Form.Group className="mb-3">
                <Form.Label>Rating *</Form.Label>
                <div>
                  <ReactStars
                    count={5}
                    value={rating}
                    onChange={newRating => setRating(newRating)}
                    size={30}
                    color2={'#ffd700'}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your experience with this event..."
                  maxLength={500}
                />
                <Form.Text className="text-muted">
                  {comment.length}/500 characters
                </Form.Text>
              </Form.Group>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={reviewLoading || rating === 0}
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Display Reviews */}
      {reviews.length > 0 ? (
        <ListGroup variant="flush" className="mb-4">
          {reviews.map((r, i) => (
            <ListGroup.Item key={r._id || i} className="py-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <strong>{r.studentId?.name || "Anonymous User"}</strong>
                  <div className="mt-1">
                    <ReactStars 
                      count={5} 
                      value={r.rating} 
                      size={18} 
                      edit={false} 
                      color2={'#ffd700'} 
                    />
                  </div>
                </div>
                <div className="text-end">
                  <small className="text-muted d-block mb-1">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </small>
                  {/* Show delete button if user can delete this review */}
                  {canDeleteReview(r) && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteReview(r._id)}
                      disabled={deletingReview === r._id}
                    >
                      <Trash2 size={14} className="me-1" />
                      {deletingReview === r._id ? 'Deleting...' : 'Delete'}
                    </Button>
                  )}
                </div>
              </div>
              {r.comment && (
                <div className="mt-2">
                  <p className="mb-0">{r.comment}</p>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card className="text-center py-4">
          <Card.Body>
            <p className="text-muted mb-0">No reviews yet. Be the first to review this event!</p>
          </Card.Body>
        </Card>
      )}

      <div className="text-center mt-4">
        <Link to={dashboardLink} className="btn btn-outline-primary me-2">
          ← Back to Dashboard
        </Link>
        <Link to="/events" className="btn btn-outline-secondary">
          ← All Events
        </Link>
      </div>
    </div>
  );
};

export default EventDetails;