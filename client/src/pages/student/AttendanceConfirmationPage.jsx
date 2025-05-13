import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { CheckCircle } from 'lucide-react';

const AttendanceConfirmationPage = () => {
  // Get query parameters
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventName = searchParams.get('eventName') || 'the event';
  const success = searchParams.get('success') === 'true';
  const message = searchParams.get('message') || (success 
    ? 'Your attendance has been successfully recorded.'
    : 'There was an issue recording your attendance. Please try again or contact the event host.');

  return (
    <Container className="mt-5">
      <Card className="shadow border-0 text-center">
        <Card.Body className="p-5">
          {success ? (
            <div className="text-success mb-4">
              <CheckCircle size={80} />
            </div>
          ) : (
            <div className="text-danger mb-4">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          )}
          
          <h2 className="mb-3">
            {success ? 'Attendance Confirmed!' : 'Attendance Error'}
          </h2>
          
          <Alert variant={success ? "success" : "danger"}>
            {message}
          </Alert>
          
          <p className="mb-4">
            {success 
              ? `Thank you for attending ${eventName}!` 
              : `Please try again or contact the event organizer for assistance.`}
          </p>
          
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              onClick={() => navigate('/student/dashboard')}
            >
              Return to Dashboard
            </Button>
            
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/events')}
            >
              Browse Events
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AttendanceConfirmationPage;