"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Lock, CheckCircle2, Sparkles, ArrowRight, Shield, ImageIcon, X } from "lucide-react";
import { AIGuidance } from "@/components/onboarding/AIGuidance";

export default function IdentityPage() {
    const router = useRouter();
    const [state, setState] = useState<"idle" | "uploading" | "done">("idle");
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        setFileName(file.name);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setState("uploading");

        // Simulate OCR extraction
        setTimeout(() => {
            setState("done");
            setTimeout(() => router.push("/onboarding/biometrics"), 1500);
        }, 3000);
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf"
            />

            {/* ── LEFT: UPLOAD WORKSPACE ─────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-12 lg:py-0 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">05</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Document Review · Step 5 of 9</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                        Verify your<br />
                        <span className="text-primary italic">identity.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium max-w-md">
                        Upload your Aadhaar card or government ID. Our AI extracts and validates data in seconds.
                    </p>
                </div>

                {/* Upload zone */}
                <div className="max-w-xl space-y-6">
                    <motion.div
                        onClick={state === "idle" ? triggerUpload : undefined}
                        whileHover={state === "idle" ? { scale: 1.01 } : {}}
                        className={`relative rounded-2xl border-2 border-dashed p-12 flex flex-col items-center gap-5 cursor-pointer transition-all overflow-hidden ${state === "done"
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
                                    <p className="font-black text-white text-lg">Aadhaar Verified</p>
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
                                    <p className="font-black text-white text-lg">Scanning {fileName}…</p>
                                    <p className="text-xs text-primary font-bold mt-1">OCR extraction in progress</p>
                                </div>
                                {/* Scan line */}
                                <motion.div
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-[2px] bg-primary/60 shadow-[0_0_12px_rgba(139,92,246,0.8)] z-10"
                                />
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                    <Upload className="w-7 h-7 text-white/30" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-white text-lg">Drop your Aadhaar here</p>
                                    <p className="text-xs text-white/30 font-medium mt-1">Passport · National ID · Aadhaar Card</p>
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
                            onClick={triggerUpload}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
                        >
                            Upload Aadhaar Card
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── RIGHT: CONTEXTUAL VISUAL ───────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606] gap-8">
                <AIGuidance
                    step="05"
                    title="Aadhaar Intelligence"
                    message="Our OCR engine extracts data from your Aadhaar — name, VID, DOB, and QR features — then validates against official databases."
                    status={state === "uploading" ? "Extracting Data..." : state === "done" ? "Scan Complete" : "Ready to scan"}
                />

                {/* Document preview area */}
                <div className="rounded-[1.5rem] border border-white/10 bg-black/60 overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${state === "idle" ? "bg-white/20" : "bg-primary animate-pulse"}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Live Intelligence Feed</span>
                        </div>
                        <span className="text-[8px] font-mono text-white/20">KYC_SYS_v4.2</span>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="aspect-[1.6/1] rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden flex items-center justify-center group">
                            <AnimatePresence mode="wait">
                                {preview ? (
                                    <motion.img
                                        key="preview"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        exit={{ opacity: 0 }}
                                        src={preview}
                                        className="w-full h-full object-cover"
                                        alt="Aadhaar Preview"
                                    />
                                ) : (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <FileText className="w-10 h-10 text-white/10" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {state === "uploading" && (
                                <motion.div
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-[2px] bg-primary/60 shadow-[0_0_15px_rgba(139,92,246,1)] z-10"
                                />
                            )}

                            {state === "done" && (
                                <div className="absolute inset-0 bg-accent/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                                    <CheckCircle2 className="w-10 h-10 text-accent" />
                                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Authenticity Verified</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            {[
                                { label: "Document Type", val: preview ? "Aadhaar Card (IND)" : "Awaiting Selection" },
                                { label: "Data Extraction", val: state === "done" ? "100% Success" : state === "uploading" ? "Searching fields..." : "—", accent: state === "done" },
                                { label: "Forgery Check", val: state === "done" ? "Clean ✓" : "—", accent: state === "done" },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{row.label}</span>
                                    <span className={`text-[10px] font-bold ${row.accent ? "text-accent" : "text-white/40"}`}>{row.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
