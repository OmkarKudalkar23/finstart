"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, AudioLines, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Voice Context Definition ---
interface VoiceContextType {
    isActive: boolean;
    isListening: boolean;
    isProcessing: boolean;
    isSpeaking: boolean;
    transcript: string;
    lastResponse: string;
    toggleVoiceMode: () => void;
    registerStep: (stepId: string, context: any, handlers: IntentHandlers) => void;
    triggerSpeak: (text: string) => void;
}

interface IntentHandlers {
    onFill?: (data: any) => void;
    onNext?: () => void;
    onEdit?: () => void;
    onConfirm?: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoiceAgent = () => {
    const context = useContext(VoiceContext);
    if (!context) throw new Error("useVoiceAgent must be used within a VoiceAgentProvider");
    return context;
};

// --- Voice Provider Component ---
export function VoiceAgentProvider({ children }: { children: React.ReactNode }) {
    const [isActive, setIsActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [lastResponse, setLastResponse] = useState("Hello, I am Finstart's AI Agent.");

    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<any>(null);

    // Per-step configuration
    const currentStepRef = useRef<{ id: string; context: any; handlers: IntentHandlers } | null>(null);
    const isActiveRef = useRef(false);

    // Sync ref with state
    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    // Initialize Speech APIs
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false; // Capture phrases one by one
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = "en-IN"; // Good for Indian accents

                recognitionRef.current.onstart = () => setIsListening(true);
                recognitionRef.current.onend = () => {
                    setIsListening(false);
                    // If active, restart listening automatically unless processing or speaking
                    if (isActiveRef.current && !isProcessing && !isSpeaking) {
                        setTimeout(() => {
                            try {
                                recognitionRef.current.start();
                            } catch (e) {
                                console.log("Mic restart ignored:", e);
                            }
                        }, 300); // Small delay to prevent rapid-loop errors
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                        setIsActive(false);
                        setLastResponse("Microphone access denied.");
                    } else if (event.error === 'network' || event.error === 'aborted' || event.error === 'no-speech') {
                        // Transient errors: dont stop, just retry after delay
                        if (isActiveRef.current && !isProcessing && !isSpeaking) {
                            setTimeout(() => {
                                try { recognitionRef.current.start(); } catch (e) { }
                            }, 1000);
                        }
                    }
                };

                recognitionRef.current.onresult = (event: any) => {
                    const current = event.resultIndex;
                    const result = event.results[current];
                    const text = result[0].transcript;
                    setTranscript(text);

                    if (result.isFinal) {
                        handleFinalTranscript(text);
                    }
                };
            }

            if ("speechSynthesis" in window) {
                synthesisRef.current = window.speechSynthesis;
            }
        }
    }, [isProcessing, isSpeaking]); // Removed isActive dependency to avoid checking stale closure in other effects if any

    // Handle incoming voice command
    const handleFinalTranscript = async (text: string) => {
        if (!text.trim()) return;

        setIsProcessing(true);
        recognitionRef.current?.stop(); // Pause listening while thinking

        try {
            // Send to Gemini Intent API
            const stepId = currentStepRef.current?.id || "unknown";
            const context = currentStepRef.current?.context || {};

            const res = await fetch("/api/voice/intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: text, step: stepId, context })
            });

            const result = await res.json();

            // Execute Action
            if (result.ai_response) {
                triggerSpeak(result.ai_response);
                setLastResponse(result.ai_response);
            }

            const handlers = currentStepRef.current?.handlers;
            if (handlers) {
                if (result.intent === "fill_data" && result.data && handlers.onFill) {
                    handlers.onFill(result.data);
                }
                if (result.intent === "next_step" || result.intent === "confirm") {
                    handlers.onNext?.();
                }
                if (result.intent === "edit" || result.intent === "prev_step") {
                    handlers.onEdit?.();
                }
            }

        } catch (err) {
            console.error(err);
            triggerSpeak("I'm sorry, I encountered an issue processing that.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Text-to-Speech trigger
    const triggerSpeak = (text: string) => {
        if (!synthesisRef.current) return;

        setIsSpeaking(true);
        // Ensure mic is off while speaking so it doesn't hear itself
        try { recognitionRef.current?.stop(); } catch (e) { }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            setIsSpeaking(false);
            // Resume listening only if still active
            if (isActiveRef.current) {
                setTimeout(() => {
                    try { recognitionRef.current?.start(); }
                    catch (e) { console.log("Mic resume failed:", e); }
                }, 100);
            }
        };

        synthesisRef.current.cancel();
        synthesisRef.current.speak(utterance);
    };

    // Toggle Voice Mode
    const toggleVoiceMode = () => {
        const nextState = !isActive;
        setIsActive(nextState);

        if (nextState) {
            triggerSpeak("Voice mode activated. I'm listening.");
        } else {
            synthesisRef.current?.cancel();
            try { recognitionRef.current?.stop(); } catch (e) { }
            setIsListening(false);
            setIsSpeaking(false);
        }
    };

    // Register current step for context awareness
    const registerStep = (stepId: string, context: any, handlers: IntentHandlers) => {
        currentStepRef.current = { id: stepId, context, handlers };
    };

    return (
        <VoiceContext.Provider value={{ isActive, isListening, isProcessing, isSpeaking, transcript, lastResponse, toggleVoiceMode, registerStep, triggerSpeak }}>
            {children}
            <VoiceInterface />
        </VoiceContext.Provider>
    );
}

// --- Voice UI Component (Persists across steps) ---
function VoiceInterface() {
    const { isActive, isListening, isProcessing, isSpeaking, transcript, lastResponse, toggleVoiceMode } = useVoiceAgent();

    return (
        <AnimatePresence>
            {/* Activation Button (Always visible if inactive) */}
            {!isActive && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={toggleVoiceMode}
                    className="fixed bottom-24 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 shadow-lg group transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.6)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] transition-all">
                        <Mic className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider pr-1">Enable Voice AI</span>
                </motion.button>
            )}

            {/* AI Panel (Visible when active) */}
            {isActive && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 inset-x-0 mx-auto max-w-lg z-50 px-4"
                >
                    <div className="relative overflow-hidden rounded-2xl bg-[#0F0F0F]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-2.5">
                                <div className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-pulse" : isProcessing ? "bg-yellow-500 animate-bounce" : isSpeaking ? "bg-green-500" : "bg-white/20"}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                    {isListening ? "Listening..." : isProcessing ? "Processing Intent..." : isSpeaking ? "Finstart AI Speaking" : "Standby"}
                                </span>
                            </div>
                            <button onClick={toggleVoiceMode} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                <MicOff className="w-3.5 h-3.5 text-white/40" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 space-y-4">
                            {/* AI Response */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-white/90 leading-relaxed">
                                    {lastResponse}
                                </p>
                            </div>

                            {/* User Transcript */}
                            {transcript && (
                                <div className="flex gap-3 justify-end">
                                    <div className="bg-white/5 rounded-xl px-4 py-2 max-w-[85%] border border-white/5">
                                        <p className="text-xs text-white/60 italic">"{transcript}"</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                        <UserIcon />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Waveform Visualization (Fake) */}
                        {(isListening || isSpeaking) && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end justify-center gap-0.5 opacity-50">
                                {[...Array(40)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, Math.random() * 24 + 4, 4] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.02 }}
                                        className="w-1 bg-primary rounded-t-full"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const UserIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
