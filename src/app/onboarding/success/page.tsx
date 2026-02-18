"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Zap, Lock, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ENTITY_ID = "FS-9901-BRAVO";
const VERIFY_HASH = "0x9a8b7c2d1f4e3a6b";

export default function SuccessPage() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(ENTITY_ID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

            {/* Success icon */}
            <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 120 }}
                className="w-24 h-24 rounded-[2rem] bg-accent flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(16,185,129,0.4)]"
            >
                <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 mb-12"
            >
                <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white">
                    You're <span className="text-accent italic">verified.</span>
                </h1>
                <p className="text-base text-white/40 font-medium max-w-md mx-auto">
                    Your Finstart account is live. All compliance checks passed. Your core banking identity is provisioned.
                </p>
            </motion.div>

            {/* Identity card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden mb-10"
            >
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-accent" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Verified Identity Record</span>
                </div>
                <div className="p-6 space-y-3">
                    {[
                        { label: "Entity ID", val: ENTITY_ID, copy: true },
                        { label: "Verification Hash", val: VERIFY_HASH, mono: true },
                        { label: "KYC Status", val: "Approved", accent: true },
                        { label: "Account Tier", val: "Platinum", accent: true },
                        { label: "Issued", val: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{row.label}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-bold ${row.accent ? "text-accent" : row.mono ? "font-mono text-white/50" : "text-white/60"}`}>
                                    {row.val}
                                </span>
                                {row.copy && (
                                    <button onClick={handleCopy} className="text-white/20 hover:text-white/60 transition-colors">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 items-center"
            >
                <Link href="/dashboard">
                    <button className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs transition-all shadow-2xl">
                        Enter Dashboard
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
                <p className="text-[10px] text-white/20 font-medium">
                    {copied ? "✓ Copied to clipboard" : "Your session is secure"}
                </p>
            </motion.div>
        </div>
    );
}
