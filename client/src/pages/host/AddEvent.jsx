import React, { useState } from 'react';
import api from "../../services/api";
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    registrationEndDate: '',
    mode: 'online',
    link: '',
    description: '',
    host: '',
    banner: '',
    category: '',
    additionalDetails: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple form validation
    if (!formData.title || !formData.date || !formData.registrationEndDate || !formData.mode || !formData.host) {
      alert('All required fields must be filled!');
      return;
    }

    // Send POST request to backend
    api.post('/events', formData)
      .then(response => {
        alert('Event added successfully');
        navigate('/host/dashboard'); // Redirect to dashboard after success
      })
      .catch(error => {
        console.error('Error adding event:', error);
        alert('Failed to add event');
      });
  };

  return (
    <div>
      <h1>Add Event</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Event Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Event Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Registration End Date:
            <input
              type="date"
              name="registrationEndDate"
              value={formData.registrationEndDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Mode:
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
        </div>
        {formData.mode === 'online' && (
          <div>
            <label>
              Event Link:
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
              />
            </label>
          </div>
        )}
        <div>
          <label>
            Event Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Host (Department/Club):
            <input
              type="text"
              name="host"
              value={formData.host}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Banner (URL or file path):
            <input
              type="text"
              name="banner"
              value={formData.banner}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Additional Details:
            <textarea
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEvent;
