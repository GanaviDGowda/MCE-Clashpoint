import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa'; // Import upload icon

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
  const [bannerPreview, setBannerPreview] = useState(''); // State for preview image

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      
      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setBannerPreview(previewURL);
    }
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
      await api.post('/events', eventData);
      alert('Event created successfully!');
      navigate('/host/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event: ' + (error.response?.data?.error || error.message));
    }
  };

  // Clean up the object URL when component unmounts or when a new file is selected
  React.useEffect(() => {
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

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

        <div className="col-12">
          <label className="form-label">Banner Image</label>
          <div className="d-flex flex-column">
            {bannerPreview && (
              <div className="mb-3">
                <img 
                  src={bannerPreview} 
                  alt="Banner preview" 
                  className="img-thumbnail" 
                  style={{ maxWidth: '300px', maxHeight: '200px' }}
                />
              </div>
            )}
            <div className="input-group">
              <input 
                type="file" 
                name="banner" 
                id="banner"
                className="form-control" 
                onChange={handleFileChange} 
                accept="image/jpeg,image/png,image/jpg" 
                required 
              />
              <label className="input-group-text" htmlFor="banner">
                <FaUpload className="me-2" /> Upload
              </label>
            </div>
            <small className="form-text text-muted">
              Supported formats: JPG, PNG, JPEG
            </small>
          </div>
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