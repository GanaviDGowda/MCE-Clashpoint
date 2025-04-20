import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import notFoundImage from '../assets/404.png'; // Make sure you have an image or remove this

const NotFound = () => {
  return (
    <Container className="text-center my-5 py-5">
      <Row className="justify-content-center">
        <Col md={8}>
        <h1>Hello, this is NotFound page</h1>
          <img
            src={notFoundImage}
            alt="404 Not Found"
            className="img-fluid mb-4"
            style={{ maxWidth: '400px' }}
          />
          <h1 className="display-4 fw-bold">404</h1>
          <p className="lead">Oops! The page you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="primary" className="mt-3">
              Go to Home
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
