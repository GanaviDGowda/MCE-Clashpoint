import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { Link } from 'react-router-dom';

const HostDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events for the host on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/host'); // Replace with correct endpoint for host's events
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents(events.filter((events) => events._id !== eventId)); // Remove event from the list after deletion
        alert('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div>
      <h1>Host Dashboard</h1>
      <Link to="/host/add-event" className="btn btn-primary mb-3">
        Add New Event
      </Link>

      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Event Name</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((events) => (
              <tr key={events._id}>
                <td>{events.title}</td>
                <td>{events.category}</td>
                <td>{new Date(events.date).toLocaleDateString()}</td>
                <td>
                  <Link to={`/host/edit-event/${events._id}`} className="btn btn-warning me-2">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(events._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HostDashboard;
// This component fetches and displays the events hosted by the logged-in user. It allows the user to add, edit, or delete events.