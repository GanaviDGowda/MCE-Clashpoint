import React, { useState, useEffect } from 'react';
import api from "../../services/api"; // Adjust the import based on your project structure

const CertificateGenerator = ({ eventId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Fetch participants when the component mounts
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await api.get(`/events/${eventId}/participants`);
        setParticipants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching participants:', error);
        alert('Failed to fetch participants');
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [eventId]);

  // Handle participant selection
  const handleSelectParticipant = (userId) => {
    setSelectedParticipants((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  // Generate certificate for selected participants
  const handleGenerateCertificates = async () => {
    try {
      const response = await api.post(`/events/${eventId}/generate-certificates`, {
        userIds: selectedParticipants
      });

      if (response.data.success) {
        alert('Certificates generated successfully');
        // Optionally trigger a download link if your server returns the certificates as files
      } else {
        alert('Failed to generate certificates');
      }
    } catch (error) {
      console.error('Error generating certificates:', error);
      alert('Failed to generate certificates');
    }
  };

  if (loading) {
    return <div>Loading participants...</div>;
  }

  return (
    <div>
      <h1>Generate Certificates</h1>
      <div>
        <h3>Participants</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Select for Certificate</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant._id}>
                <td>{participant.name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(participant._id)}
                    onChange={() => handleSelectParticipant(participant._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleGenerateCertificates} className="btn btn-primary">
        Generate Certificates
      </button>
    </div>
  );
};

export default CertificateGenerator;
