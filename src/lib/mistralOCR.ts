// Mistral OCR Service Integration
// Uses Mistral API for advanced OCR and document analysis

interface MistralOCRResponse {
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  documentType: string;
  extractedFields: {
    documentNumber?: string;
    name?: string;
    dateOfBirth?: string;
    expiryDate?: string;
    nationality?: string;
  };
  quality: {
    overall: number;
    clarity: number;
    brightness: number;
    contrast: number;
  };
}

class MistralOCRService {
  private apiKey: string;
  private baseURL: string = 'https://api.mistral.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Process document image using Mistral OCR
   */
  async processDocument(imageFile: File): Promise<OCRResult> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Prepare the prompt for OCR and document analysis
      const prompt = `
        Analyze this identity document image and extract all text information.
        Please provide:
        1. All visible text with confidence scores
        2. Document type (passport, ID card, driver's license, etc.)
        3. Key fields: document number, name, date of birth, expiry date, nationality
        4. Image quality assessment (clarity, brightness, contrast)
        5. Bounding boxes for important text regions
        
        Format your response as JSON with the following structure:
        {
          "text": "full extracted text",
          "confidence": 0.95,
          "boundingBoxes": [{"text": "sample", "x": 100, "y": 200, "width": 150, "height": 30, "confidence": 0.98}],
          "documentType": "passport",
          "extractedFields": {"documentNumber": "A1234567", "name": "John Doe", "dateOfBirth": "1990-01-01", "expiryDate": "2025-01-01", "nationality": "US"},
          "quality": {"overall": 0.9, "clarity": 0.85, "brightness": 0.8, "contrast": 0.95}
        }
      `;

      // Call Mistral API
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${imageFile.type};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.1, // Low temperature for consistent OCR results
        }),
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
      }

      const data: MistralOCRResponse = await response.json();
      
      // Parse the JSON response
      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from Mistral API');
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse OCR results from Mistral response');
      }

      const ocrResult: OCRResult = JSON.parse(jsonMatch[0]);
      
      // Validate and enhance the result
      return this.validateAndEnhanceOCRResult(ocrResult);

    } catch (error) {
      console.error('Mistral OCR processing error:', error);
      throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert file to base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data URL prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate and enhance OCR results
   */
  private validateAndEnhanceOCRResult(result: OCRResult): OCRResult {
    // Ensure all required fields exist
    return {
      text: result.text || '',
      confidence: Math.max(0, Math.min(1, result.confidence || 0)),
      boundingBoxes: result.boundingBoxes || [],
      documentType: result.documentType || 'unknown',
      extractedFields: {
        documentNumber: result.extractedFields?.documentNumber || '',
        name: result.extractedFields?.name || '',
        dateOfBirth: result.extractedFields?.dateOfBirth || '',
        expiryDate: result.extractedFields?.expiryDate || '',
        nationality: result.extractedFields?.nationality || ''
      },
      quality: {
        overall: Math.max(0, Math.min(1, result.quality?.overall || 0)),
        clarity: Math.max(0, Math.min(1, result.quality?.clarity || 0)),
        brightness: Math.max(0, Math.min(1, result.quality?.brightness || 0)),
        contrast: Math.max(0, Math.min(1, result.quality?.contrast || 0))
      }
    };
  }

  /**
   * Validate extracted document fields
   */
  validateDocumentFields(extractedFields: OCRResult['extractedFields']): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check document number
    if (!extractedFields.documentNumber) {
      errors.push('Document number not found');
    } else if (extractedFields.documentNumber.length < 5) {
      warnings.push('Document number seems too short');
    }

    // Check name
    if (!extractedFields.name) {
      errors.push('Name not found');
    } else if (extractedFields.name.length < 2) {
      warnings.push('Name seems incomplete');
    }

    // Check dates
    if (extractedFields.dateOfBirth) {
      const dob = new Date(extractedFields.dateOfBirth);
      const now = new Date();
      const age = now.getFullYear() - dob.getFullYear();
      
      if (age < 0 || age > 120) {
        errors.push('Invalid date of birth');
      } else if (age < 18) {
        warnings.push('User appears to be under 18');
      }
    }

    if (extractedFields.expiryDate) {
      const expiry = new Date(extractedFields.expiryDate);
      const now = new Date();
      
      if (expiry < now) {
        errors.push('Document has expired');
      } else if (expiry < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) {
        warnings.push('Document expires soon');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get supported document types
   */
  getSupportedDocumentTypes(): string[] {
    return [
      'passport',
      'national_id_card',
      'driver_license',
      'residence_permit',
      'military_id',
      'unknown'
    ];
  }
}

// Export the service class
export { MistralOCRService };
export type { OCRResult, MistralOCRResponse };

// Singleton instance for the application
let mistralOCRService: MistralOCRService | null = null;

export function getMistralOCRService(): MistralOCRService {
  if (!mistralOCRService) {
    const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || 'G2eCav0PT0xs7XAkh3BPgVmIvXSEum1K';
    mistralOCRService = new MistralOCRService(apiKey);
  }
  return mistralOCRService;
}
