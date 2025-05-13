import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';

const HostQRCodeDisplay = ({ eventId }) => {
  const [qrToken, setQrToken] = useState('');

  const refreshQRCode = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await fetch(`/api/internal/qr-token?eventId=${eventId}&timestamp=${timestamp}`);
    const { token } = await res.json();
    setQrToken(token);
  };

  useEffect(() => {
    refreshQRCode();
    const interval = setInterval(refreshQRCode, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <QRCode value={qrToken} size={256} />
    </div>
  );
};

export default HostQRCodeDisplay;
