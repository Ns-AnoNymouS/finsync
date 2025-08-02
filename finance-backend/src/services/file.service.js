const fs = require('fs');
const pdfParse = require('pdf-parse');
const { fromPath } = require('pdf2pic');
const ocrService = require('./ocrService');

exports.extractTextFromFile = async (file) => {
  if (file.mimetype === 'application/pdf') {
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    let text = pdfData.text.trim();

    if (!text || text.length < 50) {
      // fallback to OCR
      const convert = fromPath(file.path, {
        density: 200,
        format: 'png',
        width: 1200,
        height: 1500,
      });

      const image = await convert(1);
      text = await ocrService.ocrImage(image.path);
      fs.unlinkSync(image.path);
    }

    fs.unlinkSync(file.path);
    return text;
  }

  if (file.mimetype.startsWith('image/')) {
    const text = await ocrService.ocrImage(file.path);
    fs.unlinkSync(file.path);
    return text;
  }

  throw new Error('Unsupported file type');
};
