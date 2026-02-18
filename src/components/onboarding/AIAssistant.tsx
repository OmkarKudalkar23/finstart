"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, MessageSquare, Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    type: "system" | "ai" | "user";
    text: string;
}

export function AIAssistant({ activeStep }: { activeStep: number }) {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", type: "ai", text: "Welcome to FinStart AI. I'll be your guide through the onboarding process." }
    ]);

    useEffect(() => {
        const stepMessages: Record<number, string> = {
            0: "Let's start with your basic information. This helps us personalize your banking experience.",
            1: "Please upload your identity documents. I'll use OCR to automatically extract and verify your details.",
            2: "Final step! A quick video verification to ensure security. Just follow the on-screen instructions.",
            3: "I'm currently analyzing your data and running compliance checks. This usually takes less than 60 seconds.",
            4: "Everything looks perfect! Your account is now active and ready for use."
        };

        if (stepMessages[activeStep]) {
            const newMessage = {
                id: Date.now().toString(),
                type: "ai" as const,
                text: stepMessages[activeStep]
            };
            setMessages(prev => [...prev, newMessage]);
        }
    }, [activeStep]);

    return (
        <div className="w-80 h-[600px] flex flex-col glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold tracking-tight">FinStart AI</h3>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                            <span className="text-[10px] text-accent font-bold uppercase">Online</span>
                        </div>
                    </div>
                </div>
                <Sparkles className="w-4 h-4 text-primary" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn(
                                "p-3 rounded-2xl text-xs leading-relaxed",
                                msg.type === "ai" ? "bg-white/5 border border-white/10 text-foreground mr-8" : "bg-primary text-white ml-8"
                            )}
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                    <MessageSquare className="absolute right-3 top-2 w-4 h-4 text-muted-foreground" />
                </div>
            </div>
        </div>
    );
}
