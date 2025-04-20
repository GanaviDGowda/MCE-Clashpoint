import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode"; // Corrected import

const QRScanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250
    });

    scanner.render(onScanSuccess, onScanError);

    // Cleanup on unmount
    return () => {
      scanner.clear();
    };
  }, []);

  const onScanSuccess = (decodedText, decodedResult) => {
    console.log(`QR Code detected: ${decodedText}`, decodedResult);
  };

  const onScanError = (error) => {
    console.error(`QR Code scan error: ${error}`);
  };

  return (
    <div>
      <div id="reader" style={{ width: "500px", height: "500px" }}></div>
    </div>
  );
};

export default QRScanner;
// This code sets up a QR code scanner using the Html5QrcodeScanner library. It initializes the scanner on component mount and cleans up when the component unmounts. The scanner will log the decoded text and any errors to the console.