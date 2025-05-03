import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash, FaUpload, FaImage, FaVideo, FaTimes } from 'react-icons/fa';

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
    photos: [],
    videos: []
  });

  // Separate state for handling files
  const [bannerFile, setBannerFile] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  
  // Previews
  const [bannerPreview, setBannerPreview] = useState('');
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState([]);
  
  // Additional state
  const [loading, setLoading] = useState(true);
  const [appendPhotos, setAppendPhotos] = useState(true);
  const [appendVideos, setAppendVideos] = useState(true);

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
          registrationEndDate: response.data.registrationEndDate ? new Date(response.data.registrationEndDate).toISOString().split('T')[0] : '',
          photos: response.data.photos || [],
          videos: response.data.videos || []
        };
        
        setEventData(formattedData);
        
        // Set banner preview if exists
        if (response.data.banner) {
          setBannerPreview(response.data.banner);
        }
        
        // Set existing photos and videos for preview
        if (response.data.photos && response.data.photos.length > 0) {
          setPhotoPreviewUrls(response.data.photos);
        }
        
        if (response.data.videos && response.data.videos.length > 0) {
          setVideoPreviewUrls(response.data.videos);
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

  // Handle banner file selection
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setBannerPreview(previewURL);
    }
  };

  // Handle photo files selection
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setPhotoFiles([...photoFiles, ...files]);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPhotoPreviewUrls(prev => appendPhotos ? [...prev, ...newPreviewUrls] : newPreviewUrls);
    }
  };

  // Handle video files selection
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setVideoFiles([...videoFiles, ...files]);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setVideoPreviewUrls(prev => appendVideos ? [...prev, ...newPreviewUrls] : newPreviewUrls);
    }
  };

  // Remove a photo from preview
  const removePhoto = (index) => {
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // If the removed photo is a new file, remove it from photoFiles too
    if (index >= (eventData.photos?.length || 0)) {
      const adjustedIndex = index - (eventData.photos?.length || 0);
      setPhotoFiles(prev => prev.filter((_, i) => i !== adjustedIndex));
    } else {
      // It's an existing photo, update eventData to exclude it
      setEventData(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
    }
  };

  // Remove a video from preview
  const removeVideo = (index) => {
    setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // If the removed video is a new file, remove it from videoFiles too
    if (index >= (eventData.videos?.length || 0)) {
      const adjustedIndex = index - (eventData.videos?.length || 0);
      setVideoFiles(prev => prev.filter((_, i) => i !== adjustedIndex));
    } else {
      // It's an existing video, update eventData to exclude it
      setEventData(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting form with event data:", eventData);
      
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      
      // Add all event data to the form
      Object.keys(eventData).forEach(key => {
        if (key !== 'banner' && key !== 'photos' && key !== 'videos' && 
            key !== '_id' && key !== '__v' && key !== 'createdBy') {
          console.log(`Adding form field: ${key} = ${eventData[key]}`);
          formData.append(key, eventData[key] || '');
        }
      });
      
      // Add the append flags
      formData.append('appendPhotos', appendPhotos.toString());
      formData.append('appendVideos', appendVideos.toString());
      
      // Add the banner file if it exists
      if (bannerFile) {
        console.log("Adding banner file to form data:", bannerFile.name);
        formData.append('banner', bannerFile);
      }
      
      // Add photo files
      if (photoFiles.length > 0) {
        console.log(`Adding ${photoFiles.length} photo files`);
        photoFiles.forEach(photo => {
          formData.append('photos', photo);
        });
      }
      
      // Add video files
      if (videoFiles.length > 0) {
        console.log(`Adding ${videoFiles.length} video files`);
        videoFiles.forEach(video => {
          formData.append('videos', video);
        });
      }

      // Log FormData contents (for debugging)
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      // Make the API request with FormData
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
    return <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Edit Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
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
                rows="4"
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
          </div>
          
          <div className="col-md-6">
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
              <label className="form-label">Additional Details</label>
              <textarea
                name="additionalDetails"
                className="form-control"
                value={eventData.additionalDetails}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Banner Image Section */}
        <div className="mb-4 p-3 border rounded">
          <h4 className="mb-3">
            <FaImage className="me-2" />
            Banner Image
          </h4>
          <div className="d-flex flex-column">
            {bannerPreview && (
              <div className="mb-3">
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
                id="banner"
                className="form-control"
                onChange={handleBannerChange}
                accept="image/jpeg,image/png,image/jpg"
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

        {/* Photos Section */}
        <div className="mb-4 p-3 border rounded">
          <h4 className="mb-3">
            <FaImage className="me-2" />
            Event Photos
          </h4>
          
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="appendPhotos"
              checked={appendPhotos}
              onChange={() => setAppendPhotos(!appendPhotos)}
            />
            <label className="form-check-label" htmlFor="appendPhotos">
              Append to existing photos (uncheck to replace all photos)
            </label>
          </div>
          
          <div className="input-group mb-3">
            <input
              type="file"
              id="photos"
              className="form-control"
              onChange={handlePhotoChange}
              accept="image/jpeg,image/png,image/jpg"
              multiple
            />
            <label className="input-group-text" htmlFor="photos">
              <FaUpload className="me-2" /> Upload Photos
            </label>
          </div>
          <small className="form-text text-muted mb-3 d-block">
            You can select multiple photos at once. Supported formats: JPG, PNG, JPEG
          </small>
          
          {photoPreviewUrls.length > 0 && (
            <div>
              <h5>Current Photos ({photoPreviewUrls.length})</h5>
              <div className="row">
                {photoPreviewUrls.map((url, index) => (
                  <div key={`photo-${index}`} className="col-md-3 mb-3">
                    <div className="position-relative">
                      <img
                        src={url}
                        alt={`Event photo ${index + 1}`}
                        className="img-thumbnail"
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => removePhoto(index)}
                        style={{ margin: '5px' }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Videos Section */}
        <div className="mb-4 p-3 border rounded">
          <h4 className="mb-3">
            <FaVideo className="me-2" />
            Event Videos
          </h4>
          
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="appendVideos"
              checked={appendVideos}
              onChange={() => setAppendVideos(!appendVideos)}
            />
            <label className="form-check-label" htmlFor="appendVideos">
              Append to existing videos (uncheck to replace all videos)
            </label>
          </div>
          
          <div className="input-group mb-3">
            <input
              type="file"
              id="videos"
              className="form-control"
              onChange={handleVideoChange}
              accept="video/mp4,video/quicktime,video/webm"
              multiple
            />
            <label className="input-group-text" htmlFor="videos">
              <FaUpload className="me-2" /> Upload Videos
            </label>
          </div>
          <small className="form-text text-muted mb-3 d-block">
            You can select multiple videos at once. Supported formats: MP4, MOV, WebM
          </small>
          
          {videoPreviewUrls.length > 0 && (
            <div>
              <h5>Current Videos ({videoPreviewUrls.length})</h5>
              <div className="row">
                {videoPreviewUrls.map((url, index) => (
                  <div key={`video-${index}`} className="col-md-4 mb-3">
                    <div className="position-relative">
                      <video
                        src={url}
                        controls
                        className="img-thumbnail"
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => removeVideo(index)}
                        style={{ margin: '5px' }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="d-flex mb-5">
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