import QRCode from 'qrcode';
import fs from 'fs';

export const generateQRCode = async (data, filePath) => {
  try {
    // Generate a QR code for the data
    const qrCodeDataUrl = await QRCode.toDataURL(data);

    // Optional: You can save it as an image file
    const base64Data = qrCodeDataUrl.split(',')[1]; // Get the base64 part of the Data URL
    const buffer = Buffer.from(base64Data, 'base64');

    // Save the QR code as an image file
    fs.writeFileSync(filePath, buffer);

    return filePath; // Return the path where the QR code was saved
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('QR code generation failed');
  }
};
