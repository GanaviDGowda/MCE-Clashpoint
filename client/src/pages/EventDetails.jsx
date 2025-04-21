import React, { useState, useEffect } from 'react';
import api from "../services/api";
import { useParams, Link } from 'react-router-dom';
import { Button, Card, ListGroup, Badge } from 'react-bootstrap';
import { MapPin, Calendar, Globe, Users, Info } from 'lucide-react';
import eventLogo from '../assets/event-logo.png'; // Placeholder for event logo

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

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
      const response = await api.post(`/registrations/${id}`);
      setIsRegistered(true);
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error.response || error);
      alert('Failed to register for the event');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading event details...</div>;
  if (!event) return <div className="text-center mt-5">Event not found</div>;

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "800px" }}>
      <Card className="shadow rounded-4 border-0 overflow-hidden">
        <Card.Img
          variant="top"
          //src={event.banner || eventLogo}
          src={eventLogo}
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

          <Card.Text className="mb-4">
            <strong>Description:</strong> <br />
            {event.description}
          </Card.Text>

          <ListGroup variant="flush">
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

          <div className="d-grid gap-2 mt-4">
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
        </Card.Body>
      </Card>

      <div className="text-center mt-4">
        <Link to="/student/dashboard" className="btn btn-outline-primary me-2">
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
