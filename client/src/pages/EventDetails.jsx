import React, { useState, useEffect } from 'react';
import api from "../services/api";
import { useParams, Link } from 'react-router-dom';
import { Button, Card, ListGroup, Badge } from 'react-bootstrap';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Debug: Log the exact URL being called
        console.log('Fetching event from:', `/events/${id}`);
        
        const response = await api.get(`/events/${id}`);
        console.log('Event response:', response.data);
        setEvent(response.data);

        // Check if the student is already registered for this specific event
        try {
          console.log('Fetching registrations');
          const registrationsResponse = await api.get('/registrations');
          console.log('Registrations response:', registrationsResponse.data);
          
          const registeredEvents = registrationsResponse.data;
          const isAlreadyRegistered = registeredEvents.some(reg => 
            reg.eventId && reg.eventId._id === id
          );
          setIsRegistered(isAlreadyRegistered);
        } catch (regError) {
          console.error('Error fetching registrations:', regError);
          // Continue even if registration check fails
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error.response || error);
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleRegister = async () => {
    try {
      console.log('Registering for event:', id);
      // Using eventId as URL parameter as configured in the route
      const response = await api.post(`/registrations/${id}`);
      console.log('Registration response:', response.data);
      setIsRegistered(true);
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error.response || error);
      alert('Failed to register for the event');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px", height: "80vh"}}>
      <Card className="shadow-lg">
        <Card.Img variant="top" src={event.banner || '/default-banner.jpg'} alt="Event Banner" />
        <Card.Body>
          <Card.Title>{event.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{event.category}</Card.Subtitle>
          <Card.Text>{event.description}</Card.Text>
          
          <div className="d-flex justify-content-between">
            <div>
              <Badge pill bg="info">
                {new Date(event.date).toLocaleDateString()}
              </Badge>
            </div>
            <div>
              <Badge pill bg="secondary">
                {event.mode}
              </Badge>
            </div>
          </div>

          <ListGroup className="mt-3">
            <ListGroup.Item>
              <strong>Host:</strong> {event.host}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Registration Deadline:</strong> {new Date(event.registrationEndDate).toLocaleDateString()}
            </ListGroup.Item>
            {event.link && (
              <ListGroup.Item>
                <strong>Event Link:</strong> <a href={event.link} target="_blank" rel="noopener noreferrer">Join Event</a>
              </ListGroup.Item>
            )}
            {event.additionalDetails && (
              <ListGroup.Item>
                <strong>Additional Details:</strong> {event.additionalDetails}
              </ListGroup.Item>
            )}
          </ListGroup>

          {isRegistered ? (
            <Button variant="success" className="mt-4 w-100" disabled>
              Already Registered
            </Button>
          ) : (
            <Button variant="primary" className="mt-4 w-100" onClick={handleRegister}>
              Register for Event
            </Button>
          )}
        </Card.Body>
      </Card>

      <div className="mt-4 text-center">
        <Link to="/student/dashboard" className="btn btn-outline-primary mx-2">
          Back to Dashboard
        </Link>
        <Link to="/events" className="btn btn-outline-secondary mx-2">
          Back to Events
        </Link>
      </div>
    </div>
  );
};

export default EventDetails;