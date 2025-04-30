import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash, FaUpload } from 'react-icons/fa'; // Import upload icon as well

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    registrationEndDate: '',
    mode: 'online',
    link: '',
    host: '',
    additionalDetails: '',
  });

  // Separate state for handling the banner file
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the existing event details when the component mounts
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log('Fetching event with ID:', id);
        const response = await api.get(`/events/${id}`);
        console.log('Event data received:', response.data);
        
        // Format the dates properly for the input fields
        const formattedData = {
          ...response.data,
          date: response.data.date ? new Date(response.data.date).toISOString().split('T')[0] : '',
          registrationEndDate: response.data.registrationEndDate ? new Date(response.data.registrationEndDate).toISOString().split('T')[0] : ''
        };
        
        setEventData(formattedData);
        
        // Set banner preview if exists
        if (response.data.banner) {
          setBannerPreview(response.data.banner);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        alert('Failed to fetch event details');
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setBannerPreview(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting form with event data:", eventData);
      
      // Create a FormData object to handle file upload
      const formData = new FormData();
      
      // Add all event data to the form
      Object.keys(eventData).forEach(key => {
        if (key !== 'banner' && key !== '_id' && key !== '__v' && key !== 'createdBy') {
          console.log(`Adding form field: ${key} = ${eventData[key]}`);
          formData.append(key, eventData[key] || '');
        }
      });
      
      // Add the banner file if it exists
      if (bannerFile) {
        console.log("Adding banner file to form data:", bannerFile.name);
        formData.append('banner', bannerFile);
      }

      // Log FormData contents (for debugging)
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      // Make the API request with FormData - don't set Content-Type manually
      // The browser will set it automatically with the correct boundary
      const response = await api.put(`/events/${id}`, formData);
      
      console.log("Update response:", response);
      
      if (response.status === 200) {
        alert('Event updated successfully');
        navigate('/host/dashboard'); 
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/events/${id}`);
      if (response.status === 200) {
        alert('Event deleted successfully');
        navigate('/host/dashboard');
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
            name="title"
            className="form-control"
            value={eventData.title}
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
          <label className="form-label">Banner Image</label>
          <div className="d-flex flex-column">
            {bannerPreview && (
              <div className="mb-2">
                <img 
                  src={bannerPreview} 
                  alt="Event banner preview" 
                  style={{ maxWidth: '300px', maxHeight: '200px' }} 
                  className="img-thumbnail" 
                />
              </div>
            )}
            <div className="input-group">
              <input
                type="file"
                name="banner"
                className="form-control"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg"
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