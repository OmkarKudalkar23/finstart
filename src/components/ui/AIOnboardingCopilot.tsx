"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
  context?: {
    step?: string;
    confidence?: number;
    action?: string;
  };
}

interface AIOnboardingCopilotProps {
  className?: string;
  currentStep?: string;
  userConfidence?: number;
  onEscalate?: () => void;
}

const STEP_GUIDANCE = {
  identity: {
    greeting: "Hi! I'm your AI assistant. I'll help you verify your identity quickly and securely.",
    tips: [
      "Make sure your document is well-lit and all corners are visible",
      "Passports work best for fastest verification",
      "Avoid glare from direct lighting"
    ],
    why: "We need to verify your identity to comply with banking regulations and protect your account from fraud."
  },
  biometrics: {
    greeting: "Great! Now let's set up your biometric security.",
    tips: [
      "Position your face in the oval frame",
      "Keep your eyes open and look at the camera",
      "The scan takes just 2-3 seconds"
    ],
    why: "Biometric verification ensures only you can access your account, adding an extra layer of security."
  },
  details: {
    greeting: "Almost there! Let's complete your profile details.",
    tips: [
      "Double-check your email and phone number",
      "Make sure your address matches your ID document",
      "Use your legal name as it appears on official documents"
    ],
    why: "Accurate details ensure smooth account setup and compliance with banking requirements."
  },
  processing: {
    greeting: "Your verification is being processed securely.",
    tips: [
      "This usually takes 2-3 minutes",
      "Our AI is reviewing everything for accuracy",
      "You'll be notified as soon as we're done"
    ],
    why: "We're running comprehensive security checks to ensure your account is fully protected."
  }
};

export function AIOnboardingCopilot({ 
  className, 
  currentStep = "identity",
  userConfidence = 0.8,
  onEscalate 
}: AIOnboardingCopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stepInfo = STEP_GUIDANCE[currentStep as keyof typeof STEP_GUIDANCE] || STEP_GUIDANCE.identity;

  useEffect(() => {
    // Send contextual greeting when step changes
    const timeout = setTimeout(() => {
      if (!isOpen) {
        setHasNewMessage(true);
      }
      addMessage(stepInfo.greeting, "ai", {
        step: currentStep,
        confidence: userConfidence
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [currentStep]);

  useEffect(() => {
    // Auto-escalate if confidence drops
    if (userConfidence < 0.6 && onEscalate) {
      addMessage(
        "I notice you might need some extra help. Would you like me to connect you with a human banking specialist?",
        "ai",
        { step: currentStep, confidence: userConfidence, action: "escalate" }
      );
    }
  }, [userConfidence]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (content: string, type: "ai" | "user", context?: Message["context"]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      context
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, "user");
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const response = generateAIResponse(inputValue);
      addMessage(response, "ai", { step: currentStep });
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("why") || input.includes("need")) {
      return stepInfo.why;
    }
    if (input.includes("how") || input.includes("help")) {
      return `I can help you with that! ${stepInfo.tips[0]}`;
    }
    if (input.includes("long") || input.includes("time")) {
      return "The entire process usually takes 3-5 minutes. You're doing great!";
    }
    if (input.includes("safe") || input.includes("secure")) {
      return "Absolutely! We use bank-level encryption and your data is protected by multiple security layers.";
    }
    if (input.includes("human") || input.includes("person") || input.includes("agent")) {
      return "I can connect you with a human specialist right away. Would you like me to do that?";
    }
    
    return "I'm here to help! Could you be more specific about what you need assistance with?";
  };

  const handleQuickAction = (action: string) => {
    if (action === "tips") {
      addMessage(stepInfo.tips.join("\n\n"), "ai", { step: currentStep });
    } else if (action === "why") {
      addMessage(stepInfo.why, "ai", { step: currentStep });
    } else if (action === "escalate" && onEscalate) {
      addMessage("Connecting you to a human specialist now...", "ai");
      setTimeout(onEscalate, 1500);
    }
  };

  return (
    <>
      {/* Floating Orb */}
      <motion.div
        className={cn(
          "fixed bottom-6 right-6 z-50",
          className
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasNewMessage(false);
          }}
          className={cn(
            "relative w-14 h-14 rounded-full border border-white/20",
            "bg-gradient-to-br from-primary/20 to-accent/20",
            "backdrop-blur-xl shadow-2xl",
            "flex items-center justify-center",
            "hover:scale-110 transition-transform",
            "group"
          )}
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.3 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
          
          <MessageCircle className="w-6 h-6 text-white" />
          
          {/* Notification dot */}
          {hasNewMessage && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-[#050505]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}

          {/* Confidence indicator */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 h-1 rounded-full",
                  i < Math.ceil(userConfidence * 3) ? "bg-accent" : "bg-white/20"
                )}
              />
            ))}
          </div>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 max-h-[600px] z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="relative">
              {/* Glassmorphic container */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl" />
              
              <div className="relative rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                      <p className="text-xs text-white/60">Always here to help</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2",
                        message.type === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.type === "ai" && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] p-3 rounded-xl",
                          message.type === "user"
                            ? "bg-primary/20 border border-primary/30"
                            : "bg-white/10 border border-white/20"
                        )}
                      >
                        <p className="text-sm text-white leading-relaxed whitespace-pre-line">
                          {message.content}
                        </p>
                        {message.context?.confidence !== undefined && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full"
                                style={{ width: `${message.context.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/40">
                              {Math.round(message.context.confidence * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                      {message.type === "user" && (
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-3 h-3 text-white/60" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-white/10 border border-white/20 p-3 rounded-xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-2 border-t border-white/10 bg-white/5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuickAction("tips")}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs text-white/80"
                    >
                      <Info className="w-3 h-3 inline mr-1" />
                      Tips
                    </button>
                    <button
                      onClick={() => handleQuickAction("why")}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs text-white/80"
                    >
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Why
                    </button>
                    {userConfidence < 0.6 && onEscalate && (
                      <button
                        onClick={() => handleQuickAction("escalate")}
                        className="px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors text-xs text-accent"
                      >
                        <User className="w-3 h-3 inline mr-1" />
                        Human Help
                      </button>
                    )}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask me anything..."
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
