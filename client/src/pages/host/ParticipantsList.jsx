import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { useParams } from 'react-router-dom';

const ParticipantsList = () => {
  const { eventId } = useParams(); // Extract event ID from URL params
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch participants for the event
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await api.get(`/events/${eventId}/participants`);
        setParticipants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching participants:', error);
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId]);

  // Mark participant as attended
  const handleMarkAttended = async (participantId) => {
    try {
      await api.post(`/events/${eventId}/participants/${participantId}/attend`);
      setParticipants(participants.map((participant) => 
        participant._id === participantId 
        ? { ...participant, attended: true } 
        : participant
      ));
      alert('Marked as attended');
    } catch (error) {
      console.error('Error marking participant as attended:', error);
      alert('Failed to mark as attended');
    }
  };

  if (loading) {
    return <div>Loading participants...</div>;
  }

  return (
    <div>
      <h1>Participants for Event</h1>
      {participants.length === 0 ? (
        <p>No participants found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant._id}>
                <td>{participant.name}</td>
                <td>{participant.email}</td>
                <td>{participant.attended ? 'Attended' : 'Not Attended'}</td>
                <td>
                  {!participant.attended && (
                    <button
                      onClick={() => handleMarkAttended(participant._id)}
                      className="btn btn-success"
                    >
                      Mark as Attended
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParticipantsList;
