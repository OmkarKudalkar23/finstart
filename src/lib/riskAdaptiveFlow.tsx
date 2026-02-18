"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

// Risk scoring types
export interface RiskFactors {
  identity: {
    documentType: "passport" | "id_card" | "drivers_license";
    documentQuality: number; // 0-100
    ocrConfidence: number; // 0-100
    expiryDays: number;
  };
  biometrics: {
    livenessScore: number; // 0-100
    faceMatchConfidence: number; // 0-100
    antiSpoofScore: number; // 0-100
  };
  behavioral: {
    completionTime: number; // seconds
    deviceFingerprint: string;
    ipAddress: string;
    locationConsistency: boolean;
  };
  compliance: {
    amlScore: number; // 0-100
    pepMatch: boolean;
    sanctionsMatch: boolean;
    adverseMedia: boolean;
  };
}

export interface RiskScore {
  overall: number; // 0-100
  category: "low" | "medium" | "high" | "critical";
  factors: RiskFactors;
  timestamp: Date;
  confidence: number; // AI confidence in the score
}

export interface FlowStep {
  id: string;
  name: string;
  required: boolean;
  weight: number;
  estimatedTime: number; // seconds
}

interface RiskState {
  currentScore: RiskScore | null;
  flowConfiguration: FlowStep[];
  adaptations: {
    stepsSkipped: string[];
    stepsAdded: string[];
    timeReduction: number; // percentage
  };
  isProcessing: boolean;
}

type RiskAction =
  | { type: "UPDATE_RISK_SCORE"; payload: RiskScore }
  | { type: "CONFIGURE_FLOW"; payload: FlowStep[] }
  | { type: "ADAPT_FLOW"; payload: Partial<RiskState["adaptations"]> }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "RESET_STATE" };

const BASE_FLOW_STEPS: FlowStep[] = [
  {
    id: "identity",
    name: "Identity Verification",
    required: true,
    weight: 0.3,
    estimatedTime: 120
  },
  {
    id: "biometrics",
    name: "Biometric Verification",
    required: true,
    weight: 0.25,
    estimatedTime: 90
  },
  {
    id: "details",
    name: "Personal Details",
    required: true,
    weight: 0.2,
    estimatedTime: 180
  },
  {
    id: "aml",
    name: "AML Screening",
    required: true,
    weight: 0.15,
    estimatedTime: 60
  },
  {
    id: "additional_docs",
    name: "Additional Documentation",
    required: false,
    weight: 0.1,
    estimatedTime: 300
  }
];

const initialState: RiskState = {
  currentScore: null,
  flowConfiguration: BASE_FLOW_STEPS,
  adaptations: {
    stepsSkipped: [],
    stepsAdded: [],
    timeReduction: 0
  },
  isProcessing: false
};

function riskReducer(state: RiskState, action: RiskAction): RiskState {
  switch (action.type) {
    case "UPDATE_RISK_SCORE":
      return {
        ...state,
        currentScore: action.payload,
        isProcessing: false
      };
    case "CONFIGURE_FLOW":
      return {
        ...state,
        flowConfiguration: action.payload
      };
    case "ADAPT_FLOW":
      return {
        ...state,
        adaptations: {
          ...state.adaptations,
          ...action.payload
        }
      };
    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.payload
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

const RiskContext = createContext<{
  state: RiskState;
  dispatch: React.Dispatch<RiskAction>;
  calculateRiskScore: (factors: Partial<RiskFactors>) => Promise<RiskScore>;
  adaptFlow: (score: RiskScore) => FlowStep[];
  getNextStep: () => FlowStep | null;
  shouldSkipStep: (stepId: string) => boolean;
} | null>(null);

export function RiskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(riskReducer, initialState);

  // Calculate comprehensive risk score
  const calculateRiskScore = async (factors: Partial<RiskFactors>): Promise<RiskScore> => {
    dispatch({ type: "SET_PROCESSING", payload: true });

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const completeFactors: RiskFactors = {
      identity: {
        documentType: factors.identity?.documentType || "id_card",
        documentQuality: factors.identity?.documentQuality || 85,
        ocrConfidence: factors.identity?.ocrConfidence || 90,
        expiryDays: factors.identity?.expiryDays || 365
      },
      biometrics: {
        livenessScore: factors.biometrics?.livenessScore || 95,
        faceMatchConfidence: factors.biometrics?.faceMatchConfidence || 92,
        antiSpoofScore: factors.biometrics?.antiSpoofScore || 88
      },
      behavioral: {
        completionTime: factors.behavioral?.completionTime || 300,
        deviceFingerprint: factors.behavioral?.deviceFingerprint || "unknown",
        ipAddress: factors.behavioral?.ipAddress || "unknown",
        locationConsistency: factors.behavioral?.locationConsistency ?? true
      },
      compliance: {
        amlScore: factors.compliance?.amlScore || 95,
        pepMatch: factors.compliance?.pepMatch ?? false,
        sanctionsMatch: factors.compliance?.sanctionsMatch ?? false,
        adverseMedia: factors.compliance?.adverseMedia ?? false
      }
    };

    // Calculate individual component scores
    const identityScore = calculateIdentityScore(completeFactors.identity);
    const biometricScore = calculateBiometricScore(completeFactors.biometrics);
    const behavioralScore = calculateBehavioralScore(completeFactors.behavioral);
    const complianceScore = calculateComplianceScore(completeFactors.compliance);

    // Weighted overall score (lower is riskier)
    const weights = {
      identity: 0.3,
      biometrics: 0.25,
      behavioral: 0.2,
      compliance: 0.25
    };

    const overallScore = 
      identityScore * weights.identity +
      biometricScore * weights.biometrics +
      behavioralScore * weights.behavioral +
      complianceScore * weights.compliance;

    // Determine risk category
    let category: RiskScore["category"];
    if (overallScore >= 85) category = "low";
    else if (overallScore >= 70) category = "medium";
    else if (overallScore >= 50) category = "high";
    else category = "critical";

    const riskScore: RiskScore = {
      overall: Math.round(overallScore),
      category,
      factors: completeFactors,
      timestamp: new Date(),
      confidence: Math.min(95, Math.max(60, overallScore + Math.random() * 10 - 5))
    };

    dispatch({ type: "UPDATE_RISK_SCORE", payload: riskScore });
    return riskScore;
  };

  const calculateIdentityScore = (identity: RiskFactors["identity"]): number => {
    let score = 100;

    // Document type scoring
    if (identity.documentType === "passport") score += 5;
    else if (identity.documentType === "id_card") score += 0;
    else if (identity.documentType === "drivers_license") score -= 2;

    // Quality scoring
    score -= (100 - identity.documentQuality) * 0.3;
    score -= (100 - identity.ocrConfidence) * 0.2;

    // Expiry scoring
    if (identity.expiryDays < 30) score -= 20;
    else if (identity.expiryDays < 90) score -= 10;
    else if (identity.expiryDays < 365) score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  const calculateBiometricScore = (biometrics: RiskFactors["biometrics"]): number => {
    return (
      biometrics.livenessScore * 0.4 +
      biometrics.faceMatchConfidence * 0.35 +
      biometrics.antiSpoofScore * 0.25
    );
  };

  const calculateBehavioralScore = (behavioral: RiskFactors["behavioral"]): number => {
    let score = 100;

    // Time-based scoring
    if (behavioral.completionTime < 120) score -= 15; // Too fast = potential automation
    else if (behavioral.completionTime > 1800) score -= 10; // Too slow = potential confusion

    // Location consistency
    if (!behavioral.locationConsistency) score -= 25;

    return Math.max(0, Math.min(100, score));
  };

  const calculateComplianceScore = (compliance: RiskFactors["compliance"]): number => {
    let score = compliance.amlScore;

    if (compliance.pepMatch) score -= 30;
    if (compliance.sanctionsMatch) score -= 50;
    if (compliance.adverseMedia) score -= 20;

    return Math.max(0, Math.min(100, score));
  };

  // Adapt flow based on risk score
  const adaptFlow = (score: RiskScore): FlowStep[] => {
    const adaptedFlow = [...BASE_FLOW_STEPS];
    const stepsSkipped: string[] = [];
    const stepsAdded: string[] = [];

    switch (score.category) {
      case "low":
        // Fast-track: skip additional documentation
        const additionalDocsIndex = adaptedFlow.findIndex(s => s.id === "additional_docs");
        if (additionalDocsIndex !== -1) {
          adaptedFlow.splice(additionalDocsIndex, 1);
          stepsSkipped.push("additional_docs");
        }
        break;

      case "medium":
        // Standard flow, maybe add extra verification
        if (score.factors.identity.documentQuality < 80) {
          stepsAdded.push("identity_enhanced");
        }
        break;

      case "high":
        // Enhanced verification
        stepsAdded.push("identity_enhanced", "video_interview");
        break;

      case "critical":
        // Maximum verification
        stepsAdded.push("identity_enhanced", "video_interview", "manual_review");
        break;
    }

    // Calculate time reduction
    const baseTime = BASE_FLOW_STEPS.reduce((sum, step) => sum + step.estimatedTime, 0);
    const adaptedTime = adaptedFlow.reduce((sum, step) => sum + step.estimatedTime, 0);
    const timeReduction = Math.round(((baseTime - adaptedTime) / baseTime) * 100);

    dispatch({
      type: "ADAPT_FLOW",
      payload: { stepsSkipped, stepsAdded, timeReduction }
    });

    return adaptedFlow;
  };

  const getNextStep = (): FlowStep | null => {
    // This would integrate with current onboarding state
    // For now, return the first required step
    return state.flowConfiguration.find(step => step.required) || null;
  };

  const shouldSkipStep = (stepId: string): boolean => {
    return state.adaptations.stepsSkipped.includes(stepId);
  };

  return (
    <RiskContext.Provider
      value={{
        state,
        dispatch,
        calculateRiskScore,
        adaptFlow,
        getNextStep,
        shouldSkipStep
      }}
    >
      {children}
    </RiskContext.Provider>
  );
}

export function useRiskAdaptiveFlow() {
  const context = useContext(RiskContext);
  if (!context) {
    throw new Error("useRiskAdaptiveFlow must be used within a RiskProvider");
  }
  return context;
}

// Hook for real-time risk monitoring
export function useRiskMonitoring() {
  const { state, calculateRiskScore } = useRiskAdaptiveFlow();

  const updateRiskFactors = async (newFactors: Partial<RiskFactors>) => {
    const currentFactors = state.currentScore?.factors;
    const updatedFactors = {
      ...currentFactors,
      ...newFactors
    };
    
    return await calculateRiskScore(updatedFactors);
  };

  return {
    currentScore: state.currentScore,
    updateRiskFactors,
    isProcessing: state.isProcessing
  };
}
