import React, { useState } from 'react';
import api from '../../services/api';
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
    category: '',
    additionalDetails: '',
  });

  const [bannerFile, setBannerFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setBannerFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.registrationEndDate || !formData.mode || !formData.host) {
      alert('Please fill all required fields.');
      return;
    }

    const eventData = new FormData();
    for (const key in formData) {
      eventData.append(key, formData[key]);
    }

    if (bannerFile) {
      eventData.append('banner', bannerFile);
    }

    try {
      await api.post('/events', eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Event created successfully!');
      navigate('/host/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Event</h2>
      <form onSubmit={handleSubmit} className="row g-3" encType="multipart/form-data">
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
          <label className="form-label">Event Category</label>
          <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Banner Image</label>
          <input type="file" name="banner" className="form-control" onChange={handleFileChange} accept="image/*" required />
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
