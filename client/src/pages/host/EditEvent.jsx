import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // Import trash icon

const EditEvent = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    category: '',
    date: '',
    registrationEndDate: '',
    mode: 'online',
    link: '',
    host: '',
    banner: '',
    additionalDetails: '',
  });

  const [loading, setLoading] = useState(true);

  // Fetch the existing event details when the component mounts
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        setEventData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        alert('Failed to fetch event details');
        setLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      if (response.status === 200) {
        alert('Event updated successfully');
        navigate('/some-route'); // Redirect to host dashboard after successful update
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/events/${eventId}`);
      if (response.status === 200) {
        alert('Event deleted successfully');
        navigate('/host/dashboard'); // Redirect after deletion
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  if (loading) {
    return <div>Loading event data...</div>;
  }

  return (
    <div>
      <h1>Edit Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Event Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={eventData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-select"
            value={eventData.category}
            onChange={handleChange}
            required
          >
            <option value="tech">Tech</option>
            <option value="non-tech">Non-Tech</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Event Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={eventData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Registration End Date</label>
          <input
            type="date"
            name="registrationEndDate"
            className="form-control"
            value={eventData.registrationEndDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mode</label>
          <select
            name="mode"
            className="form-select"
            value={eventData.mode}
            onChange={handleChange}
            required
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {eventData.mode === 'online' && (
          <div className="mb-3">
            <label className="form-label">Event Link</label>
            <input
              type="url"
              name="link"
              className="form-control"
              value={eventData.link}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Host (Department/Club)</label>
          <input
            type="text"
            name="host"
            className="form-control"
            value={eventData.host}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Banner (Image URL or File Path)</label>
          <input
            type="text"
            name="banner"
            className="form-control"
            value={eventData.banner}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Additional Details</label>
          <textarea
            name="additionalDetails"
            className="form-control"
            value={eventData.additionalDetails}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex">
          <button type="submit" className="btn btn-primary">
            Update Event
          </button>
          <button
            type="button"
            className="btn btn-danger ms-3 d-flex align-items-center"
            onClick={handleDelete}
          >
            <FaTrash className="me-2" />
            Delete Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
