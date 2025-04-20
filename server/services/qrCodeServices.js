// server/services/qrCodeServices.js
import QRCode from "qrcode";

export const generateQRCode = async (text) => {
  try {
    const qrDataURL = await QRCode.toDataURL(text);
    return qrDataURL;
  } catch (err) {
    throw new Error("Failed to generate QR Code");
  }
};
