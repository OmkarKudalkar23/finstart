"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AIOnboardingCopilot } from "@/components/ui/AIOnboardingCopilot";
import { SmartDocumentQuality } from "@/components/ui/SmartDocumentQualityEnhanced";
import { getMistralOCRService } from "@/lib/mistralOCR";
import { RiskProvider, useRiskAdaptiveFlow, useRiskMonitoring } from "@/lib/riskAdaptiveFlow";
import { DropOffRecoveryProvider, useDropOffRecovery } from "@/lib/dropOffRecovery";
import { FraudLearningProvider, useFraudLearning } from "@/lib/fraudLearning";
import { StaffAssistProvider, useStaffAssist, useAIEscalation } from "@/lib/staffAssist";
import { AlertTriangle, Brain, Shield, Zap } from "lucide-react";

// Props for the advanced features wrapper
interface AdvancedOnboardingFeaturesProps {
  children: React.ReactNode;
  userId: string;
  currentStep: string;
  onStepComplete: (step: string, data: any) => void;
  onEscalation: (reason: string) => void;
}

// Core component that uses all the contexts
function AdvancedOnboardingFeaturesCore({ 
  children, 
  userId, 
  currentStep, 
  onStepComplete, 
  onEscalation 
}: AdvancedOnboardingFeaturesProps) {
  const { 
    state: riskState,
    calculateRiskScore, 
    adaptFlow, 
    shouldSkipStep, 
    getNextStep 
  } = useRiskAdaptiveFlow();

  const { 
    state: recoveryState,
    trackActivity,
    generateResumeLink,
    personalizeContent
  } = useDropOffRecovery();

  const { 
    state: learningState,
    submitReviewerDecision,
    generateLearningFeedback,
    getModelPerformance,
    getLearningInsights
  } = useFraudLearning();

  const { 
    state: staffState,
    escalateToStaff,
    assignToStaff,
    resolveEscalation,
    generateEscalationSummary,
    getStaffWorkload,
    getEscalationQueue
  } = useStaffAssist();

  // Track user activity for drop-off detection
  useEffect(() => {
    const activityTracker = setInterval(() => {
      trackActivity(userId, currentStep, 0, {});
    }, 30000);

    return () => clearInterval(activityTracker);
  }, [userId, currentStep, trackActivity]);

  // Handle escalation from any feature
  const handleEscalation = useCallback(async (reason: string, context: any) => {
    try {
      const escalationReason = reason.includes('high_risk') ? 'high_risk' : 
                              reason.includes('low_confidence') ? 'low_confidence' : 
                              reason.includes('user_request') ? 'user_request' : 
                              reason.includes('system_error') ? 'system_error' : 'complex_case';
      
      await escalateToStaff({
        userId,
        caseId: `case_${Date.now()}`,
        reason: escalationReason,
        urgency: reason.includes('high_risk') ? 'high' : 'medium',
        userContext: context || {
          currentStep,
          progress: 50,
          timeSpent: 120,
          previousAttempts: 0,
          userSentiment: 'neutral'
        },
        assignment: {
          assignedBy: 'system',
          estimatedResolutionTime: 30
        },
        aiAssessment: {
          confidence: 85,
          riskScore: riskState.currentScore?.overall || 0,
          decision: riskState.currentScore?.category === 'high' || riskState.currentScore?.category === 'critical' ? 'manual_review' : 'approve',
          keyFactors: ['document_quality', 'ocr_confidence'],
          uncertaintyAreas: []
        }
      });
      
      onEscalation?.(reason);
    } catch (error) {
      console.error('Escalation failed:', error);
    }
  }, [userId, riskState.currentScore, escalateToStaff, onEscalation]);

  return (
    <>
      {/* AI Onboarding Copilot - Floating Assistant */}
      <AIOnboardingCopilot
        currentStep={currentStep}
        userConfidence={riskState.currentScore?.confidence || 85}
        onEscalate={() => handleEscalation('user_request', { currentStep })}
      />

      {/* Main Content */}
      {children}

      {/* Risk-based Step Navigation (invisible) */}
      {shouldSkipStep(currentStep) && (
        <div style={{ display: 'none' }}>
          {(() => {
            onStepComplete(currentStep, { skipped: true });
            return null;
          })()}
        </div>
      )}
    </>
  );
}

// Main wrapper component with all providers
export function AdvancedOnboardingFeatures(props: AdvancedOnboardingFeaturesProps) {
  return (
    <RiskProvider>
      <DropOffRecoveryProvider>
        <FraudLearningProvider>
          <StaffAssistProvider>
            <AdvancedOnboardingFeaturesCore {...props} />
          </StaffAssistProvider>
        </FraudLearningProvider>
      </DropOffRecoveryProvider>
    </RiskProvider>
  );
}

// Enhanced document upload component with Mistral OCR
export function EnhancedDocumentUpload({ 
  onUpload, 
  onQualityCheck,
  className 
}: { 
  onUpload: (file: File, analysis: any) => void;
  onQualityCheck: (quality: any) => void;
  className?: string;
}) {
  return (
    <AdvancedOnboardingFeatures
      userId="document_upload_user"
      currentStep="document_upload"
      onStepComplete={() => {}}
      onEscalation={() => {}}
    >
      <EnhancedDocumentUploadInner
        onUpload={onUpload}
        onQualityCheck={onQualityCheck}
        className={className}
      />
    </AdvancedOnboardingFeatures>
  );
}

// Inner component that uses the context
function EnhancedDocumentUploadInner({ 
  onUpload, 
  onQualityCheck,
  className 
}: { 
  onUpload: (file: File, analysis: any) => void;
  onQualityCheck: (quality: any) => void;
  className?: string;
}) {
  const { trackActivity } = useDropOffRecovery();
  const { updateRiskFactors } = useRiskMonitoring();
  const { submitReviewerDecision } = useFraudLearning();
  const { escalateLowConfidence } = useAIEscalation();

  const handleDocumentUpload = async (file: File, analysis: any) => {
    try {
      // Track the upload activity
      trackActivity("document_upload_user", "document_upload", 50, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        qualityScore: analysis.overall,
        ocrConfidence: analysis.ocrConfidence
      });

      // Update risk factors based on document quality and OCR results
      await updateRiskFactors({
        identity: {
          documentType: (analysis.documentType as "passport" | "id_card" | "drivers_license") || "id_card",
          documentQuality: analysis.overall,
          ocrConfidence: Math.round((analysis.ocrConfidence || 0) * 100),
          expiryDays: 0
        }
      });

      // Check for potential fraud indicators using OCR results
      if (analysis.validationErrors && analysis.validationErrors.length > 0) {
        // Process as potential fraud case
        await submitReviewerDecision(`doc_${Date.now()}`, {
          reviewerId: "system",
          reviewerName: "AI System",
          decision: "needs_investigation",
          reasoning: analysis.validationErrors.join(", "),
          confidence: 90
        });
      }

      // Escalate if OCR confidence is low
      if (analysis.ocrConfidence && analysis.ocrConfidence < 0.7) {
        await escalateLowConfidence(
          "current_user",
          "doc_upload",
          Math.round(analysis.ocrConfidence * 100),
          {
            currentStep: "document_upload",
            progress: 50,
            timeSpent: 120,
            previousAttempts: 0,
            userSentiment: "neutral"
          }
        );
      }

      // Call the original upload handler
      onUpload(file, analysis);

    } catch (error) {
      console.error("Error in enhanced document upload:", error);
    }
  };

  return (
    <SmartDocumentQuality
      onUpload={handleDocumentUpload}
      onQualityCheck={onQualityCheck}
      className={className}
      showOCRResults={true}
    />
  );
}

// Hook for components to access advanced features
export function useAdvancedOnboarding() {
  const riskFlow = useRiskAdaptiveFlow();
  const dropOffRecovery = useDropOffRecovery();
  const fraudLearning = useFraudLearning();
  const staffAssist = useStaffAssist();

  return {
    // Risk assessment
    currentRiskScore: riskFlow.state.currentScore,
    riskLevel: riskFlow.state.currentScore?.category || 'low',
    updateRiskFactors: riskFlow.calculateRiskScore,
    shouldSkipStep: riskFlow.shouldSkipStep,
    
    // Drop-off recovery
    trackActivity: dropOffRecovery.trackActivity,
    recoveryActions: dropOffRecovery.state.recoveryActions,
    
    // Fraud learning
    processReviewerDecision: fraudLearning.submitReviewerDecision,
    modelMetrics: fraudLearning.getModelPerformance(),
    
    // Staff assist
    escalateToStaff: staffAssist.escalateToStaff,
    resolveEscalation: staffAssist.resolveEscalation,
    staffMembers: staffAssist.state.staffMembers,
    escalations: staffAssist.state.escalations
  };
}
