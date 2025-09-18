// src/services/ocrService.js
import * as FileSystem from 'expo-file-system';
import { API_CONFIG } from './apiConfig';

export class OCRService {
  static async extractTextFromImage(imageUri) {
    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare form data
      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('iscreatesearchablepdf', 'false');
      formData.append('issearchablepdfhidetextlayer', 'false');

      const response = await fetch(API_CONFIG.OCR_SPACE.URL, {
        method: 'POST',
        headers: {
          'apikey': API_CONFIG.OCR_SPACE.API_KEY,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (result.IsErroredOnProcessing) {
        throw new Error(result.ErrorMessage[0] || 'OCR processing failed');
      }

      return result.ParsedResults[0]?.ParsedText || '';
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  }

  static async extractTextFromPDF(pdfUri) {
    // For PDF processing, you might want to use a different service
    // or convert PDF to images first
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: pdfUri,
        type: 'application/pdf',
        name: 'cv.pdf',
      });
      formData.append('language', 'eng');

      const response = await fetch(API_CONFIG.OCR_SPACE.URL, {
        method: 'POST',
        headers: {
          'apikey': API_CONFIG.OCR_SPACE.API_KEY,
        },
        body: formData,
      });

      const result = await response.json();
      return result.ParsedResults[0]?.ParsedText || '';
    } catch (error) {
      throw new Error(`PDF text extraction failed: ${error.message}`);
    }
  }
}