import React, { useState, useEffect } from 'react';
import api from "../../services/api"; // Adjust the import based on your project structure

const AttendanceManager = ({ eventId }) => {
  const [participants, setParticipants] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch participants when the component mounts
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await api.get(`/events/${eventId}/participants`);
        setParticipants(response.data); // Set participants
        setAttendance(response.data.map(p => ({ userId: p._id, status: false }))); // Initialize attendance state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching participants:', error);
        alert('Failed to fetch participants');
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [eventId]);

  // Handle attendance mark/unmark
  const handleAttendanceToggle = (userId) => {
    setAttendance((prevAttendance) =>
      prevAttendance.map((att) =>
        att.userId === userId ? { ...att, status: !att.status } : att
      )
    );
  };

  // Handle submit to mark attendance
  const handleSubmit = async () => {
    try {
      const attendanceData = attendance.filter((att) => att.status); // Get only those marked as present
      await api.post(`/events/${eventId}/attendance`, { attendanceData });
      alert('Attendance marked successfully');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  if (loading) {
    return <div>Loading participants...</div>;
  }

  return (
    <div>
      <h1>Manage Attendance for Event</h1>
      <div>
        <h3>Participants</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant._id}>
                <td>{participant.name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={attendance.find((att) => att.userId === participant._id)?.status || false}
                    onChange={() => handleAttendanceToggle(participant._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleSubmit} className="btn btn-primary">
        Submit Attendance
      </button>
    </div>
  );
};

export default AttendanceManager;
