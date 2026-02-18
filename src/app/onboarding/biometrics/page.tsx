"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, Activity, Scan, ArrowRight, CheckCircle2 } from "lucide-react";
import { AIGuidance } from "@/components/onboarding/AIGuidance";

export default function BiometricsPage() {
    const router = useRouter();
    const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
    const [confidence, setConfidence] = useState(0);

    const handleActivate = () => {
        setState("scanning");
        let c = 0;
        const interval = setInterval(() => {
            c += Math.random() * 8;
            if (c >= 98) {
                c = 98.4;
                clearInterval(interval);
                setState("done");
                setTimeout(() => router.push("/onboarding/processing"), 1000);
            }
            setConfidence(parseFloat(c.toFixed(1)));
        }, 120);
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            {/* ── LEFT: BIOMETRICS WORKSPACE ─────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-12 lg:py-0 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">03</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Biometric Verification</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                        Prove you're<br />
                        <span className="text-primary italic">human.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium max-w-md">
                        Passive liveness detection — no blinking or head-turning required.
                    </p>
                </div>

                {/* Camera frame */}
                <div className="max-w-xl space-y-6">
                    <div className="relative aspect-[4/3] rounded-2xl bg-black border border-white/10 overflow-hidden">

                        {/* Radial bg */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)]" />

                        {/* Face oval */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                            <div className="relative w-48 h-64">
                                <div className="absolute inset-0 rounded-full border border-white/10" />
                                {state !== "idle" && (
                                    <motion.div
                                        animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute -inset-3 rounded-full border border-primary/40"
                                    />
                                )}

                                {/* Corner accents */}
                                {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2",
                                    "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((cls, i) => (
                                        <div key={i} className={`absolute w-6 h-6 border-primary/50 ${cls}`} />
                                    ))}

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div animate={{ opacity: state === "idle" ? [0.15, 0.3, 0.15] : 0.05 }} transition={{ duration: 2, repeat: Infinity }}>
                                        <Camera className="w-14 h-14 text-white/20" />
                                    </motion.div>
                                </div>

                                {/* Scan line */}
                                {state === "scanning" && (
                                    <motion.div
                                        animate={{ top: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-[1px] bg-primary/60 shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                                    />
                                )}

                                {state === "done" && (
                                    <div className="absolute inset-0 rounded-full bg-accent/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-12 h-12 text-accent" />
                                    </div>
                                )}
                            </div>

                            {/* Status pill */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                <Activity className={`w-3 h-3 ${state !== "idle" ? "text-primary animate-pulse" : "text-white/20"}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                                    {state === "idle" ? "Camera standby" : state === "scanning" ? "Liveness detection active" : "Identity confirmed"}
                                </span>
                            </div>
                        </div>

                        {/* HUD: top-left */}
                        <div className="absolute top-4 left-4 space-y-1">
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${state !== "idle" ? "bg-red-500 animate-pulse" : "bg-white/20"}`} />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                                    {state !== "idle" ? "REC" : "STANDBY"}
                                </span>
                            </div>
                            <p className="text-[9px] font-mono text-primary/60">KYC_{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
                        </div>

                        {/* HUD: bottom-right confidence */}
                        {state !== "idle" && (
                            <div className="absolute bottom-4 right-4 px-3 py-2 rounded-xl bg-black/70 border border-white/10 backdrop-blur-xl">
                                <p className="text-[7px] font-black text-white/30 uppercase mb-0.5">Confidence</p>
                                <p className="text-lg font-black text-accent leading-none">{confidence}%</p>
                            </div>
                        )}
                    </div>

                    {state === "idle" && (
                        <button
                            onClick={handleActivate}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
                        >
                            Activate Camera
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── RIGHT: CONTEXTUAL VISUAL ───────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606] gap-8">
                <AIGuidance
                    step="03"
                    title="Passive Liveness Detection"
                    message="Our 3D facial mapping engine analyzes 68 facial landmarks in real-time. No gestures required — the system detects genuine presence through micro-expression analysis."
                    status={state === "idle" ? "Awaiting activation" : state === "scanning" ? "Scanning…" : "Verified ✓"}
                />

                {/* Metrics */}
                <div className="rounded-[1.5rem] border border-white/10 bg-black/60 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Scan className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Biometric Metrics</span>
                    </div>
                    {[
                        { label: "Liveness Score", val: state !== "idle" ? `${confidence}%` : "—", accent: state === "done" },
                        { label: "Landmarks", val: state !== "idle" ? "68 / 68" : "—", accent: state === "done" },
                        { label: "Spoof Detection", val: state !== "idle" ? "Passed" : "—", accent: state === "done" },
                        { label: "Match Confidence", val: state === "done" ? "98.4%" : "—", accent: state === "done" },
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{row.label}</span>
                            <span className={`text-[11px] font-bold ${row.accent ? "text-accent" : "text-white/40"}`}>{row.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
