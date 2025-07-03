import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { Link } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Table, 
  Badge, 
  Collapse, 
  Row, 
  Col, 
  Alert,
  Modal,
  ListGroup,
  Spinner
} from 'react-bootstrap';
import { 
  Edit, 
  Trash2, 
  Users, 
  Star, 
  Calendar, 
  Eye,
  ChevronDown,
  ChevronUp,
  Mail,
  User
} from 'lucide-react';
import ReactStars from 'react-stars';

const HostDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipants, setSelectedParticipants] = useState({});
  const [selectedReviews, setSelectedReviews] = useState({});
  const [loadingParticipants, setLoadingParticipants] = useState({});
  const [loadingReviews, setLoadingReviews] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentEventReviews, setCurrentEventReviews] = useState([]);
  const [currentEventName, setCurrentEventName] = useState('');
  const [deletingReview, setDeletingReview] = useState(null);
  // Add new state for storing basic stats
  const [eventStats, setEventStats] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/host');
        setEvents(response.data);
        
        // Load basic stats for all events
        const statsPromises = response.data.map(async (event) => {
          try {
            const [participantsRes, reviewsRes] = await Promise.all([
              api.get(`/events/${event._id}/registrations`),
              api.get(`/reviews/${event._id}`)
            ]);
            
            const reviews = reviewsRes.data;
            const averageRating = reviews.length > 0 
              ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
              : 0;
            
            return {
              eventId: event._id,
              participantCount: participantsRes.data.length,
              reviewCount: reviews.length,
              averageRating: averageRating
            };
          } catch (error) {
            console.error(`Error fetching stats for event ${event._id}:`, error);
            return {
              eventId: event._id,
              participantCount: 0,
              reviewCount: 0,
              averageRating: 0
            };
          }
        });
        
        const statsResults = await Promise.all(statsPromises);
        const statsMap = {};
        statsResults.forEach(stat => {
          statsMap[stat.eventId] = stat;
        });
        setEventStats(statsMap);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This will also delete all associated reviews and registrations.')) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents(events.filter((event) => event._id !== eventId));
        // Remove from eventStats as well
        setEventStats(prev => {
          const updated = { ...prev };
          delete updated[eventId];
          return updated;
        });
        alert('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const toggleParticipants = async (eventId) => {
    if (selectedParticipants[eventId]) {
      // Collapse participant list
      setSelectedParticipants((prev) => {
        const updated = { ...prev };
        delete updated[eventId];
        return updated;
      });
    } else {
      setLoadingParticipants((prev) => ({ ...prev, [eventId]: true }));
      try {
        const res = await api.get(`/events/${eventId}/registrations`);
        setSelectedParticipants((prev) => ({
          ...prev,
          [eventId]: res.data
        }));
      } catch (err) {
        console.error("Error fetching participants:", err);
        alert("Failed to load participants");
      } finally {
        setLoadingParticipants((prev) => ({ ...prev, [eventId]: false }));
      }
    }
  };

  const toggleReviews = async (eventId) => {
    if (selectedReviews[eventId]) {
      // Collapse reviews list
      setSelectedReviews((prev) => {
        const updated = { ...prev };
        delete updated[eventId];
        return updated;
      });
    } else {
      setLoadingReviews((prev) => ({ ...prev, [eventId]: true }));
      try {
        const res = await api.get(`/reviews/${eventId}`);
        setSelectedReviews((prev) => ({
          ...prev,
          [eventId]: res.data
        }));
      } catch (err) {
        console.error("Error fetching reviews:", err);
        alert("Failed to load reviews");
      } finally {
        setLoadingReviews((prev) => ({ ...prev, [eventId]: false }));
      }
    }
  };

  const openReviewModal = async (eventId, eventTitle) => {
    setCurrentEventName(eventTitle);
    setShowReviewModal(true);
    try {
      const res = await api.get(`/reviews/${eventId}`);
      setCurrentEventReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setCurrentEventReviews([]);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setDeletingReview(reviewId);
    try {
      await api.delete(`/reviews/review/${reviewId}`);
      
      // Remove from current modal reviews
      setCurrentEventReviews(prev => prev.filter(r => r._id !== reviewId));
      
      // Remove from selected reviews if expanded
      setSelectedReviews(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(eventId => {
          updated[eventId] = updated[eventId].filter(r => r._id !== reviewId);
        });
        return updated;
      });
      
      // Update event stats
      setEventStats(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(eventId => {
          const eventReviews = selectedReviews[eventId] || currentEventReviews;
          const remainingReviews = eventReviews.filter(r => r._id !== reviewId);
          if (remainingReviews.length !== eventReviews.length) {
            updated[eventId] = {
              ...updated[eventId],
              reviewCount: updated[eventId].reviewCount - 1,
              averageRating: remainingReviews.length > 0 
                ? (remainingReviews.reduce((sum, review) => sum + review.rating, 0) / remainingReviews.length).toFixed(1)
                : 0
            };
          }
        });
        return updated;
      });
      
      alert('Review deleted successfully');
    } catch (err) {
      console.error("Error deleting review:", err);
      alert('Failed to delete review');
    } finally {
      setDeletingReview(null);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getEventStats = (eventId) => {
    // Use the pre-loaded stats instead of calculating from selected data
    return eventStats[eventId] || {
      participantCount: 0,
      reviewCount: 0,
      averageRating: 0
    };
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <Users className="me-2" size={32} />
          Host Dashboard
        </h1>
        <Link to="/host/add-event" className="btn btn-primary">
          <Calendar className="me-2" size={16} />
          Add New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h5>No events found</h5>
          <p>Create your first event to get started!</p>
          <Link to="/host/add-event" className="btn btn-primary">
            Create Event
          </Link>
        </Alert>
      ) : (
        <div className="row">
          {events.map((event) => {
            const stats = getEventStats(event._id);
            return (
              <div key={event._id} className="col-12 mb-4">
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <Row className="align-items-center">
                      <Col md={6}>
                        <h5 className="mb-1">{event.title}</h5>
                        <div className="d-flex gap-2 flex-wrap">
                          <Badge bg="secondary">{event.category}</Badge>
                          <Badge bg="info">
                            <Calendar size={12} className="me-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </Badge>
                        </div>
                      </Col>
                      <Col md={6} className="text-md-end">
                        <div className="d-flex gap-2 justify-content-md-end justify-content-start flex-wrap">
                          <Link 
                            to={`/host/edit-event/${event._id}`} 
                            className="btn btn-warning btn-sm"
                          >
                            <Edit size={14} className="me-1" />
                            Edit
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteEvent(event._id)}
                          >
                            <Trash2 size={14} className="me-1" />
                            Delete
                          </Button>
                          <Link 
                            to={`/events/${event._id}`} 
                            className="btn btn-outline-primary btn-sm"
                          >
                            <Eye size={14} className="me-1" />
                            View Details
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </Card.Header>
                  
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={4}>
                        <div className="text-center">
                          <h6 className="text-muted mb-1">Participants</h6>
                          <Badge bg="primary" className="fs-6">
                            {stats.participantCount}
                          </Badge>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <h6 className="text-muted mb-1">Reviews</h6>
                          <Badge bg="success" className="fs-6">
                            {stats.reviewCount}
                          </Badge>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <h6 className="text-muted mb-1">Rating</h6>
                          {stats.reviewCount > 0 ? (
                            <div className="d-flex align-items-center justify-content-center">
                              <ReactStars
                                count={5}
                                value={parseFloat(stats.averageRating)}
                                size={16}
                                edit={false}
                                color2={'#ffd700'}
                              />
                              <span className="ms-1 small">({stats.averageRating})</span>
                            </div>
                          ) : (
                            <Badge bg="secondary">No ratings</Badge>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => toggleParticipants(event._id)}
                        disabled={loadingParticipants[event._id]}
                      >
                        {loadingParticipants[event._id] ? (
                          <Spinner size="sm" />
                        ) : (
                          <>
                            <Users size={14} className="me-1" />
                            {selectedParticipants[event._id] ? "Hide" : "View"} Participants
                            {selectedParticipants[event._id] ? 
                              <ChevronUp size={14} className="ms-1" /> : 
                              <ChevronDown size={14} className="ms-1" />
                            }
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => toggleReviews(event._id)}
                        disabled={loadingReviews[event._id]}
                      >
                        {loadingReviews[event._id] ? (
                          <Spinner size="sm" />
                        ) : (
                          <>
                            <Star size={14} className="me-1" />
                            {selectedReviews[event._id] ? "Hide" : "View"} Reviews
                            {selectedReviews[event._id] ? 
                              <ChevronUp size={14} className="ms-1" /> : 
                              <ChevronDown size={14} className="ms-1" />
                            }
                          </>
                        )}
                      </Button>

                      {stats.reviewCount > 0 && (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => openReviewModal(event._id, event.title)}
                        >
                          <Eye size={14} className="me-1" />
                          View All Reviews
                        </Button>
                      )}
                    </div>

                    {/* Participants Section */}
                    <Collapse in={!!selectedParticipants[event._id]}>
                      <div className="mt-3">
                        <Card className="border-info">
                          <Card.Header className="bg-info bg-opacity-10">
                            <h6 className="mb-0">
                              <Users size={16} className="me-2" />
                              Participants ({selectedParticipants[event._id]?.length || 0})
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {selectedParticipants[event._id]?.length === 0 ? (
                              <Alert variant="info" className="mb-0">
                                No participants registered yet
                              </Alert>
                            ) : (
                              <div className="row">
                                {selectedParticipants[event._id]?.map((p, index) => (
                                  <div key={p._id} className="col-md-6 mb-2">
                                    <Card className="border-0 bg-light">
                                      <Card.Body className="p-2">
                                        <div className="d-flex align-items-center">
                                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                                               style={{ width: '32px', height: '32px' }}>
                                            <User size={16} className="text-white" />
                                          </div>
                                          <div>
                                            <strong>{p.studentId?.name || "Unknown"}</strong>
                                            <br />
                                            <small className="text-muted">
                                              {p.studentId?.usn || "N/A"} | 
                                              <Mail size={12} className="ms-1 me-1" />
                                              {p.studentId?.email}
                                            </small>
                                          </div>
                                        </div>
                                      </Card.Body>
                                    </Card>
                                  </div>
                                ))}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </div>
                    </Collapse>

                    {/* Reviews Section */}
                    <Collapse in={!!selectedReviews[event._id]}>
                      <div className="mt-3">
                        <Card className="border-success">
                          <Card.Header className="bg-success bg-opacity-10">
                            <h6 className="mb-0">
                              <Star size={16} className="me-2" />
                              Reviews ({selectedReviews[event._id]?.length || 0})
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {selectedReviews[event._id]?.length === 0 ? (
                              <Alert variant="info" className="mb-0">
                                No reviews yet
                              </Alert>
                            ) : (
                              <div className="row">
                                {selectedReviews[event._id]?.slice(0, 3).map((review) => (
                                  <div key={review._id} className="col-md-4 mb-3">
                                    <Card className="border-0 bg-light h-100">
                                      <Card.Body className="p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                          <div>
                                            <strong>{review.studentId?.name || "Anonymous"}</strong>
                                            <ReactStars
                                              count={5}
                                              value={review.rating}
                                              size={16}
                                              edit={false}
                                              color2={'#ffd700'}
                                            />
                                          </div>
                                          <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteReview(review._id)}
                                            disabled={deletingReview === review._id}
                                          >
                                            <Trash2 size={12} />
                                          </Button>
                                        </div>
                                        {review.comment && (
                                          <p className="small text-muted mb-0">
                                            {review.comment.length > 100 
                                              ? review.comment.substring(0, 100) + '...' 
                                              : review.comment}
                                          </p>
                                        )}
                                      </Card.Body>
                                    </Card>
                                  </div>
                                ))}
                                {selectedReviews[event._id]?.length > 3 && (
                                  <div className="col-12">
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => openReviewModal(event._id, event.title)}
                                    >
                                      View All {selectedReviews[event._id].length} Reviews
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </div>
                    </Collapse>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Reviews Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Star className="me-2" size={20} />
            Reviews for "{currentEventName}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentEventReviews.length === 0 ? (
            <Alert variant="info">No reviews for this event yet.</Alert>
          ) : (
            <ListGroup variant="flush">
              {currentEventReviews.map((review) => (
                <ListGroup.Item key={review._id} className="border-0 border-bottom">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-3">{review.studentId?.name || "Anonymous"}</strong>
                        <ReactStars
                          count={5}
                          value={review.rating}
                          size={18}
                          edit={false}
                          color2={'#ffd700'}
                        />
                        <small className="text-muted ms-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      {review.comment && (
                        <p className="text-muted mb-0">{review.comment}</p>
                      )}
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={deletingReview === review._id}
                    >
                      {deletingReview === review._id ? (
                        <Spinner size="sm" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HostDashboard;