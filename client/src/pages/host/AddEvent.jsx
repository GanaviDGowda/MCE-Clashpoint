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
    if (!formData.title || !formData.date || !formData.registrationEndDate || !formData.mode || !formData.host) {
      alert('All required fields must be filled!');
      return;
    }

    api.post('/events', formData)
      .then(() => {
        alert('Event added successfully');
        navigate('/host/dashboard');
      })
      .catch(error => {
        console.error('Error adding event:', error);
        alert('Failed to add event');
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Event</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Event Title</label>
          <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Event Date</label>
          <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Registration End Date</label>
          <input type="date" name="registrationEndDate" className="form-control" value={formData.registrationEndDate} onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Mode</label>
          <select name="mode" className="form-select" value={formData.mode} onChange={handleChange} required>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {formData.mode === 'online' && (
          <div className="col-12">
            <label className="form-label">Event Link</label>
            <input type="url" name="link" className="form-control" value={formData.link} onChange={handleChange} />
          </div>
        )}

        <div className="col-12">
          <label className="form-label">Event Description</label>
          <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Host (Department/Club)</label>
          <input type="text" name="host" className="form-control" value={formData.host} onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Banner (URL or path)</label>
          <input type="text" name="banner" className="form-control" value={formData.banner} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Category</label>
          <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} />
        </div>

        <div className="col-12">
          <label className="form-label">Additional Details</label>
          <textarea name="additionalDetails" className="form-control" rows="3" value={formData.additionalDetails} onChange={handleChange} />
        </div>

        <div className="col-12 text-center mt-4">
          <button type="submit" className="btn btn-primary px-4">Add Event</button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
