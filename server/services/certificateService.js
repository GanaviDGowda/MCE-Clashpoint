// server/services/certificateServices.js
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export const generateCertificate = async (studentName, eventName) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.drawText("Certificate of Participation", {
    x: 150,
    y: 350,
    size: 20,
    font,
    color: rgb(0, 0.53, 0.71),
  });

  page.drawText(`This is awarded to: ${studentName}`, {
    x: 100,
    y: 300,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`For participating in the event: ${eventName}`, {
    x: 100,
    y: 270,
    size: 14,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  const pdfBytes = await pdfDoc.save();

  // Save the PDF
  const fileName = `${studentName}-${eventName}.pdf`.replace(/\s+/g, "_");
  const filePath = path.resolve(`certificates/${fileName}`);
  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
};
