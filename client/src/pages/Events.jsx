import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Card, Button, Row, Col } from "react-bootstrap";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/events")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ minHeight: "80vh" }}>
      <h3 className="mb-4">All Events</h3>
      <Row>
        {events.length === 0 ? (
          <div>No events found</div>
        ) : (
          events.map((event) => (
            <Col md={4} key={event._id} className="mb-4">
              <Card className="h-100">
                <div
                  style={{
                    height: "180px",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={event.banner || "https://via.placeholder.com/300x150"}
                    alt="Event Banner"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    {event.description?.slice(0, 100)}...
                  </Card.Text>
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
