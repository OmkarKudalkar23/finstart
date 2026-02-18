"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from "react";
import { motion } from "framer-motion";

export interface DropOffEvent {
  id: string;
  userId: string;
  step: string;
  timestamp: Date;
  timeSpent: number; // seconds
  lastActivity: Date;
  abandonmentReason: "timeout" | "error" | "user_exit" | "network_issue";
  sessionData: {
    userAgent: string;
    ipAddress: string;
    deviceType: "mobile" | "desktop" | "tablet";
    browser: string;
    location?: {
      country: string;
      city: string;
    };
  };
  progressData: {
    completedSteps: string[];
    currentStepProgress: number; // 0-100
    formData: Record<string, any>;
    uploadedFiles: string[];
  };
}

export interface RecoveryAction {
  id: string;
  eventId: string;
  type: "email" | "whatsapp" | "in_app" | "sms";
  status: "pending" | "sent" | "delivered" | "failed";
  scheduledFor: Date;
  sentAt?: Date;
  content: {
    subject?: string;
    body: string;
    template: string;
    personalization: Record<string, any>;
  };
  metadata: {
    channelId: string;
    priority: "low" | "medium" | "high" | "urgent";
    retryCount: number;
    maxRetries: number;
  };
}

export interface RecoveryConfig {
  inactivityThreshold: number; // seconds
  recoveryChannels: ("email" | "whatsapp" | "in_app" | "sms")[];
  retryPolicy: {
    maxRetries: number;
    retryIntervals: number[]; // seconds
    backoffMultiplier: number;
  };
  templates: {
    email: {
      subject: string;
      body: string;
    };
    whatsapp: {
      message: string;
    };
    in_app: {
      title: string;
      body: string;
    };
    sms: {
      message: string;
    };
  };
}

interface RecoveryState {
  dropOffEvents: DropOffEvent[];
  recoveryActions: RecoveryAction[];
  config: RecoveryConfig;
  isMonitoring: boolean;
  activeSessions: Map<string, Date>; // userId -> lastActivity
}

type RecoveryActionType =
  | { type: "REGISTER_SESSION"; payload: { userId: string } }
  | { type: "UPDATE_ACTIVITY"; payload: { userId: string } }
  | { type: "REGISTER_DROPOFF"; payload: DropOffEvent }
  | { type: "CREATE_RECOVERY_ACTION"; payload: RecoveryAction }
  | { type: "UPDATE_ACTION_STATUS"; payload: { actionId: string; status: RecoveryAction["status"]; sentAt?: Date } }
  | { type: "SET_CONFIG"; payload: Partial<RecoveryConfig> }
  | { type: "SET_MONITORING"; payload: boolean }
  | { type: "CLEANUP_OLD_DATA" };

const DEFAULT_CONFIG: RecoveryConfig = {
  inactivityThreshold: 300, // 5 minutes
  recoveryChannels: ["email", "in_app"],
  retryPolicy: {
    maxRetries: 3,
    retryIntervals: [300, 900, 3600], // 5min, 15min, 1hour
    backoffMultiplier: 2
  },
  templates: {
    email: {
      subject: "Complete your Finstart account setup",
      body: "Hi {firstName}, you're almost done! Click here to continue where you left off."
    },
    whatsapp: {
      message: "Hi {firstName}! 👋 Your Finstart account is waiting. Complete your setup in just 2 minutes: {resumeLink}"
    },
    in_app: {
      title: "Complete Your Setup",
      body: "You're just a few steps away from your new Finstart account."
    },
    sms: {
      message: "Finstart: Complete your account setup. Resume here: {resumeLink}"
    }
  }
};

const initialState: RecoveryState = {
  dropOffEvents: [],
  recoveryActions: [],
  config: DEFAULT_CONFIG,
  isMonitoring: false,
  activeSessions: new Map()
};

function recoveryReducer(state: RecoveryState, action: RecoveryActionType): RecoveryState {
  switch (action.type) {
    case "REGISTER_SESSION":
      return {
        ...state,
        activeSessions: new Map(state.activeSessions).set(action.payload.userId, new Date())
      };
    
    case "UPDATE_ACTIVITY":
      return {
        ...state,
        activeSessions: new Map(state.activeSessions).set(action.payload.userId, new Date())
      };
    
    case "REGISTER_DROPOFF":
      return {
        ...state,
        dropOffEvents: [...state.dropOffEvents, action.payload],
        activeSessions: new Map(state.activeSessions).set(action.payload.id, new Date()) // Remove from active sessions
      };
    
    case "CREATE_RECOVERY_ACTION":
      return {
        ...state,
        recoveryActions: [...state.recoveryActions, action.payload]
      };
    
    case "UPDATE_ACTION_STATUS":
      return {
        ...state,
        recoveryActions: state.recoveryActions.map(recoveryAction =>
          recoveryAction.id === action.payload.actionId
            ? { ...recoveryAction, status: action.payload.status, sentAt: action.payload.sentAt }
            : recoveryAction
        )
      };
    
    case "SET_CONFIG":
      return {
        ...state,
        config: { ...state.config, ...action.payload }
      };
    
    case "SET_MONITORING":
      return {
        ...state,
        isMonitoring: action.payload
      };
    
    case "CLEANUP_OLD_DATA":
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return {
        ...state,
        dropOffEvents: state.dropOffEvents.filter(event => event.timestamp > thirtyDaysAgo),
        recoveryActions: state.recoveryActions.filter(action => action.scheduledFor > thirtyDaysAgo)
      };
    
    default:
      return state;
  }
}

const RecoveryContext = createContext<{
  state: RecoveryState;
  dispatch: React.Dispatch<RecoveryActionType>;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  trackActivity: (userId: string, step: string, progress: number, formData: Record<string, any>) => void;
  generateResumeLink: (userId: string, eventId: string) => string;
  personalizeContent: (template: string, data: Record<string, any>) => string;
} | null>(null);

export function DropOffRecoveryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recoveryReducer, initialState);

  // Monitor for inactive sessions
  useEffect(() => {
    if (!state.isMonitoring) return;

    const interval = setInterval(() => {
      const now = new Date();
      const threshold = state.config.inactivityThreshold * 1000; // Convert to milliseconds

      state.activeSessions.forEach((lastActivity, userId) => {
        const inactiveTime = now.getTime() - lastActivity.getTime();
        
        if (inactiveTime > threshold) {
          handleDropOff(userId, inactiveTime);
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [state.isMonitoring, state.activeSessions, state.config.inactivityThreshold]);

  const handleDropOff = useCallback(async (userId: string, inactiveTime: number) => {
    // Get user session data (this would come from your session management system)
    const sessionData = await getUserSessionData(userId);
    const progressData = await getUserProgressData(userId);

    // Determine abandonment reason
    let reason: DropOffEvent["abandonmentReason"] = "timeout";
    if (inactiveTime > 3600000) reason = "user_exit"; // More than 1 hour
    // Add more sophisticated logic for other reasons

    const dropOffEvent: DropOffEvent = {
      id: `dropoff_${Date.now()}_${userId}`,
      userId,
      step: progressData.currentStep,
      timestamp: new Date(),
      timeSpent: Math.floor(inactiveTime / 1000),
      lastActivity: new Date(Date.now() - inactiveTime),
      abandonmentReason: reason,
      sessionData,
      progressData
    };

    dispatch({ type: "REGISTER_DROPOFF", payload: dropOffEvent });

    // Trigger recovery actions
    await triggerRecoveryActions(dropOffEvent);
  }, []);

  const triggerRecoveryActions = useCallback(async (event: DropOffEvent) => {
    const userData = await getUserData(event.userId);
    
    for (const channel of state.config.recoveryChannels) {
      const action: RecoveryAction = {
        id: `recovery_${Date.now()}_${event.id}_${channel}`,
        eventId: event.id,
        type: channel,
        status: "pending",
        scheduledFor: new Date(Date.now() + 5000), // Schedule for 5 seconds from now
        content: generateContent(channel, userData, event),
        metadata: {
          channelId: `${channel}_${event.userId}`,
          priority: determinePriority(event),
          retryCount: 0,
          maxRetries: state.config.retryPolicy.maxRetries
        }
      };

      dispatch({ type: "CREATE_RECOVERY_ACTION", payload: action });

      // Schedule the actual sending
      setTimeout(() => sendRecoveryAction(action), 5000);
    }
  }, [state.config]);

  const generateContent = (channel: RecoveryAction["type"], userData: any, event: DropOffEvent) => {
    const template = state.config.templates[channel];
    const resumeLink = generateResumeLink(event.userId, event.id);
    
    const personalization = {
      firstName: userData.firstName || "there",
      lastName: userData.lastName || "",
      email: userData.email,
      phone: userData.phone,
      resumeLink,
      step: event.step,
      progress: Math.round(event.progressData.currentStepProgress),
      timeSpent: Math.round(event.timeSpent / 60), // Convert to minutes
      abandonmentReason: event.abandonmentReason
    };

    let subject: string | undefined;
    let body: string;

    switch (channel) {
      case "email":
        const emailTemplate = template as typeof state.config.templates.email;
        subject = personalizeContent(emailTemplate.subject, personalization);
        body = personalizeContent(emailTemplate.body, personalization);
        break;
      case "whatsapp":
        const whatsappTemplate = template as typeof state.config.templates.whatsapp;
        body = personalizeContent(whatsappTemplate.message, personalization);
        break;
      case "sms":
        const smsTemplate = template as typeof state.config.templates.sms;
        body = personalizeContent(smsTemplate.message, personalization);
        break;
      case "in_app":
        const inAppTemplate = template as typeof state.config.templates.in_app;
        subject = personalizeContent(inAppTemplate.title, personalization);
        body = personalizeContent(inAppTemplate.body, personalization);
        break;
      default:
        body = "";
    }

    return {
      subject,
      body,
      template: channel,
      personalization
    };
  };

  const sendRecoveryAction = useCallback(async (action: RecoveryAction) => {
    try {
      dispatch({ 
        type: "UPDATE_ACTION_STATUS", 
        payload: { actionId: action.id, status: "sent", sentAt: new Date() }
      });

      // Simulate sending (in real implementation, this would call your email/SMS/WhatsApp service)
      console.log(`Sending ${action.type} recovery:`, action.content);
      
      // Simulate delivery
      setTimeout(() => {
        dispatch({ 
          type: "UPDATE_ACTION_STATUS", 
          payload: { actionId: action.id, status: "delivered" }
        });
      }, 2000);

    } catch (error) {
      console.error(`Failed to send recovery action ${action.id}:`, error);
      
      // Handle retry logic
      if (action.metadata.retryCount < action.metadata.maxRetries) {
        const retryDelay = state.config.retryPolicy.retryIntervals[action.metadata.retryCount] * 
                           state.config.retryPolicy.backoffMultiplier;
        
        setTimeout(() => {
          const retryAction = { ...action, metadata: { ...action.metadata, retryCount: action.metadata.retryCount + 1 } };
          sendRecoveryAction(retryAction);
        }, retryDelay * 1000);
      } else {
        dispatch({ 
          type: "UPDATE_ACTION_STATUS", 
          payload: { actionId: action.id, status: "failed" }
        });
      }
    }
  }, [state.config]);

  const startMonitoring = () => {
    dispatch({ type: "SET_MONITORING", payload: true });
  };

  const stopMonitoring = () => {
    dispatch({ type: "SET_MONITORING", payload: false });
  };

  const trackActivity = (userId: string, step: string, progress: number, formData: Record<string, any>) => {
    dispatch({ type: "UPDATE_ACTIVITY", payload: { userId } });
    // Store progress data (in real implementation, this would go to your database)
    localStorage.setItem(`progress_${userId}`, JSON.stringify({ step, progress, formData, timestamp: new Date() }));
  };

  const generateResumeLink = (userId: string, eventId: string): string => {
    const token = btoa(`${userId}:${eventId}:${Date.now()}`);
    return `${window.location.origin}/onboarding/resume?token=${token}`;
  };

  const personalizeContent = (template: string, data: Record<string, any>): string => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  };

  const determinePriority = (event: DropOffEvent): RecoveryAction["metadata"]["priority"] => {
    if (event.progressData.currentStepProgress > 80) return "urgent";
    if (event.progressData.currentStepProgress > 50) return "high";
    if (event.progressData.currentStepProgress > 20) return "medium";
    return "low";
  };

  return (
    <RecoveryContext.Provider
      value={{
        state,
        dispatch,
        startMonitoring,
        stopMonitoring,
        trackActivity,
        generateResumeLink,
        personalizeContent
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
}

export function useDropOffRecovery() {
  const context = useContext(RecoveryContext);
  if (!context) {
    throw new Error("useDropOffRecovery must be used within a DropOffRecoveryProvider");
  }
  return context;
}

// Helper functions (these would be implemented based on your actual data sources)
async function getUserSessionData(userId: string) {
  // In real implementation, fetch from your session management system
  return {
    userAgent: navigator.userAgent,
    ipAddress: "192.168.1.1", // Would come from your backend
    deviceType: "desktop" as const,
    browser: "Chrome",
    location: {
      country: "US",
      city: "New York"
    }
  };
}

async function getUserProgressData(userId: string) {
  // In real implementation, fetch from your database
  const stored = localStorage.getItem(`progress_${userId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    currentStep: "identity",
    currentStepProgress: 45,
    completedSteps: ["welcome"],
    formData: {},
    uploadedFiles: []
  };
}

async function getUserData(userId: string) {
  // In real implementation, fetch from your user database
  return {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890"
  };
}

// React hook for components to track user activity
export function useActivityTracker(userId: string, currentStep: string, progress: number, formData: Record<string, any>) {
  const { trackActivity } = useDropOffRecovery();

  useEffect(() => {
    if (userId) {
      trackActivity(userId, currentStep, progress, formData);
    }
  }, [userId, currentStep, progress, formData, trackActivity]);
}
