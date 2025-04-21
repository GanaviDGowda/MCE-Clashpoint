import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // 🔁 Added for navigation
import './Home.css';
import api from "../services/api";

import heroBackground from '../assets/hero-banner.jpg';
import eventLogo from '../assets/event-logo.png';
import playIcon from '../assets/play-icon.png';
import seminarImg from '../assets/seminar.png';
import workshopImg from '../assets/workshop.png';
import techEventsImg from '../assets/tech-events.png';
import nonTechEventsImg from '../assets/non-tech-events.png';

const categoryImages = {
  Seminar: seminarImg,
  Workshop: workshopImg,
  'Tech Events': techEventsImg,
  'Non-Tech Events': nonTechEventsImg,
};

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('http://localhost:5000/api/events');
        setEvents(res.data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner-wrapper">
        <div
          className="hero-banner"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="overlay" />
          <div className="hero-content text-center text-white">
            <h1 className="display-4 fw-bold">MCE ClashPoint</h1>
            <p className="lead w-75 mx-auto">
              Showcase your talent, compete with the best, and unlock new opportunities! Register, participate, and track your achievements—all in one place!
            </p>
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <Container className="my-5">
        <h3 className="text-center mb-4">Browse by Category</h3>
        <Row className="justify-content-center text-center">
          {['Seminar', 'Workshop', 'Tech Events', 'Non-Tech Events'].map((cat, index) => (
            <Col xs={6} md={3} key={index} className="mb-4">
              <Card className="category-card h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={categoryImages[cat]}
                  alt={cat}
                  className="p-3"
                />
                <Card.Body>
                  <Card.Title>{cat}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Event Promotion Videos */}
      <Container className="my-5">
        <h3 className="text-center mb-4">Event Promotion Videos</h3>
        <Row className="justify-content-center">
          {[1, 2, 3].map((item) => (
            <Col xs={12} md={4} key={item} className="mb-4">
              <Card className="video-card text-center shadow-sm">
                <div className="video-thumbnail d-flex justify-content-center align-items-center">
                  <img src={playIcon} alt="Play Icon" width={40} />
                </div>
                <Card.Body>
                  <Card.Title>Event Promotion Video</Card.Title>
                  <Card.Text>event description</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Explore Slider Section */}
      <Container fluid className="my-5 px-4">
        <h3 className="text-center mb-4">Explore</h3>
        <div className="explore-slider d-flex overflow-auto pb-3">
          {events.map((event) => (
            <Link
              to={`/events/${event._id}`}
              key={event._id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Card className="me-3 shadow-sm flex-shrink-0 explore-card">
                <Card.Img
                  variant="top"
                  src={event.banner || eventLogo}
                  alt={event.name}
                />
                <Card.Body>
                  <Card.Title className="text-center">{event.title}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Home;
