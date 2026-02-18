// Mistral API Configuration
export const MISTRAL_CONFIG = {
  API_KEY: "G2eCav0PT0xs7XAkh3BPgVmIvXSEum1K",
  BASE_URL: "https://api.mistral.ai/v1",
  MODEL: "mistral-large-latest",
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.1
};

// OCR Processing Configuration
export const OCR_CONFIG = {
  SUPPORTED_FORMATS: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  MAX_FILE_SIZE_MB: 10,
  QUALITY_THRESHOLDS: {
    excellent: 90,
    good: 75,
    acceptable: 60,
    poor: 40
  }
};
