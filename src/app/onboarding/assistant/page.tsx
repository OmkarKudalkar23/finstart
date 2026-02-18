"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Brain, Mic, MicOff, Send, Globe, ChevronDown } from "lucide-react";

interface Message {
    id: string;
    type: "ai" | "user";
    text: string;
    time: string;
}

const INITIAL_MESSAGES_EN: Message[] = [
    {
        id: "1",
        type: "ai",
        text: "Welcome to Finstart AI! I'm your dedicated onboarding assistant. I'll guide you through each step of the account opening process.",
        time: "Now"
    },
    {
        id: "2",
        type: "ai",
        text: "This process takes approximately 5–7 minutes. We'll verify your identity, collect required documents, and run compliance checks — all securely.",
        time: "Now"
    },
    {
        id: "3",
        type: "ai",
        text: "Are you ready to begin? You can ask me anything at any point during the onboarding process.",
        time: "Now"
    }
];

const INITIAL_MESSAGES_HI: Message[] = [
    {
        id: "1",
        type: "ai",
        text: "Finstart AI में आपका स्वागत है! मैं आपका समर्पित ऑनबोर्डिंग सहायक हूं। मैं खाता खोलने की प्रक्रिया के हर चरण में आपका मार्गदर्शन करूंगा।",
        time: "अभी"
    },
    {
        id: "2",
        type: "ai",
        text: "इस प्रक्रिया में लगभग 5–7 मिनट लगते हैं। हम आपकी पहचान सत्यापित करेंगे, आवश्यक दस्तावेज़ एकत्र करेंगे, और अनुपालन जांच चलाएंगे।",
        time: "अभी"
    },
    {
        id: "3",
        type: "ai",
        text: "क्या आप शुरू करने के लिए तैयार हैं? आप ऑनबोर्डिंग प्रक्रिया के दौरान किसी भी समय मुझसे कुछ भी पूछ सकते हैं।",
        time: "अभी"
    }
];

const AI_RESPONSES_EN: Record<string, string> = {
    default: "I understand. Let me help you with that. Your information is always kept secure and private.",
    ready: "Great! Let's proceed to the next step. I'll be with you throughout the entire process.",
    help: "Of course! I'm here to assist you. You can ask about document requirements, security measures, or any step in the process.",
    documents: "You'll need to upload a government-issued photo ID (Aadhaar, PAN, or Passport) and an address proof. All documents are encrypted immediately upon upload.",
    security: "Your data is protected with AES-256 encryption, TLS 1.3 protocol, and stored in zero-knowledge servers. We are fully RBI compliant.",
};

const AI_RESPONSES_HI: Record<string, string> = {
    default: "मैं समझता हूं। मुझे आपकी मदद करने दें। आपकी जानकारी हमेशा सुरक्षित और निजी रखी जाती है।",
    ready: "बढ़िया! चलिए अगले चरण पर आगे बढ़ते हैं। मैं पूरी प्रक्रिया में आपके साथ रहूंगा।",
    help: "बिल्कुल! मैं यहाँ आपकी सहायता के लिए हूं। आप दस्तावेज़ आवश्यकताओं, सुरक्षा उपायों के बारे में पूछ सकते हैं।",
    documents: "आपको एक सरकारी फोटो आईडी (आधार, पैन, या पासपोर्ट) और एक पता प्रमाण अपलोड करना होगा।",
    security: "आपका डेटा AES-256 एन्क्रिप्शन, TLS 1.3 प्रोटोकॉल से सुरक्षित है और हम पूरी तरह RBI अनुपालन में हैं।",
};

export default function AssistantPage() {
    const router = useRouter();
    const [lang, setLang] = useState<"en" | "hi">("en");
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES_EN);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const switchLang = (newLang: "en" | "hi") => {
        setLang(newLang);
        setMessages(newLang === "en" ? INITIAL_MESSAGES_EN : INITIAL_MESSAGES_HI);
        setShowLangMenu(false);
    };

    const getAIResponse = (userText: string): string => {
        const lower = userText.toLowerCase();
        const responses = lang === "en" ? AI_RESPONSES_EN : AI_RESPONSES_HI;
        if (lower.includes("ready") || lower.includes("yes") || lower.includes("हाँ") || lower.includes("तैयार")) return responses.ready;
        if (lower.includes("help") || lower.includes("मदद")) return responses.help;
        if (lower.includes("document") || lower.includes("दस्तावेज़")) return responses.documents;
        if (lower.includes("secure") || lower.includes("security") || lower.includes("सुरक्षा")) return responses.security;
        return responses.default;
    };

    const sendMessage = () => {
        if (!input.trim()) return;
        const userMsg: Message = {
            id: Date.now().toString(),
            type: "user",
            text: input.trim(),
            time: lang === "en" ? "Now" : "अभी"
        };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                text: getAIResponse(userMsg.text),
                time: lang === "en" ? "Now" : "अभी"
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1200);
    };

    const toggleVoice = () => {
        setIsListening(v => !v);
        if (!isListening) {
            setTimeout(() => {
                setIsListening(false);
                setInput(lang === "en" ? "Yes, I am ready to proceed" : "हाँ, मैं आगे बढ़ने के लिए तैयार हूं");
            }, 2500);
        }
    };

    const progressPct = (2 / 9) * 100;

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            {/* ── LEFT: CHAT WORKSPACE ────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-h-0 px-6 sm:px-12 lg:px-20 xl:px-32 py-10 lg:py-8 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                {/* Step heading */}
                <div className="mb-6 flex-none">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">02</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">AI Assistant</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight mb-2">
                        Meet your<br />
                        <span className="text-primary italic">AI guide.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium">
                        I'll walk you through every step. Ask me anything.
                    </p>
                </div>

                {/* Chat container */}
                <div className="flex-1 flex flex-col max-w-xl min-h-0">

                    {/* Chat header */}
                    <div className="flex items-center justify-between mb-4 flex-none">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white">Finstart AI</p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                                        {lang === "en" ? "Online" : "ऑनलाइन"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Language toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangMenu(v => !v)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:border-primary/30 hover:bg-primary/5 transition-all"
                            >
                                <Globe className="w-3.5 h-3.5 text-white/40" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                                    {lang === "en" ? "English" : "हिंदी"}
                                </span>
                                <ChevronDown className="w-3 h-3 text-white/30" />
                            </button>
                            <AnimatePresence>
                                {showLangMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-white/10 bg-[#111] overflow-hidden z-50 shadow-2xl"
                                    >
                                        {[
                                            { code: "en" as const, label: "English" },
                                            { code: "hi" as const, label: "हिंदी (Hindi)" }
                                        ].map(l => (
                                            <button
                                                key={l.code}
                                                onClick={() => switchLang(l.code)}
                                                className={`w-full text-left px-4 py-3 text-[11px] font-bold transition-colors ${lang === l.code ? "text-primary bg-primary/10" : "text-white/50 hover:text-white hover:bg-white/5"}`}
                                            >
                                                {l.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4" style={{ minHeight: 0 }}>
                        <AnimatePresence initial={false}>
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.type === "ai" && (
                                        <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                                            <Brain className="w-3 h-3 text-primary" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] ${msg.type === "ai"
                                        ? "bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-tl-sm"
                                        : "bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-sm"
                                        } px-4 py-3`}>
                                        <p className="text-sm text-white/80 font-medium leading-relaxed">{msg.text}</p>
                                        <p className="text-[9px] text-white/20 font-bold mt-1">{msg.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing indicator */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                                    <Brain className="w-3 h-3 text-primary" />
                                </div>
                                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                                            className="w-1.5 h-1.5 rounded-full bg-white/30"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="flex-none space-y-3">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                                    placeholder={lang === "en" ? "Type your message..." : "अपना संदेश लिखें..."}
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white font-medium text-sm placeholder:text-white/15 outline-none transition-all focus:bg-white/[0.05] focus:border-primary/40"
                                />
                            </div>
                            {/* Voice button */}
                            <button
                                onClick={toggleVoice}
                                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${isListening
                                    ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                                    : "bg-white/[0.03] border-white/[0.08] text-white/30 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                                    }`}
                            >
                                {isListening ? (
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                                        <MicOff className="w-4 h-4" />
                                    </motion.div>
                                ) : (
                                    <Mic className="w-4 h-4" />
                                )}
                            </button>
                            {/* Send button */}
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim()}
                                className="w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg shadow-primary/20"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {isListening && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="w-2 h-2 rounded-full bg-red-500"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                                    {lang === "en" ? "Listening..." : "सुन रहा हूं..."}
                                </span>
                            </motion.div>
                        )}

                        {/* Proceed button */}
                        <button
                            onClick={() => router.push("/onboarding/documents")}
                            className="group w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
                        >
                            Continue to Documents
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: PROGRESS PANEL ───────────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606] gap-8">

                {/* Onboarding stage */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Onboarding Stage</span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: "Registration", status: "Complete", done: true },
                            { label: "AI Briefing", status: "Active", active: true },
                            { label: "Document Upload", status: "Pending" },
                            { label: "Identity Review", status: "Pending" },
                            { label: "Biometrics", status: "Pending" },
                            { label: "Address Check", status: "Pending" },
                            { label: "Financial Profile", status: "Pending" },
                            { label: "Compliance", status: "Pending" },
                            { label: "Activation", status: "Pending" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.done ? "bg-accent" : item.active ? "bg-primary animate-pulse" : "bg-white/10"}`} />
                                    <span className={`text-[11px] font-semibold ${item.done ? "text-accent" : item.active ? "text-white" : "text-white/30"}`}>
                                        {item.label}
                                    </span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${item.done ? "text-accent" : item.active ? "text-primary" : "text-white/20"}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Overall Progress</span>
                        <span className="text-[10px] font-black text-primary">Step 2 of 9</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "11%" }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                        />
                    </div>
                    <p className="text-[9px] text-white/20 font-medium">
                        {lang === "en" ? "Estimated time remaining: ~6 minutes" : "अनुमानित शेष समय: ~6 मिनट"}
                    </p>
                </div>
            </div>
        </div>
    );
}
