export const API_CONFIG = {
    OCR_SPACE: {
      URL: 'https://api.ocr.space/parse/image',
      API_KEY: 'K81622226288957', // replace with your own
    },
    GEMINI: {
      URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      API_KEY: 'AIzaSyAJFa-p4KMvn5HxbCyDyQfjCCvYfiWkogs', // replace with your own
    },
    HUGGING_FACE: {
      URL: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      API_KEY: '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', // replace with your own
    }
  };
  
  export const validateApiKeys = () => {
    const keys = [
      API_CONFIG.OCR_SPACE.API_KEY,
      API_CONFIG.GEMINI.API_KEY,
      API_CONFIG.HUGGING_FACE.API_KEY,
    ];
    return keys.every(key => key && key !== 'K81622226288957');
  };