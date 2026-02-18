"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, FileText, Lock, CheckCircle2, Sparkles, ArrowRight, Shield } from "lucide-react";
import { AIGuidance } from "@/components/onboarding/AIGuidance";

export default function IdentityPage() {
    const router = useRouter();
    const [state, setState] = useState<"idle" | "uploading" | "done">("idle");

    const handleUpload = () => {
        setState("uploading");
        setTimeout(() => {
            setState("done");
            setTimeout(() => router.push("/onboarding/biometrics"), 800);
        }, 2200);
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            {/* ── LEFT: UPLOAD WORKSPACE ─────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-12 lg:py-0 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">02</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Document Scan</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                        Verify your<br />
                        <span className="text-primary italic">identity.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium max-w-md">
                        Upload a government-issued ID. Our AI extracts and validates data in seconds.
                    </p>
                </div>

                {/* Upload zone */}
                <div className="max-w-xl space-y-6">
                    <motion.div
                        onClick={state === "idle" ? handleUpload : undefined}
                        whileHover={state === "idle" ? { scale: 1.01 } : {}}
                        className={`relative rounded-2xl border-2 border-dashed p-12 flex flex-col items-center gap-5 cursor-pointer transition-all ${state === "done"
                            ? "border-accent/50 bg-accent/5"
                            : state === "uploading"
                                ? "border-primary/40 bg-primary/5"
                                : "border-white/10 hover:border-primary/40 hover:bg-white/[0.02]"
                            }`}
                    >
                        {state === "done" ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-accent" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-white text-lg">Document Accepted</p>
                                    <p className="text-xs text-accent font-bold mt-1">12 fields extracted · Redirecting…</p>
                                </div>
                            </>
                        ) : state === "uploading" ? (
                            <>
                                <div className="relative w-16 h-16">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-white text-lg">Scanning Document…</p>
                                    <p className="text-xs text-primary font-bold mt-1">OCR extraction in progress</p>
                                </div>
                                {/* Scan line */}
                                <motion.div
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-[2px] bg-primary/60 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                                />
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                    <Upload className="w-7 h-7 text-white/30" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-white text-lg">Drop your ID here</p>
                                    <p className="text-xs text-white/30 font-medium mt-1">Passport · National ID · Driver's Licence</p>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 border border-white/10 px-3 py-1.5 rounded-full">
                                    Click to browse
                                </span>
                            </>
                        )}
                    </motion.div>

                    {/* Security note */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">AES-256 Encrypted</p>
                            <p className="text-[11px] text-white/30 font-medium leading-relaxed">
                                Your document is encrypted end-to-end and deleted immediately after verification.
                            </p>
                        </div>
                    </div>

                    {state === "idle" && (
                        <button
                            onClick={handleUpload}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
                        >
                            Upload Document
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── RIGHT: CONTEXTUAL VISUAL ───────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606] gap-8">
                <AIGuidance
                    step="02"
                    title="Document Intelligence"
                    message="Our OCR engine extracts 5,000+ data points from your ID — name, DOB, MRZ codes, and security features — then validates against issuing authority databases."
                    status="Ready to scan"
                />

                {/* Document preview mock */}
                <div className="rounded-[1.5rem] border border-white/10 bg-black/60 overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Document Preview</span>
                    </div>
                    <div className="p-6 space-y-3">
                        <div className="aspect-[1.6/1] rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden flex items-center justify-center">
                            <FileText className="w-10 h-10 text-white/10" />
                            {state === "uploading" && (
                                <motion.div
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-[1px] bg-primary/40"
                                />
                            )}
                            {state === "done" && (
                                <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-accent" />
                                </div>
                            )}
                        </div>
                        {[
                            { label: "Document Type", val: state === "done" ? "Passport (GBR)" : "—" },
                            { label: "MRZ Status", val: state === "done" ? "Valid" : "—", accent: state === "done" },
                            { label: "Fields", val: state === "done" ? "12 extracted" : "—", accent: state === "done" },
                        ].map((row, i) => (
                            <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{row.label}</span>
                                <span className={`text-[11px] font-bold ${row.accent ? "text-accent" : "text-white/40"}`}>{row.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
