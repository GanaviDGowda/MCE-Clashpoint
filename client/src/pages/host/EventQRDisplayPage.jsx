import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import api from "../../services/api"; // Make sure this path matches your project structure

const EventQRCodeDisplayPage = ({ eventId }) => {
  const [qrToken, setQrToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/attendance/qr/${eventId}`);
        setQrToken(res.data.qrToken);
        setError(null);
        setTimeLeft(30); // Reset countdown
      } catch (err) {
        console.error("Error fetching QR token", err);
        setError("Failed to load QR code");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
    
    // Set up refresh interval
    const interval = setInterval(fetchToken, 30000); // Refresh every 30s
    
    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 30));
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [eventId]);

  return (
    <div className="qr-container text-center">
      <h2>Current Attendance QR</h2>
      
      {loading && <p>Loading QR code...</p>}
      
      {error && <p className="text-danger">{error}</p>}
      
      {qrToken && !loading && (
        <>
          <div className="qr-code-wrapper p-3 bg-white rounded shadow-sm d-inline-block mb-3">
            <QRCode value={qrToken} size={256} />
          </div>
          
          <div className="text-muted small">
            <p>QR code refreshes in {timeLeft} seconds</p>
            <p>Have students scan this code to mark attendance</p>
          </div>
        </>
      )}
    </div>
  );
};

export default EventQRCodeDisplayPage;