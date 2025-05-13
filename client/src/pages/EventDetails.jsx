import React, { useState, useEffect, useContext } from 'react';
import api from "../services/api";
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button, Card, ListGroup, Badge, Row, Col } from 'react-bootstrap';
import { MapPin, Calendar, Globe } from 'lucide-react';
import eventLogo from '../assets/event-logo.png';
import EventQRCodeDisplayPage from './host/EventQRDisplayPage';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  // Move the state outside of useEffect
  const [scanSuccess, setScanSuccess] = useState(false);

  // Move the handler function outside of useEffect
  const handleScanSuccess = async (qrToken) => {
    try {
      await api.post('/api/attendance/mark', { qrToken, eventId: id });
      setScanSuccess(true);
      alert('Attendance marked successfully!');
    } catch (error) {
      alert('Failed to mark attendance: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);

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

        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error.response || error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

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

          {/* Show Register button only if user is a student */}
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

          {/* Media Section */}
          {(event.photos?.length || event.videos?.length) && (
            <div className="mt-5">
              <h5>📸 Media Gallery</h5>

              {/* photos */}
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

              {/* Videos */}
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