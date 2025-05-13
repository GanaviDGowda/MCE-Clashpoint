import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
  const qrCodeRegionId = 'qr-code-region';
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    // Initialize scanner
    html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);
    
    const startScanner = async () => {
      try {
        setError(null);
        const devices = await Html5Qrcode.getCameras();
        
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          setScanning(true);
          
          await html5QrCodeRef.current.start(
            cameraId,
            { 
              fps: 10, 
              qrbox: { width: 250, height: 250 } 
            },
            (qrCodeMessage) => {
              console.log("QR Code detected:", qrCodeMessage);
              // Stop scanner on successful scan
              html5QrCodeRef.current.stop().then(() => {
                setScanning(false);
                // Call the success handler passed as prop
                if (onScanSuccess) {
                  onScanSuccess(qrCodeMessage);
                }
              });
            },
            (errorMessage) => {
              // This is just the scanning process error, not a critical failure
              console.log("QR scan error:", errorMessage);
            }
          );
        } else {
          setError("No camera devices found.");
        }
      } catch (err) {
        console.error('Camera initialization error:', err);
        setError(`Failed to access camera: ${err.message}`);
        setScanning(false);
      }
    };
    
    startScanner();

    // Cleanup function
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().then(() => {
          console.log('Scanner stopped.');
        }).catch(err => {
          console.error('Failed to stop scanner:', err);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="qr-scanner-container">
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <div 
        id={qrCodeRegionId} 
        ref={scannerRef}
        style={{ 
          width: '100%', 
          maxWidth: '300px',
          height: '300px',
          margin: '0 auto'
        }}
      />
      
      {scanning && (
        <p className="text-center mt-2">
          Position the QR code in front of the camera
        </p>
      )}
    </div>
  );
};

export default QRScanner;