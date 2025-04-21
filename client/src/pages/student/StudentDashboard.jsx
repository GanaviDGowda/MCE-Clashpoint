import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the events the student has registered for
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/student'); // Endpoint to fetch student events
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div>
      <h1>Your Dashboard</h1>
      {events.length === 0 ? (
        <p>You haven't registered for any events yet.</p>
      ) : (
        <div>
          <h3>Registered Events</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Event Name</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Certificate</th>
                <th scope="col">Review</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.attended ? 'Attended' : 'Not Attended'}</td>
                  <td>
                    {event.attended && !event.certificate ? (
                      <button
                        onClick={() => generateCertificate(event._id)}
                        className="btn btn-success"
                      >
                        Generate Certificate
                      </button>
                    ) : (
                      <span>{event.certificate ? 'Certificate Generated' : 'No Certificate'}</span>
                    )}
                  </td>
                  <td>
                    {!event.attended ? (
                      <span>Cannot review without attendance</span>
                    ) : (
                      <Link to={`/review/${event._id}`} className="btn btn-primary">
                        Write a Review
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Function to generate the certificate for an event
  const generateCertificate = async (eventId) => {
    try {
      await api.post(`/events/student/${eventId}/generate-certificate`);
      alert('Certificate generated successfully');
      // Reload the page or refetch the events
      const response = await api.get('/events/student');
      setEvents(response.data);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate');
    }
  };
};

export default StudentDashboard;
