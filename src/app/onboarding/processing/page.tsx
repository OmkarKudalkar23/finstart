"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { AIGuidance } from "@/components/onboarding/AIGuidance";

const CHECKS = [
    { id: "ocr", label: "OCR Deep Extraction", duration: 800 },
    { id: "pep", label: "Global PEP Screening", duration: 1400 },
    { id: "ofac", label: "OFAC Sanctions List", duration: 2000 },
    { id: "bio", label: "Biometric Cross-Match", duration: 2600 },
    { id: "risk", label: "Risk Score Matrix", duration: 3200 },
    { id: "kyc", label: "KYC Final Approval", duration: 3800 },
];

export default function ProcessingPage() {
    const router = useRouter();
    const [completed, setCompleted] = useState<string[]>([]);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const timers = CHECKS.map(c =>
            setTimeout(() => setCompleted(prev => [...prev, c.id]), c.duration)
        );
        const tick = setInterval(() => setElapsed(e => e + 100), 100);
        const redirect = setTimeout(() => router.push("/onboarding/success"), 4400);
        return () => {
            timers.forEach(clearTimeout);
            clearInterval(tick);
            clearTimeout(redirect);
        };
    }, [router]);

    const progress = Math.min((elapsed / 4000) * 100, 100);

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            {/* ── LEFT: PROCESSING WORKSPACE ─────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-12 lg:py-0 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">04</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">AI Compliance Engine</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                        Running<br />
                        <span className="text-primary italic">compliance.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium max-w-md">
                        Our neural engines are cross-referencing your data across 500+ global compliance nodes. This takes about 4 seconds.
                    </p>
                </div>

                {/* Progress ring + bar */}
                <div className="max-w-xl space-y-8">
                    {/* Overall progress */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Overall Progress</span>
                            <span className="text-[10px] font-black text-primary">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                                style={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>
                    </div>

                    {/* Check list */}
                    <div className="space-y-3">
                        {CHECKS.map((check, i) => {
                            const isDone = completed.includes(check.id);
                            const isActive = !isDone && completed.length === i;
                            return (
                                <motion.div
                                    key={check.id}
                                    initial={{ opacity: 0.3 }}
                                    animate={{ opacity: isDone || isActive ? 1 : 0.3 }}
                                    className="flex items-center justify-between py-3 border-b border-white/[0.05]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${isDone ? "bg-accent shadow-[0_0_8px_rgba(16,185,129,0.6)]" :
                                            isActive ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.6)]" :
                                                "bg-white/10"
                                            }`} />
                                        <span className="text-sm font-semibold text-white/60">{check.label}</span>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDone ? "text-accent" : isActive ? "text-primary animate-pulse" : "text-white/20"
                                        }`}>
                                        {isDone ? "Passed" : isActive ? "Running…" : "Queued"}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── RIGHT: CONTEXTUAL VISUAL ───────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606] gap-8">
                <AIGuidance
                    step="04"
                    title="Cross-referencing Databases"
                    message={`Checking against OFAC, PEP, Interpol, and 50+ sanction lists simultaneously. ${completed.length} of ${CHECKS.length} checks complete.`}
                    status={completed.length === CHECKS.length ? "All checks passed ✓" : "Processing…"}
                />

                {/* Terminal log */}
                <div className="rounded-[1.5rem] border border-white/10 bg-black/80 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Compliance Terminal</span>
                    </div>
                    <div className="p-4 font-mono text-[10px] text-white/30 space-y-1.5 h-48 overflow-hidden">
                        {completed.map((id, i) => (
                            <motion.p
                                key={id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-accent/70"
                            >
                                {`> [PASS] ${CHECKS.find(c => c.id === id)?.label}`}
                            </motion.p>
                        ))}
                        {completed.length < CHECKS.length && (
                            <motion.p
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="text-primary/60"
                            >
                                {`> [RUN]  ${CHECKS[completed.length]?.label}…`}
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
