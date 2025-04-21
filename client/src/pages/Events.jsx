import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Card, Button, Row, Col } from "react-bootstrap";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch events from the backend
    api.get("/events")
      .then((res) => {
        setEvents(res.data); // Store events data in the state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
        setLoading(false); // Set loading to false even on error
      });
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ height: "80vh" }}>
      <h3>All Events</h3>
      <Row>
        {events.length === 0 ? (
          <div>No events found</div>
        ) : (
          events.map((event) => (
            <Col md={4} key={event._id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={event.banner || "https://via.placeholder.com/300x150"}
                  alt="Event Banner"
                />
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{event.description?.slice(0, 100)}...</Card.Text>
                  <Button variant="primary" as={Link} to={`/events/${event._id}`}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default Events;
