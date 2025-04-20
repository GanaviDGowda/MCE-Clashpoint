import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

export const generateCertificateURL = async (name, eventTitle, certificatePath) => {
  // Load an existing PDF template (if you have one)
  const existingPdfBytes = fs.readFileSync('path/to/certificate-template.pdf');

  // Create a new PDF document
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Get the first page of the PDF
  const page = pdfDoc.getPages()[0];

  // Get the font for text
  const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);

  // Define font size and position for the text
  const textSize = 24;

  // Draw the name and event title on the certificate
  page.drawText(name, {
    x: 200,
    y: 400,
    size: textSize,
    font: font,
  });

  page.drawText(eventTitle, {
    x: 200,
    y: 350,
    size: textSize,
    font: font,
  });

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  // Write the PDF to a file
  fs.writeFileSync(certificatePath, pdfBytes);

  return certificatePath; // Return the path where the certificate was saved
};
