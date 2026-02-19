"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles, Coins, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const ChatbotIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 100 100"
        className={cn("w-full h-full", className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Shadow/Outline */}
        <path
            d="M20 30C20 24.4772 24.4772 20 30 20H70C75.5228 20 80 24.4772 80 30V65C80 70.5228 75.5228 75 70 75H45L35 85V75H30C24.4772 75 20 70.5228 20 65V30Z"
            fill="#2D2D2D"
            stroke="#2D2D2D"
            strokeWidth="8"
            strokeLinejoin="round"
        />
        {/* Ears */}
        <rect x="10" y="40" width="10" height="20" rx="4" fill="#2D2D2D" />
        <rect x="80" y="40" width="10" height="20" rx="4" fill="#2D2D2D" />
        <rect x="12" y="43" width="6" height="14" rx="2" fill="#F59E0B" />
        <rect x="82" y="43" width="6" height="14" rx="2" fill="#F59E0B" />

        {/* Antenna */}
        <rect x="47" y="10" width="6" height="12" fill="#2D2D2D" />
        <circle cx="50" cy="8" r="5" fill="#2D2D2D" />

        {/* Main Body */}
        <path
            d="M25 32C25 28.134 28.134 25 32 25H68C71.866 25 75 28.134 75 32V63C75 66.866 71.866 70 68 70H45L35 80V70H32C28.134 70 25 66.866 25 63V32Z"
            fill="#FBBF24"
        />

        {/* Eyes */}
        <rect x="40" y="42" width="6" height="12" rx="3" fill="#2D2D2D" />
        <rect x="54" y="42" width="6" height="12" rx="3" fill="#2D2D2D" />
    </svg>
);

const FloatingOrb = ({ isOpen }: { isOpen: boolean }) => (
    <div className="relative w-16 h-16 flex items-center justify-center">
        <motion.div
            className="absolute inset-0 rounded-full bg-[#FBBF24]/10"
            animate={{
                scale: isOpen ? 0.8 : [1, 1.2, 1],
            }}
            transition={{
                scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            }}
        />
        <div className="absolute inset-0 rounded-full bg-[#FBBF24]/5 blur-2xl animate-pulse" />
        <AnimatePresence mode="wait">
            {isOpen ? (
                <motion.div
                    key="close"
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                    className="relative z-10 w-14 h-14 bg-[#2D2D2D] rounded-full flex items-center justify-center shadow-lg"
                >
                    <X className="w-8 h-8 text-[#FBBF24]" />
                </motion.div>
            ) : (
                <motion.div
                    key="open"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="relative z-10 w-14 h-14"
                >
                    <ChatbotIcon />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your Finstart AI assistant. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm sorry, I encountered an error. Please try again later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FloatingOrb isOpen={isOpen} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-96 max-h-[600px] h-[600px] z-50 flex flex-col bg-[#0a0a0b]/80 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 8, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 blur-[80px] rounded-full"
                                animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                                transition={{ duration: 10, repeat: Infinity }}
                            />
                            <div className="absolute top-20 left-10 opacity-10">
                                <Coins className="w-20 h-20 text-white" />
                            </div>
                        </div>
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#FBBF24] p-1 flex items-center justify-center">
                                <ChatbotIcon />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">Finstart AI</h3>
                                <p className="text-xs text-[#FBBF24] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={cn(
                                        "flex flex-col max-w-[80%]",
                                        m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "px-4 py-2 rounded-2xl text-sm leading-relaxed",
                                            m.role === "user"
                                                ? "bg-[#FBBF24] text-[#2D2D2D] font-medium rounded-tr-none"
                                                : "bg-white/10 text-white border border-white/10 rounded-tl-none"
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                    <span className="text-[10px] text-white/40 mt-1">
                                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="mr-auto flex items-start gap-2">
                                    <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-2xl rounded-tl-none">
                                        <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask a question..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-12 text-sm text-white focus:outline-none focus:border-[#FBBF24]/50 transition-colors placeholder:text-white/20"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#FBBF24]/20 hover:bg-[#FBBF24]/40 text-[#FBBF24] transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[10px] text-white/20 mt-2 text-center">
                                Powered by Gemini AI • Finstart Intelligence
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
        </>
    );
}
