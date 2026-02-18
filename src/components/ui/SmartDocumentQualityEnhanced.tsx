"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle2, AlertCircle, FileText, Sparkles, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMistralOCRService, OCRResult } from "@/lib/mistralOCR";

interface QualityMetrics {
  overall: number;
  clarity: number;
  brightness: number;
  contrast: number;
  blur: number;
  noise: number;
}

interface DocumentAnalysis extends QualityMetrics {
  extractedText?: string;
  documentType?: string;
  extractedFields?: {
    documentNumber?: string;
    name?: string;
    dateOfBirth?: string;
    expiryDate?: string;
    nationality?: string;
  };
  ocrConfidence?: number;
  validationErrors?: string[];
  validationWarnings?: string[];
}

interface SmartDocumentQualityProps {
  onUpload: (file: File, analysis: DocumentAnalysis) => void;
  onQualityCheck: (result: QualityMetrics) => void;
  className?: string;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  showOCRResults?: boolean;
}

const QUALITY_THRESHOLDS = {
  excellent: 90,
  good: 75,
  acceptable: 60,
  poor: 40
};

export function SmartDocumentQuality({
  onUpload,
  onQualityCheck,
  className,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  maxSizeMB = 10,
  showOCRResults = true
}: SmartDocumentQualityProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Analyze image quality using canvas
  const analyzeImageQuality = useCallback((file: File): Promise<QualityMetrics> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Calculate quality metrics
        const metrics = calculateQualityMetrics(data, canvas.width, canvas.height);
        resolve(metrics);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Calculate quality metrics from image data
  const calculateQualityMetrics = (data: Uint8ClampedArray, width: number, height: number): QualityMetrics => {
    let totalBrightness = 0;
    let totalContrast = 0;
    let blurScore = 0;
    let noiseScore = 0;

    // Sample pixels for analysis
    const sampleSize = Math.min(1000, data.length / 4);
    const step = Math.floor(data.length / (4 * sampleSize));

    for (let i = 0; i < data.length; i += step * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Brightness (luminance)
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      totalBrightness += brightness;

      // Simple contrast detection
      if (i > 0) {
        const prevBrightness = (0.299 * data[i - 4] + 0.587 * data[i - 3] + 0.114 * data[i - 2]) / 255;
        totalContrast += Math.abs(brightness - prevBrightness);
      }
    }

    const avgBrightness = totalBrightness / sampleSize;
    const avgContrast = totalContrast / sampleSize;

    // Calculate individual scores (0-100)
    const brightnessScore = avgBrightness > 0.2 && avgBrightness < 0.8 ? 100 : 
                           avgBrightness <= 0.2 ? avgBrightness * 500 : 
                           (1 - avgBrightness) * 500;

    const contrastScore = Math.min(100, avgContrast * 1000);
    const clarityScore = (brightnessScore + contrastScore) / 2;
    
    // Simplified blur and noise detection
    blurScore = Math.max(0, 100 - avgContrast * 500);
    noiseScore = Math.max(0, 100 - clarityScore);

    const overallScore = (clarityScore * 0.4 + brightnessScore * 0.3 + contrastScore * 0.3);

    return {
      overall: Math.round(overallScore),
      clarity: Math.round(clarityScore),
      brightness: Math.round(brightnessScore),
      contrast: Math.round(contrastScore),
      blur: Math.round(blurScore),
      noise: Math.round(noiseScore)
    };
  };

  // Process document with Mistral OCR
  const processDocumentWithOCR = useCallback(async (file: File): Promise<OCRResult> => {
    try {
      const ocrService = getMistralOCRService();
      const result = await ocrService.processDocument(file);
      return result;
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw error;
    }
  }, []);

  // Handle file upload and analysis
  const handleFileUpload = useCallback(async (file: File) => {
    setError(null);
    setIsAnalyzing(true);

    try {
      // Validate file
      if (!acceptedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not supported`);
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
      }

      // Analyze image quality
      const quality = await analyzeImageQuality(file);
      setQualityMetrics(quality);
      onQualityCheck(quality);

      // Process with OCR if enabled
      let ocrData: OCRResult | null = null;
      if (showOCRResults) {
        try {
          ocrData = await processDocumentWithOCR(file);
          setOcrResult(ocrData);
        } catch (ocrError) {
          console.warn('OCR processing failed, continuing with quality analysis only:', ocrError);
          // Don't fail the entire process if OCR fails
        }
      }

      // Create combined analysis
      const analysis: DocumentAnalysis = {
        ...quality,
        extractedText: ocrData?.text,
        documentType: ocrData?.documentType,
        extractedFields: ocrData?.extractedFields,
        ocrConfidence: ocrData?.confidence,
        validationErrors: ocrData ? getMistralOCRService().validateDocumentFields(ocrData.extractedFields || {}).errors : [],
        validationWarnings: ocrData ? getMistralOCRService().validateDocumentFields(ocrData.extractedFields || {}).warnings : []
      };

      // Check if quality is acceptable
      if (quality.overall < QUALITY_THRESHOLDS.acceptable) {
        throw new Error(`Image quality too low (${quality.overall}%). Please ensure good lighting and focus.`);
      }

      onUpload(file, analysis);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [acceptedTypes, maxSizeMB, analyzeImageQuality, onQualityCheck, onUpload, showOCRResults, processDocumentWithOCR]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const getQualityColor = (score: number) => {
    if (score >= QUALITY_THRESHOLDS.excellent) return "text-green-400";
    if (score >= QUALITY_THRESHOLDS.good) return "text-blue-400";
    if (score >= QUALITY_THRESHOLDS.acceptable) return "text-yellow-400";
    return "text-red-400";
  };

  const getQualityLabel = (score: number) => {
    if (score >= QUALITY_THRESHOLDS.excellent) return "Excellent";
    if (score >= QUALITY_THRESHOLDS.good) return "Good";
    if (score >= QUALITY_THRESHOLDS.acceptable) return "Acceptable";
    return "Poor";
  };

  return (
    <div className={cn("relative", className)}>
      {/* Hidden canvas for image analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
          dragActive ? "border-primary bg-primary/10" : "border-white/20 bg-white/5",
          isAnalyzing && "pointer-events-none opacity-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Upload Icon */}
          <motion.div
            className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
            animate={isAnalyzing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
          >
            {isAnalyzing ? (
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </motion.div>

          {/* Upload Text */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {isAnalyzing ? "Analyzing Document..." : "Upload Identity Document"}
            </h3>
            <p className="text-sm text-white/60">
              {isAnalyzing 
                ? "Running AI quality analysis and OCR extraction..."
                : "Drag and drop your document here, or click to browse"
              }
            </p>
          </div>

          {/* File Requirements */}
          {!isAnalyzing && (
            <div className="text-xs text-white/40 space-y-1">
              <p>Supported formats: JPEG, PNG, WebP, PDF</p>
              <p>Maximum file size: {maxSizeMB}MB</p>
              <p>AI-powered quality analysis and OCR extraction</p>
            </div>
          )}

          {/* Browse Button */}
          {!isAnalyzing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              Choose File
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Upload Failed</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality Results */}
      <AnimatePresence>
        {qualityMetrics && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {/* Overall Quality Score */}
            <div className="bg-black/40 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Document Quality Analysis
                </h4>
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-medium", getQualityColor(qualityMetrics.overall))}>
                    {getQualityLabel(qualityMetrics.overall)}
                  </span>
                  <span className="text-white/60 text-sm">
                    {qualityMetrics.overall}%
                  </span>
                </div>
              </div>

              {/* Quality Progress Bar */}
              <div className="space-y-3">
                {Object.entries(qualityMetrics).map(([metric, value]) => (
                  <div key={metric} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60 capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={cn("font-medium", getQualityColor(value))}>
                        {value}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          value >= QUALITY_THRESHOLDS.excellent ? "bg-green-400" :
                          value >= QUALITY_THRESHOLDS.good ? "bg-blue-400" :
                          value >= QUALITY_THRESHOLDS.acceptable ? "bg-yellow-400" : "bg-red-400"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OCR Results */}
            {showOCRResults && ocrResult && (
              <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Mistral OCR Results
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSensitiveData(!showSensitiveData)}
                      className="text-white/60 hover:text-white p-1"
                    >
                      {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <span className="text-xs text-white/60">
                      {ocrResult.confidence > 0 ? `${Math.round(ocrResult.confidence * 100)}% confidence` : 'Processing...'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Document Type */}
                  <div>
                    <span className="text-xs text-white/60">Document Type:</span>
                    <span className="ml-2 text-sm text-white capitalize">
                      {ocrResult.documentType || 'Unknown'}
                    </span>
                  </div>

                  {/* Extracted Fields */}
                  {showSensitiveData && ocrResult.extractedFields && (
                    <div className="space-y-2">
                      <span className="text-xs text-white/60">Extracted Information:</span>
                      {Object.entries(ocrResult.extractedFields).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-white/60 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-white font-mono">{value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Validation Messages */}
                  {ocrResult && (
                    <div className="space-y-2">
                      {getMistralOCRService().validateDocumentFields(ocrResult.extractedFields || {}).errors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2 text-red-400 text-sm">
                          <AlertCircle className="w-3 h-3" />
                          {error}
                        </div>
                      ))}
                      {getMistralOCRService().validateDocumentFields(ocrResult.extractedFields || {}).warnings.map((warning, index) => (
                        <div key={index} className="flex items-center gap-2 text-yellow-400 text-sm">
                          <AlertCircle className="w-3 h-3" />
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Extracted Text Preview */}
                  {showSensitiveData && ocrResult.text && (
                    <div>
                      <span className="text-xs text-white/60">Extracted Text:</span>
                      <div className="mt-1 p-2 bg-black/40 rounded text-xs text-white/80 font-mono max-h-20 overflow-y-auto">
                        {ocrResult.text.substring(0, 200)}
                        {ocrResult.text.length > 200 && '...'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
