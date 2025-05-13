import React, { useState } from 'react';
import QRScanner from '../../components/QRScanner';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const EventAttendancePage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [scanning, setScanning] = useState(true);
  const [status, setStatus] = useState({ type: null, message: null });

  const handleScan = async (qrToken) => {
    try {
      setScanning(false);
      setStatus({ type: 'info', message: 'Processing...' });
      
      const res = await api.post('/api/attendance/mark', { qrToken, eventId });
      
      setStatus({ 
        type: 'success', 
        message: '✅ Attendance marked successfully!' 
      });
      
      // Navigate after a brief delay to show success message
      setTimeout(() => {
        navigate('/attendance-confirmation');
      }, 1500);
      
    } catch (err) {
      console.error('Attendance marking error:', err);
      
      const errorMessage = err.response?.data?.error || 
                           err.response?.data?.message || 
                           'Server error';
                           
      setStatus({ 
        type: 'danger', 
        message: `❌ Failed to mark attendance: ${errorMessage}` 
      });
      
      // Allow retry after error
      setTimeout(() => {
        setScanning(true);
        setStatus({ type: null, message: null });
      }, 3000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body text-center p-4">
              <h2 className="mb-4">📷 Scan QR Code to Mark Attendance</h2>
              
              {status.message && (
                <div className={`alert alert-${status.type} mb-4`}>
                  {status.message}
                </div>
              )}
              
              {scanning && <QRScanner onScanSuccess={handleScan} />}
              
              {!scanning && status.type !== 'success' && (
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    setScanning(true);
                    setStatus({ type: null, message: null });
                  }}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAttendancePage;