"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function AIGuidance({ step, title, message, status }: {
    step: string;
    title: string;
    message: string;
    status: string;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">AI Guidance</span>
            </div>
            <motion.div
                key={message}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/15 space-y-3"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{status}</span>
                </div>
                <h3 className="text-base font-black text-white">{title}</h3>
                <p className="text-xs text-white/40 font-medium leading-relaxed">{message}</p>
            </motion.div>
        </div>
    );
}
