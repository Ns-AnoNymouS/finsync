const Tesseract = require('tesseract.js');

exports.ocrImage = async (imagePath) => {
  const result = await Tesseract.recognize(imagePath, 'eng');
  return result.data.text;
};
