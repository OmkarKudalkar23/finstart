"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from "react";

export interface FraudCase {
  id: string;
  userId: string;
  timestamp: Date;
  type: "identity_fraud" | "synthetic_identity" | "account_takeover" | "money_laundering" | "other";
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "false_positive";
  
  // Original AI assessment
  aiAssessment: {
    riskScore: number; // 0-100
    confidence: number; // 0-100
    triggeredRules: string[];
    biometricConfidence: number;
    documentAuthenticity: number;
    behavioralAnomalies: string[];
  };
  
  // Human reviewer decision
  reviewerDecision: {
    reviewerId: string;
    reviewerName: string;
    decision: "confirm_fraud" | "false_positive" | "needs_investigation";
    confidence: number; // 0-100
    reasoning: string;
    additionalEvidence?: string[];
    timestamp: Date;
  };
  
  // Learning data
  learningData: {
    featuresExtracted: number;
    modelVersion: string;
    predictionAccuracy: number;
    misclassifiedFeatures: string[];
    improvementSuggestions: string[];
  };
}

export interface ModelMetrics {
  modelVersion: string;
  timestamp: Date;
  accuracy: number; // 0-100
  precision: number; // 0-100
  recall: number; // 0-100
  f1Score: number; // 0-100
  falsePositiveRate: number; // 0-100
  falseNegativeRate: number; // 0-100
  totalCases: number;
  correctPredictions: number;
  improvementTrend: "improving" | "stable" | "declining";
}

export interface LearningFeedback {
  id: string;
  caseId: string;
  timestamp: Date;
  feedbackType: "model_correction" | "feature_weighting" | "rule_adjustment" | "threshold_tuning";
  
  // What was learned
  insights: {
    misclassifiedFeatures: Array<{
      feature: string;
      actualWeight: number;
      suggestedWeight: number;
      impact: number; // How much this would improve accuracy
    }>;
    rulePerformance: Array<{
      ruleId: string;
      accuracy: number;
      suggestedAdjustment: string;
    }>;
    thresholdRecommendations: Array<{
      metric: string;
      currentThreshold: number;
      suggestedThreshold: number;
      expectedImprovement: number;
    }>;
  };
  
  // Model updates
  modelUpdates: {
    version: string;
    changes: string[];
    expectedAccuracyImprovement: number;
    deploymentStatus: "pending" | "testing" | "deployed" | "rolled_back";
  };
}

interface LearningState {
  fraudCases: FraudCase[];
  learningFeedback: LearningFeedback[];
  modelMetrics: ModelMetrics[];
  isProcessing: boolean;
  lastModelUpdate: Date | null;
  learningEnabled: boolean;
}

type LearningAction =
  | { type: "ADD_FRAUD_CASE"; payload: FraudCase }
  | { type: "UPDATE_CASE_STATUS"; payload: { caseId: string; status: FraudCase["status"] } }
  | { type: "ADD_REVIEWER_DECISION"; payload: { caseId: string; decision: FraudCase["reviewerDecision"] } }
  | { type: "GENERATE_FEEDBACK"; payload: LearningFeedback }
  | { type: "UPDATE_MODEL_METRICS"; payload: ModelMetrics }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SET_LEARNING_ENABLED"; payload: boolean }
  | { type: "DEPLOY_MODEL_UPDATE"; payload: { feedbackId: string; version: string } };

const initialState: LearningState = {
  fraudCases: [],
  learningFeedback: [],
  modelMetrics: [],
  isProcessing: false,
  lastModelUpdate: null,
  learningEnabled: false
};

function learningReducer(state: LearningState, action: LearningAction): LearningState {
  switch (action.type) {
    case "ADD_FRAUD_CASE":
      return {
        ...state,
        fraudCases: [...state.fraudCases, action.payload]
      };
    
    case "UPDATE_CASE_STATUS":
      return {
        ...state,
        fraudCases: state.fraudCases.map(cases =>
          cases.id === action.payload.caseId
            ? { ...cases, status: action.payload.status }
            : cases
        )
      };
    
    case "ADD_REVIEWER_DECISION":
      return {
        ...state,
        fraudCases: state.fraudCases.map(cases =>
          cases.id === action.payload.caseId
            ? { ...cases, reviewerDecision: action.payload.decision }
            : cases
        )
      };
    
    case "GENERATE_FEEDBACK":
      return {
        ...state,
        learningFeedback: [...state.learningFeedback, action.payload]
      };
    
    case "UPDATE_MODEL_METRICS":
      return {
        ...state,
        modelMetrics: [...state.modelMetrics, action.payload]
      };
    
    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.payload
      };
    
    case "SET_LEARNING_ENABLED":
      return {
        ...state,
        learningEnabled: action.payload
      };
    
    case "DEPLOY_MODEL_UPDATE":
      return {
        ...state,
        learningFeedback: state.learningFeedback.map(feedback =>
          feedback.id === action.payload.feedbackId
            ? { 
                ...feedback, 
                modelUpdates: { 
                  ...feedback.modelUpdates, 
                  version: action.payload.version,
                  deploymentStatus: "deployed"
                }
              }
            : feedback
        ),
        lastModelUpdate: new Date()
      };
    
    default:
      return state;
  }
}

const LearningContext = createContext<{
  state: LearningState;
  dispatch: React.Dispatch<LearningAction>;
  submitReviewerDecision: (caseId: string, decision: Omit<FraudCase["reviewerDecision"], "timestamp">) => Promise<void>;
  generateLearningFeedback: (caseId: string) => Promise<void>;
  deployModelUpdate: (feedbackId: string) => Promise<void>;
  getModelPerformance: () => ModelMetrics | null;
  getLearningInsights: () => {
    topMisclassifiedFeatures: Array<{ feature: string; frequency: number }>;
    ruleAccuracyRanking: Array<{ ruleId: string; accuracy: number }>;
    improvementOpportunities: string[];
  };
} | null>(null);

export function FraudLearningProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learningReducer, initialState);

  // Auto-generate feedback when reviewer decisions are added
  useEffect(() => {
    const recentDecisions = state.fraudCases.filter(
      cases => cases.reviewerDecision && 
      Date.now() - cases.reviewerDecision.timestamp.getTime() < 60000 // Last minute
    );

    recentDecisions.forEach(cases => {
      generateLearningFeedback(cases.id);
    });
  }, [state.fraudCases]);

  const submitReviewerDecision = useCallback(async (caseId: string, decision: Omit<FraudCase["reviewerDecision"], "timestamp">) => {
    const fullDecision = {
      ...decision,
      timestamp: new Date()
    };

    dispatch({ type: "ADD_REVIEWER_DECISION", payload: { caseId, decision: fullDecision } });

    // Update case status based on decision
    let newStatus: FraudCase["status"];
    switch (decision.decision) {
      case "confirm_fraud":
        newStatus = "resolved";
        break;
      case "false_positive":
        newStatus = "false_positive";
        break;
      case "needs_investigation":
        newStatus = "investigating";
        break;
      default:
        newStatus = "open";
    }

    dispatch({ type: "UPDATE_CASE_STATUS", payload: { caseId, status: newStatus } });

    // Trigger learning if enabled
    if (state.learningEnabled) {
      await generateLearningFeedback(caseId);
    }
  }, [state.learningEnabled]);

  const generateLearningFeedback = useCallback(async (caseId: string) => {
    dispatch({ type: "SET_PROCESSING", payload: true });

    try {
      const fraudCase = state.fraudCases.find(c => c.id === caseId);
      if (!fraudCase || !fraudCase.reviewerDecision) return;

      // Simulate ML processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Analyze the case for learning insights
      const insights = analyzeCaseForLearning(fraudCase);
      
      // Generate model update recommendations
      const modelUpdates = generateModelUpdateRecommendations(insights, fraudCase);

      const feedback: LearningFeedback = {
        id: `feedback_${Date.now()}_${caseId}`,
        caseId,
        timestamp: new Date(),
        feedbackType: "model_correction",
        insights,
        modelUpdates
      };

      dispatch({ type: "GENERATE_FEEDBACK", payload: feedback });

      // Update model metrics
      const updatedMetrics = calculateUpdatedMetrics(fraudCase);
      dispatch({ type: "UPDATE_MODEL_METRICS", payload: updatedMetrics });

    } catch (error) {
      console.error("Error generating learning feedback:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  }, [state.fraudCases]);

  const analyzeCaseForLearning = (fraudCase: FraudCase): LearningFeedback["insights"] => {
    const misclassifiedFeatures: Array<{
      feature: string;
      actualWeight: number;
      suggestedWeight: number;
      impact: number;
    }> = [];
    const rulePerformance: Array<{
      ruleId: string;
      accuracy: number;
      suggestedAdjustment: string;
    }> = [];
    const thresholdRecommendations: Array<{
      metric: string;
      currentThreshold: number;
      suggestedThreshold: number;
      expectedImprovement: number;
    }> = [];

    // Analyze feature importance
    const aiRiskScore = fraudCase.aiAssessment.riskScore;
    const humanConfirmed = fraudCase.reviewerDecision.decision === "confirm_fraud";
    
    if ((aiRiskScore > 70 && !humanConfirmed) || (aiRiskScore < 30 && humanConfirmed)) {
      // Model was wrong - analyze which features contributed most
      const features = [
        { feature: "biometric_confidence", weight: fraudCase.aiAssessment.biometricConfidence },
        { feature: "document_authenticity", weight: fraudCase.aiAssessment.documentAuthenticity },
        { feature: "behavioral_anomalies", weight: fraudCase.aiAssessment.behavioralAnomalies.length * 20 }
      ];

      features.forEach(feature => {
        const suggestedWeight = humanConfirmed ? 
          Math.min(100, feature.weight * 1.2) : 
          Math.max(0, feature.weight * 0.8);
        
        misclassifiedFeatures.push({
          feature: feature.feature,
          actualWeight: feature.weight,
          suggestedWeight,
          impact: Math.abs(suggestedWeight - feature.weight)
        });
      });
    }

    // Analyze rule performance
    fraudCase.aiAssessment.triggeredRules.forEach(ruleId => {
      const accuracy = humanConfirmed ? 85 : 45; // Simplified - would be calculated from historical data
      rulePerformance.push({
        ruleId,
        accuracy,
        suggestedAdjustment: accuracy < 60 ? "Increase threshold sensitivity" : "Maintain current settings"
      });
    });

    // Analyze thresholds
    if (Math.abs(aiRiskScore - 50) < 20) {
      thresholdRecommendations.push({
        metric: "risk_score_threshold",
        currentThreshold: 50,
        suggestedThreshold: humanConfirmed ? 45 : 55,
        expectedImprovement: 5
      });
    }

    return {
      misclassifiedFeatures,
      rulePerformance,
      thresholdRecommendations
    };
  };

  const generateModelUpdateRecommendations = (
    insights: LearningFeedback["insights"], 
    fraudCase: FraudCase
): LearningFeedback["modelUpdates"] => {
    const changes: string[] = [];
    let expectedImprovement = 0;

    // Feature weight adjustments
    insights.misclassifiedFeatures.forEach(feature => {
      if (feature.impact > 10) {
        changes.push(`Adjust ${feature.feature} weight from ${feature.actualWeight} to ${feature.suggestedWeight}`);
        expectedImprovement += feature.impact * 0.1;
      }
    });

    // Rule adjustments
    insights.rulePerformance.forEach(rule => {
      if (rule.accuracy < 60) {
        changes.push(`Optimize ${rule.ruleId}: ${rule.suggestedAdjustment}`);
        expectedImprovement += 3;
      }
    });

    // Threshold adjustments
    insights.thresholdRecommendations.forEach(threshold => {
      changes.push(`Update ${threshold.metric} threshold from ${threshold.currentThreshold} to ${threshold.suggestedThreshold}`);
      expectedImprovement += threshold.expectedImprovement;
    });

    return {
      version: `v${Date.now()}`,
      changes,
      expectedAccuracyImprovement: Math.min(15, expectedImprovement),
      deploymentStatus: "pending"
    };
  };

  const calculateUpdatedMetrics = (fraudCase: FraudCase): ModelMetrics => {
    // Simplified metrics calculation - in real implementation, this would be more sophisticated
    const previousMetrics = state.modelMetrics[state.modelMetrics.length - 1];
    
    const isCorrectPrediction = 
      (fraudCase.aiAssessment.riskScore > 70 && fraudCase.reviewerDecision.decision === "confirm_fraud") ||
      (fraudCase.aiAssessment.riskScore < 30 && fraudCase.reviewerDecision.decision === "false_positive");

    const totalCases = (previousMetrics?.totalCases || 0) + 1;
    const correctPredictions = (previousMetrics?.correctPredictions || 0) + (isCorrectPrediction ? 1 : 0);
    const accuracy = (correctPredictions / totalCases) * 100;

    return {
      modelVersion: `v${Date.now()}`,
      timestamp: new Date(),
      accuracy,
      precision: accuracy * 0.95, // Simplified
      recall: accuracy * 0.92, // Simplified
      f1Score: accuracy * 0.93, // Simplified
      falsePositiveRate: 100 - accuracy * 0.9, // Simplified
      falseNegativeRate: 100 - accuracy * 0.85, // Simplified
      totalCases,
      correctPredictions,
      improvementTrend: accuracy > (previousMetrics?.accuracy || 0) ? "improving" : "stable"
    };
  };

  const deployModelUpdate = useCallback(async (feedbackId: string) => {
    const feedback = state.learningFeedback.find(f => f.id === feedbackId);
    if (!feedback) return;

    // Simulate deployment process
    dispatch({ type: "SET_PROCESSING", payload: true });
    
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate deployment time
    
    dispatch({ 
      type: "DEPLOY_MODEL_UPDATE", 
      payload: { feedbackId, version: feedback.modelUpdates.version }
    });
    
    dispatch({ type: "SET_PROCESSING", payload: false });
  }, [state.learningFeedback]);

  const getModelPerformance = (): ModelMetrics | null => {
    return state.modelMetrics[state.modelMetrics.length - 1] || null;
  };

  const getLearningInsights = () => {
    const allFeatures = state.learningFeedback.flatMap(f => f.insights.misclassifiedFeatures);
    const featureFrequency = allFeatures.reduce((acc, feature) => {
      acc[feature.feature] = (acc[feature.feature] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topMisclassifiedFeatures = Object.entries(featureFrequency)
      .map(([feature, frequency]) => ({ feature, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    const allRules = state.learningFeedback.flatMap(f => f.insights.rulePerformance);
    const ruleAccuracyRanking = allRules
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 10);

    const improvementOpportunities = [
      ...topMisclassifiedFeatures.map(f => `Rebalance ${f.feature} feature weight`),
      ...ruleAccuracyRanking.filter(r => r.accuracy < 70).map(r => `Optimize ${r.ruleId} rule`)
    ].slice(0, 5);

    return {
      topMisclassifiedFeatures,
      ruleAccuracyRanking,
      improvementOpportunities
    };
  };

  return (
    <LearningContext.Provider
      value={{
        state,
        dispatch,
        submitReviewerDecision,
        generateLearningFeedback,
        deployModelUpdate,
        getModelPerformance,
        getLearningInsights
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useFraudLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useFraudLearning must be dealt the? within within a FraudLearningProvider");
  }
  return context;
}

// Hook for fraud reviewers to submit decisions
export function useFraudReviewer() {
  const { submitReviewerDecision } = useFraudLearning();

  const confirmFraud = useCallback(async (caseId: string, reviewerId: string, reviewerName: string, reasoning: string, confidence: number) => {
    await submitReviewerDecision(caseId, {
      reviewerId,
      reviewerName,
      decision: "confirm_fraud",
      reasoning,
      confidence
    });
  }, [submitReviewerDecision]);

  const markFalsePositive = useCallback(async (caseId: string, reviewerId: string, reviewerName: string, reasoning: string, confidence: number) => {
    await submitReviewerDecision(caseId, {
      reviewerId,
      reviewerName,
      decision: "false_positive",
      reasoning,
      confidence
    });
  }, [submitReviewerDecision]);

  const requestInvestigation = useCallback(async (caseId: string, reviewerId: string, reviewerName: string, reasoning: string, confidence: number, additionalEvidence?: string[]) => {
    await submitReviewerDecision(caseId, {
      reviewerId,
      reviewerName,
      decision: "needs_investigation",
      reasoning,
      confidence,
      additionalEvidence
    });
  }, [submitReviewerDecision]);

  return {
    confirmFraud,
    markFalsePositive,
    requestInvestigation
  };
}
