import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaImage, FaVideo, FaTrash } from 'react-icons/fa'; // Import additional icons

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

  // Media file states
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photosPreviews, setPhotosPreviews] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle banner file selection
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setBannerPreview(previewURL);
    }
  };

  // Handle multiple photos selection
  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Add new files to existing files
      setPhotoFiles(prevFiles => [...prevFiles, ...files]);
      
      // Generate preview URLs for the new photos
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPhotosPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  // Handle multiple videos selection
  const handleVideosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Add new files to existing files
      setVideoFiles(prevFiles => [...prevFiles, ...files]);
      
      // Generate preview URLs for the new videos
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setVideoPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  // Remove a photo
  const removePhoto = (index) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(photosPreviews[index]);
    
    // Remove the file and preview from their respective arrays
    setPhotoFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPhotosPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  // Remove a video
  const removeVideo = (index) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(videoPreviews[index]);
    
    // Remove the file and preview from their respective arrays
    setVideoFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setVideoPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.registrationEndDate || !formData.mode || !formData.host) {
      alert('Please fill all required fields.');
      return;
    }

    const eventData = new FormData();
    
    // Append form data
    for (const key in formData) {
      eventData.append(key, formData[key]);
    }

    // Append banner if exists
    if (bannerFile) {
      eventData.append('banner', bannerFile);
    }

    // Append all photo files
    photoFiles.forEach(photo => {
      eventData.append('photos', photo);
    });

    // Append all video files
    videoFiles.forEach(video => {
      eventData.append('videos', video);
    });

    try {
      await api.post('/events', eventData);
      alert('Event created successfully!');
      navigate('/host/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event: ' + (error.response?.data?.error || error.message));
    }
  };

  // Clean up the object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      photosPreviews.forEach(url => URL.revokeObjectURL(url));
      videoPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [bannerPreview, photosPreviews, videoPreviews]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Event</h2>
      <form onSubmit={handleSubmit} className="row g-3" encType="multipart/form-data">
        {/* Basic Event Information */}
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

        {/* Banner Image Upload */}
        <div className="col-12 mt-4">
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
                onChange={handleBannerChange} 
                accept="image/jpeg,image/png,image/jpg" 
                required 
              />
              <label className="input-group-text" htmlFor="banner">
                <FaUpload className="me-2" /> Upload Banner
              </label>
            </div>
            <small className="form-text text-muted">
              Supported formats: JPG, PNG, JPEG
            </small>
          </div>
        </div>

        {/* Photos Upload Section */}
        <div className="col-12 mt-4">
          <label className="form-label d-flex align-items-center">
            <FaImage className="me-2" /> Event Photos
          </label>
          <div className="input-group mb-3">
            <input 
              type="file" 
              name="photos" 
              id="photos"
              multiple
              className="form-control" 
              onChange={handlePhotosChange} 
              accept="image/jpeg,image/png,image/jpg" 
            />
            <label className="input-group-text" htmlFor="photos">
              <FaUpload className="me-2" /> Upload Photos
            </label>
          </div>
          <small className="form-text text-muted mb-3 d-block">
            You can upload up to 10 photos. Supported formats: JPG, PNG, JPEG
          </small>

          {/* Photos Previews */}
          {photosPreviews.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-2 mb-3">
              {photosPreviews.map((preview, index) => (
                <div key={index} className="position-relative" style={{ width: '100px' }}>
                  <img 
                    src={preview} 
                    alt={`Photo preview ${index + 1}`} 
                    className="img-thumbnail" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    onClick={() => removePhoto(index)}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos Upload Section */}
        <div className="col-12 mt-4">
          <label className="form-label d-flex align-items-center">
            <FaVideo className="me-2" /> Event Videos
          </label>
          <div className="input-group mb-3">
            <input 
              type="file" 
              name="videos" 
              id="videos"
              multiple
              className="form-control" 
              onChange={handleVideosChange} 
              accept="video/mp4,video/mov,video/avi,video/webm" 
            />
            <label className="input-group-text" htmlFor="videos">
              <FaUpload className="me-2" /> Upload Videos
            </label>
          </div>
          <small className="form-text text-muted mb-3 d-block">
            You can upload up to 5 videos. Maximum size: 100MB each. Supported formats: MP4, MOV, AVI, WEBM
          </small>

          {/* Videos Previews */}
          {videoFiles.length > 0 && (
            <div className="d-flex flex-wrap gap-3 mt-2">
              {videoFiles.map((video, index) => (
                <div key={index} className="position-relative">
                  <div className="card p-2" style={{ width: '200px' }}>
                    <div className="text-center">
                      <FaVideo size={30} className="text-primary mb-2" />
                      <p className="mb-0 text-truncate">{video.name}</p>
                      <small className="text-muted">{(video.size / (1024 * 1024)).toFixed(2)} MB</small>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger mt-2"
                      onClick={() => removeVideo(index)}
                    >
                      <FaTrash className="me-1" size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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