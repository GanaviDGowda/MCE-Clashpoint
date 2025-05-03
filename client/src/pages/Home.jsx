import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';
import api from '../services/api';

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
  const [promotionVideos, setPromotionVideos] = useState([]);
  const [loading, setLoading] = useState({ events: true, videos: true });
  const [muted, setMuted] = useState(true); // Track the mute state

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading((prev) => ({ ...prev, events: true }));
        const res = await api.get('/events');
        setEvents(res.data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading((prev) => ({ ...prev, events: false }));
      }
    };

    const fetchVideos = async () => {
      try {
        setLoading((prev) => ({ ...prev, videos: true }));
        const res = await api.get('/events/videos');
        setPromotionVideos(res.data || []);
      } catch (error) {
        console.error('Error fetching event videos:', error);
      } finally {
        setLoading((prev) => ({ ...prev, videos: false }));
      }
    };

    fetchEvents();
    fetchVideos();
  }, []);

  // Toggle mute state
  const handleMuteToggle = () => {
    setMuted(!muted);
  };

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
          {Object.keys(categoryImages).map((cat, index) => (
            <Col xs={6} md={3} key={index} className="mb-4">
              <Card className="category-card h-100 shadow-sm">
                <Card.Img variant="top" src={categoryImages[cat]} alt={cat} className="p-3" />
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
        {loading.videos ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : promotionVideos.length > 0 ? (
          <Row className="justify-content-center">
            {promotionVideos.map((event) => (
              <Col xs={12} md={4} key={event._id} className="mb-4">
                <Link to={`/events/${event._id}`} className="text-decoration-none text-dark">
                  <Card className="video-card text-center shadow-sm h-100">
                    <div className="video-container">
                      {event.videos && event.videos[0] ? (
                        <video
                          className="video-preview"
                          src={event.videos[0]}
                          poster={event.banner || eventLogo}
                          autoPlay
                          loop
                          muted={muted} // Apply mute state here
                          playsInline
                          onError={() => {
                            console.error('Error loading video');
                          }}
                        />
                      ) : (
                        <div className="video-thumbnail d-flex justify-content-center align-items-center">
                          <img src={playIcon} alt="Play Icon" width={40} />
                        </div>
                      )}
                    </div>
                    <Card.Body>
                      <Card.Title>{event.title}</Card.Title>
                      <Card.Text className="text-muted">
                        By {event.createdBy?.name || 'Unknown Host'}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-4">
            <p>No promotion videos are available at the moment.</p>
          </div>
        )}
      </Container>

      {/* Mute Button */}
      <div className="text-center my-4">
        <button onClick={handleMuteToggle} className="btn btn-primary">
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>

      {/* Explore Section */}
      <Container fluid className="my-5 px-4">
        <h3 className="text-center mb-4">Explore</h3>
        {loading.events ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : events.length > 0 ? (
          <div className="explore-slider d-flex overflow-auto pb-3">
            {events.map((event) => (
              <Link
                to={`/events/${event._id}`}
                key={event._id}
                className="text-decoration-none text-dark"
              >
                <Card className="me-3 shadow-sm flex-shrink-0 explore-card">
                  <Card.Img
                    variant="top"
                    src={event.banner || eventLogo}
                    alt={event.title}
                  />
                  <Card.Body>
                    <Card.Title className="text-center">{event.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p>No events are available at the moment.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
