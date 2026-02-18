"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from "react";
import { motion } from "framer-motion";

export interface StaffEscalation {
  id: string;
  userId: string;
  caseId: string;
  timestamp: Date;
  reason: "low_confidence" | "high_risk" | "user_request" | "system_error" | "complex_case";
  urgency: "low" | "medium" | "high" | "critical";
  
  // AI assessment that triggered escalation
  aiAssessment: {
    confidence: number; // 0-100
    riskScore: number; // 0-100
    decision: "approve" | "reject" | "manual_review";
    keyFactors: string[];
    uncertaintyAreas: string[];
  };
  
  // User context
  userContext: {
    currentStep: string;
    progress: number; // 0-100
    timeSpent: number; // seconds
    previousAttempts: number;
    userSentiment: "frustrated" | "confused" | "neutral" | "confident";
  };
  
  // Assignment
  assignment: {
    assignedTo?: string;
    assignedAt?: Date;
    assignedBy: string; // System or manager
    estimatedResolutionTime: number; // minutes
  };
  
  // Resolution
  resolution?: {
    resolvedBy: string;
    resolvedAt: Date;
    action: "approve" | "reject" | "request_more_info" | "escalate_further";
    reasoning: string;
    followUpRequired: boolean;
  };
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "compliance_officer" | "fraud_analyst" | "support_agent" | "team_lead";
  status: "available" | "busy" | "offline";
  currentLoad: number; // Number of active cases
  expertise: string[];
  averageResolutionTime: number; // minutes
  satisfactionScore: number; // 0-100
}

export interface EscalationSummary {
  escalationId: string;
  aiSummary: {
    decisionPath: string[];
    confidenceBreakdown: {
      identity: number;
      biometrics: number;
      compliance: number;
      behavioral: number;
    };
    riskIndicators: string[];
    recommendation: string;
  };
  userJourney: {
    stepsCompleted: string[];
    timePerStep: Record<string, number>;
    dropoffPoints: string[];
    errorMessages: string[];
  };
  quickActions: Array<{
    action: string;
    confidence: number;
    impact: string;
    estimatedTime: number; // seconds
  }>;
}

interface StaffAssistState {
  escalations: StaffEscalation[];
  staffMembers: StaffMember[];
  escalationSummaries: Map<string, EscalationSummary>;
  isAutoAssigning: boolean;
  assignmentRules: {
    maxCasesPerStaff: number;
    expertiseMatching: boolean;
    loadBalancing: boolean;
    urgencyPriority: boolean;
  };
}

type StaffAssistAction =
  | { type: "CREATE_ESCALATION"; payload: StaffEscalation }
  | { type: "ASSIGN_ESCALATION"; payload: { escalationId: string; staffId: string } }
  | { type: "RESOLVE_ESCALATION"; payload: { escalationId: string; resolution: StaffEscalation["resolution"] } }
  | { type: "UPDATE_STAFF_STATUS"; payload: { staffId: string; status: StaffMember["status"] } }
  | { type: "ADD_STAFF_MEMBER"; payload: StaffMember }
  | { type: "GENERATE_SUMMARY"; payload: { escalationId: string; summary: EscalationSummary } }
  | { type: "SET_AUTO_ASSIGNING"; payload: boolean }
  | { type: "UPDATE_ASSIGNMENT_RULES"; payload: Partial<StaffAssistState["assignmentRules"]> };

const initialState: StaffAssistState = {
  escalations: [],
  staffMembers: [],
  escalationSummaries: new Map(),
  isAutoAssigning: true,
  assignmentRules: {
    maxCasesPerStaff: 5,
    expertiseMatching: true,
    loadBalancing: true,
    urgencyPriority: true
  }
};

function staffAssistReducer(state: StaffAssistState, action: StaffAssistAction): StaffAssistState {
  switch (action.type) {
    case "CREATE_ESCALATION":
      const newEscalation = action.payload;
      let updatedEscalations = [...state.escalations, newEscalation];
      
      // Auto-assign if enabled
      if (state.isAutoAssigning) {
        const bestStaff = findBestStaff(newEscalation, state.staffMembers, state.assignmentRules);
        if (bestStaff) {
          newEscalation.assignment = {
            assignedTo: bestStaff.id,
            assignedAt: new Date(),
            assignedBy: "system",
            estimatedResolutionTime: bestStaff.averageResolutionTime
          };
        }
      }
      
      return {
        ...state,
        escalations: updatedEscalations
      };
    
    case "ASSIGN_ESCALATION":
      return {
        ...state,
        escalations: state.escalations.map(escalation =>
          escalation.id === action.payload.escalationId
            ? {
                ...escalation,
                assignment: {
                  assignedTo: action.payload.staffId,
                  assignedAt: new Date(),
                  assignedBy: "manager",
                  estimatedResolutionTime: state.staffMembers.find(s => s.id === action.payload.staffId)?.averageResolutionTime || 30
                }
              }
            : escalation
        )
      };
    
    case "RESOLVE_ESCALATION":
      return {
        ...state,
        escalations: state.escalations.map(escalation =>
          escalation.id === action.payload.escalationId
            ? { ...escalation, resolution: action.payload.resolution }
            : escalation
        )
      };
    
    case "UPDATE_STAFF_STATUS":
      return {
        ...state,
        staffMembers: state.staffMembers.map(staff =>
          staff.id === action.payload.staffId
            ? { ...staff, status: action.payload.status }
            : staff
        )
      };
    
    case "ADD_STAFF_MEMBER":
      return {
        ...state,
        staffMembers: [...state.staffMembers, action.payload]
      };
    
    case "GENERATE_SUMMARY":
      return {
        ...state,
        escalationSummaries: new Map(state.escalationSummaries).set(
          action.payload.escalationId,
          action.payload.summary
        )
      };
    
    case "SET_AUTO_ASSIGNING":
      return {
        ...state,
        isAutoAssigning: action.payload
      };
    
    case "UPDATE_ASSIGNMENT_RULES":
      return {
        ...state,
        assignmentRules: { ...state.assignmentRules, ...action.payload }
      };
    
    default:
      return state;
  }
}

function findBestStaff(
  escalation: StaffEscalation, 
  staffMembers: StaffMember[], 
  rules: StaffAssistState["assignmentRules"]
): StaffMember | null {
  const availableStaff = staffMembers.filter(staff => 
    staff.status === "available" && 
    staff.currentLoad < rules.maxCasesPerStaff
  );

  if (availableStaff.length === 0) return null;

  // Score each staff member based on rules
  const scoredStaff = availableStaff.map(staff => {
    let score = 0;

    // Load balancing (lower load = higher score)
    if (rules.loadBalancing) {
      score += (rules.maxCasesPerStaff - staff.currentLoad) * 10;
    }

    // Urgency priority (higher urgency = prefer experienced staff)
    if (rules.urgencyPriority) {
      const urgencyScore = { low: 1, medium: 2, high: 3, critical: 4 }[escalation.urgency];
      score += urgencyScore * 5;
    }

    // Expertise matching
    if (rules.expertiseMatching) {
      const relevantExpertise = getRelevantExpertise(escalation);
      const matchingExpertise = staff.expertise.filter(exp => relevantExpertise.includes(exp));
      score += matchingExpertise.length * 15;
    }

    // Satisfaction score (higher satisfaction = higher score)
    score += staff.satisfactionScore * 0.2;

    // Efficiency (lower resolution time = higher score)
    score += (60 - Math.min(staff.averageResolutionTime, 60)) * 0.5;

    return { staff, score };
  });

  // Return the staff member with the highest score
  return scoredStaff.reduce((best, current) => current.score > best.score ? current : best).staff;
}

function getRelevantExpertise(escalation: StaffEscalation): string[] {
  const expertise = [];
  
  switch (escalation.reason) {
    case "low_confidence":
      expertise.push("identity_verification", "biometric_analysis");
      break;
    case "high_risk":
      expertise.push("fraud_detection", "aml_compliance", "risk_assessment");
      break;
    case "complex_case":
      expertise.push("complex_cases", "problem_resolution");
      break;
    case "system_error":
      expertise.push("technical_support", "system_troubleshooting");
      break;
    default:
      expertise.push("general_support");
  }
  
  return expertise;
}

const StaffAssistContext = createContext<{
  state: StaffAssistState;
  dispatch: React.Dispatch<StaffAssistAction>;
  escalateToStaff: (escalation: Omit<StaffEscalation, "id" | "timestamp">) => Promise<void>;
  assignToStaff: (escalationId: string, staffId: string) => void;
  resolveEscalation: (escalationId: string, resolution: Omit<NonNullable<StaffEscalation["resolution"]>, "resolvedAt">) => void;
  generateEscalationSummary: (escalationId: string) => Promise<EscalationSummary>;
  getStaffWorkload: (staffId: string) => number;
  getEscalationQueue: (status?: StaffMember["status"]) => StaffEscalation[];
} | null>(null);

export function StaffAssistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(staffAssistReducer, initialState);

  // Initialize with sample staff members
  useEffect(() => {
    const sampleStaff: StaffMember[] = [
      {
        id: "staff_1",
        name: "Sarah Chen",
        email: "sarah.chen@finstart.io",
        role: "compliance_officer",
        status: "available",
        currentLoad: 2,
        expertise: ["identity_verification", "aml_compliance", "fraud_detection"],
        averageResolutionTime: 15,
        satisfactionScore: 92
      },
      {
        id: "staff_2",
        name: "Marcus Johnson",
        email: "marcus.johnson@finstart.io",
        role: "fraud_analyst",
        status: "available",
        currentLoad: 1,
        expertise: ["fraud_detection", "risk_assessment", "behavioral_analysis"],
        averageResolutionTime: 20,
        satisfactionScore: 88
      },
      {
        id: "staff_3",
        name: "Priya Patel",
        email: "priya.patel@finstart.io",
        role: "support_agent",
        status: "busy",
        currentLoad: 4,
        expertise: ["customer_support", "technical_support", "general_inquiries"],
        averageResolutionTime: 12,
        satisfactionScore: 95
      }
    ];

    sampleStaff.forEach(staff => {
      dispatch({ type: "ADD_STAFF_MEMBER", payload: staff });
    });
  }, []);

  const escalateToStaff = useCallback(async (escalationData: Omit<StaffEscalation, "id" | "timestamp">) => {
    const escalation: StaffEscalation = {
      ...escalationData,
      id: `escalation_${Date.now()}_${escalationData.userId}`,
      timestamp: new Date()
    };

    dispatch({ type: "CREATE_ESCALATION", payload: escalation });

    // Generate summary for the new escalation
    await generateEscalationSummary(escalation.id);

    // Update staff load if auto-assigned
    if (escalation.assignment?.assignedTo) {
      const staff = state.staffMembers.find(s => s.id === escalation.assignment.assignedTo);
      if (staff) {
        // In real implementation, this would update the staff member's current load
        console.log(`Assigned escalation ${escalation.id} to ${staff.name}`);
      }
    }
  }, [state.staffMembers]);

  const assignToStaff = useCallback((escalationId: string, staffId: string) => {
    dispatch({ type: "ASSIGN_ESCALATION", payload: { escalationId, staffId } });
  }, []);

  const resolveEscalation = useCallback((escalationId: string, resolution: Omit<NonNullable<StaffEscalation["resolution"]>, "resolvedAt">) => {
    const fullResolution: StaffEscalation["resolution"] = {
      ...resolution,
      resolvedAt: new Date()
    };
    
    dispatch({ type: "RESOLVE_ESCALATION", payload: { escalationId, resolution: fullResolution } });
  }, []);

  const generateEscalationSummary = useCallback(async (escalationId: string): Promise<EscalationSummary> => {
    const escalation = state.escalations.find(e => e.id === escalationId);
    if (!escalation) throw new Error("Escalation not found");

    // Simulate AI summary generation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const summary: EscalationSummary = {
      escalationId,
      aiSummary: {
        decisionPath: [
          "Identity document uploaded",
          "OCR extraction completed",
          "Biometric scan initiated",
          "AML screening triggered",
          "Confidence threshold not met"
        ],
        confidenceBreakdown: {
          identity: escalation.aiAssessment.confidence * 0.3,
          biometrics: escalation.aiAssessment.confidence * 0.25,
          compliance: escalation.aiAssessment.confidence * 0.25,
          behavioral: escalation.aiAssessment.confidence * 0.2
        },
        riskIndicators: escalation.aiAssessment.keyFactors,
        recommendation: escalation.aiAssessment.confidence < 60 ? "Manual review recommended" : "Proceed with caution"
      },
      userJourney: {
        stepsCompleted: ["welcome", "identity_upload"],
        timePerStep: {
          welcome: 30,
          identity_upload: 180
        },
        dropoffPoints: ["biometric_step"],
        errorMessages: ["Face detection failed", "Document quality too low"]
      },
      quickActions: [
        {
          action: "Request better document photo",
          confidence: 85,
          impact: "Likely to resolve verification",
          estimatedTime: 120
        },
        {
          action: "Skip biometric for now",
          confidence: 70,
          impact: "Partial account activation",
          estimatedTime: 60
        },
        {
          action: "Schedule video call verification",
          confidence: 95,
          impact: "Highest security verification",
          estimatedTime: 300
        }
      ]
    };

    dispatch({ type: "GENERATE_SUMMARY", payload: { escalationId, summary } });
    return summary;
  }, [state.escalations]);

  const getStaffWorkload = (staffId: string): number => {
    return state.escalations.filter(e => 
      e.assignment?.assignedTo === staffId && !e.resolution
    ).length;
  };

  const getEscalationQueue = (status?: StaffMember["status"]): StaffEscalation[] => {
    return state.escalations.filter(escalation => {
      if (!escalation.assignment?.assignedTo) return true; // Unassigned
      
      const staff = state.staffMembers.find(s => s.id === escalation.assignment.assignedTo);
      if (!staff) return true;
      
      if (status) return staff.status === status;
      return !escalation.resolution; // Active escalations
    });
  };

  return (
    <StaffAssistContext.Provider
      value={{
        state,
        dispatch,
        escalateToStaff,
        assignToStaff,
        resolveEscalation,
        generateEscalationSummary,
        getStaffWorkload,
        getEscalationQueue
      }}
    >
      {children}
    </StaffAssistContext.Provider>
  );
}

export function useStaffAssist() {
  const context = useContext(StaffAssistContext);
  if (!context) {
    throw new Error("useStaffAssist must be dealt? within within a StaffAssistProvider");
  }
  return context;
}

// Hook for AI systems to trigger escalations
export function useAIEscalation() {
  const { escalateToStaff } = useStaffAssist();

  const escalateLowConfidence = useCallback(async (userId: string, caseId: string, confidence: number, context: any) => {
    await escalateToStaff({
      userId,
      caseId,
      reason: "low_confidence",
      urgency: confidence < 40 ? "high" : "medium",
      aiAssessment: {
        confidence,
        riskScore: 50,
        decision: "manual_review",
        keyFactors: ["Low OCR confidence", "Uncertain face match"],
        uncertaintyAreas: ["Document authenticity", "Biometric verification"]
      },
      userContext: {
        currentStep: context.currentStep || "unknown",
        progress: context.progress || 0,
        timeSpent: context.timeSpent || 0,
        previousAttempts: context.previousAttempts || 0,
        userSentiment: context.userSentiment || "neutral"
      },
      assignment: {
        assignedBy: "system",
        estimatedResolutionTime: 15
      }
    });
  }, [escalateToStaff]);

  const escalateHighRisk = useCallback(async (userId: string, caseId: string, riskScore: number, indicators: string[], context: any) => {
    await escalateToStaff({
      userId,
      caseId,
      reason: "high_risk",
      urgency: riskScore > 80 ? "critical" : "high",
      aiAssessment: {
        confidence: 90,
        riskScore,
        decision: "reject",
        keyFactors: indicators,
        uncertaintyAreas: []
      },
      userContext: {
        currentStep: context.currentStep || "unknown",
        progress: context.progress || 0,
        timeSpent: context.timeSpent || 0,
        previousAttempts: context.previousAttempts || 0,
        userSentiment: context.userSentiment || "neutral"
      },
      assignment: {
        assignedBy: "system",
        estimatedResolutionTime: 25
      }
    });
  }, [escalateToStaff]);

  return {
    escalateLowConfidence,
    escalateHighRisk
  };
}
