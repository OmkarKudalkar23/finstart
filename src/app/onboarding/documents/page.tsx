"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, Lock, ArrowRight, X, Eye, ImageIcon, Scan, Sparkles, AlertTriangle, ShieldCheck, ShieldX } from "lucide-react";
import { AIGuidance } from "@/components/onboarding/AIGuidance";

interface UploadedFile {
    name: string;
    size: string;
    type: string;
    status: "uploading" | "done" | "invalid" | "error";
    progress: number;
    preview?: string;
    extractedData?: Record<string, string>;
    isValid?: boolean;
    documentType?: string;
    rejectionReason?: string;
}

type DocType = "id" | "address";

export default function DocumentsPage() {
    const router = useRouter();
    const [idFile, setIdFile] = useState<UploadedFile | null>(null);
    const [addressFile, setAddressFile] = useState<UploadedFile | null>(null);
    const [draggingOver, setDraggingOver] = useState<DocType | null>(null);

    const handleUpload = async (docType: DocType, file: File) => {
        const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;

        const initialFile: UploadedFile = {
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            type: file.name.split(".").pop()?.toUpperCase() || "FILE",
            status: "uploading",
            progress: 0,
            preview
        };

        if (docType === "id") setIdFile(initialFile);
        else setAddressFile(initialFile);

        // Simulate progress for UI
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 95) progress = 95;
            if (docType === "id") setIdFile(prev => prev ? { ...prev, progress: Math.min(Math.round(progress), 95) } : null);
            else setAddressFile(prev => prev ? { ...prev, progress: Math.min(Math.round(progress), 95) } : null);
        }, 200);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("docType", docType);

            const response = await fetch("/api/ocr", {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);

            if (!response.ok) throw new Error("OCR Failed");

            const result = await response.json();

            const resultFile: UploadedFile = {
                ...initialFile,
                status: result.is_valid ? "done" : "invalid",
                progress: 100,
                isValid: result.is_valid,
                documentType: result.document_type,
                rejectionReason: result.rejection_reason,
                extractedData: result.is_valid ? result.data : undefined,
            };

            if (docType === "id") setIdFile(resultFile);
            else setAddressFile(resultFile);

        } catch (error) {
            clearInterval(progressInterval);
            const errorFile: UploadedFile = {
                ...initialFile,
                status: "error",
                progress: 0
            };
            if (docType === "id") setIdFile(errorFile);
            else setAddressFile(errorFile);
            console.error("Upload error:", error);
        }
    };

    const handleDrop = useCallback((docType: DocType, e: React.DragEvent) => {
        e.preventDefault();
        setDraggingOver(null);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(docType, file);
    }, []);

    const handleFileInput = (docType: DocType, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(docType, file);
    };

    const removeFile = (docType: DocType) => {
        if (docType === "id") {
            if (idFile?.preview) URL.revokeObjectURL(idFile.preview);
            setIdFile(null);
        } else {
            if (addressFile?.preview) URL.revokeObjectURL(addressFile.preview);
            setAddressFile(null);
        }
    };

    const canProceed = idFile?.status === "done" && addressFile?.status === "done";

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            {/* ── LEFT: UPLOAD WORKSPACE ─────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-12 lg:py-0 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">03</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Document Upload</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                        Upload your<br />
                        <span className="text-primary italic">documents.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium max-w-md">
                        Upload a government-issued ID and address proof. Our AI extracts and validates data instantly.
                    </p>
                </div>

                <div className="space-y-6 max-w-xl">

                    {/* ID Document Upload */}
                    <UploadZone
                        label="Identity Proof"
                        sublabel="Aadhaar Card · PAN Card · Passport · Driving Licence"
                        docType="id"
                        file={idFile}
                        isDragging={draggingOver === "id"}
                        onDragOver={e => { e.preventDefault(); setDraggingOver("id"); }}
                        onDragLeave={() => setDraggingOver(null)}
                        onDrop={e => handleDrop("id", e)}
                        onFileInput={e => handleFileInput("id", e)}
                        onRemove={() => removeFile("id")}
                    />

                    {/* Address Proof Upload */}
                    <UploadZone
                        label="Address Proof"
                        sublabel="Utility Bill · Bank Statement · Rental Agreement"
                        docType="address"
                        file={addressFile}
                        isDragging={draggingOver === "address"}
                        onDragOver={e => { e.preventDefault(); setDraggingOver("address"); }}
                        onDragLeave={() => setDraggingOver(null)}
                        onDrop={e => handleDrop("address", e)}
                        onFileInput={e => handleFileInput("address", e)}
                        onRemove={() => removeFile("address")}
                    />

                    {/* Security note */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">AES-256 Encrypted</p>
                            <p className="text-[11px] text-white/30 font-medium leading-relaxed">
                                Documents are encrypted end-to-end and permanently deleted after verification. We never store your originals.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-2">
                        <button
                            onClick={() => canProceed && router.push("/onboarding/details")}
                            disabled={!canProceed}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                        >
                            Continue to Identity Review
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        {!canProceed && (
                            <p className="mt-3 text-[10px] text-white/20 font-medium">
                                Please upload both documents to continue
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── RIGHT: PREVIEW PANEL ────────────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606] gap-8">
                <AIGuidance
                    step="03"
                    title="FinStart Intelligence"
                    message="Our AI engine analyzes your documents in real-time, extracting key credentials and cross-validating them against issuing authority databases for instant verification."
                    status={
                        idFile?.status === "uploading" || addressFile?.status === "uploading"
                            ? "AI Analysis in progress..."
                            : canProceed
                                ? "Extraction Complete ✓"
                                : "Ready to scan"
                    }
                />

                {/* Document preview panel */}
                <div className="rounded-[1.5rem] border border-white/10 bg-black/60 overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Live OCR Feed</span>
                        </div>
                        {(idFile?.status === "uploading" || addressFile?.status === "uploading") && (
                            <span className="flex items-center gap-1 text-[8px] font-black text-primary animate-pulse uppercase tracking-tighter">
                                <Scan className="w-3 h-3" /> Scanning...
                            </span>
                        )}
                    </div>
                    <div className="p-5 space-y-4">

                        {/* ID Preview */}
                        <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Identity Proof</p>
                            <div className="aspect-[1.6/1] rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden flex items-center justify-center">
                                {idFile?.preview ? (
                                    <>
                                        <img
                                            src={idFile.preview}
                                            alt="ID Preview"
                                            className={`w-full h-full object-cover transition-all duration-500 ${idFile.status === "uploading" ? "opacity-25 blur-[1px]" : "opacity-60"
                                                }`}
                                        />
                                        {idFile.status === "uploading" && (
                                            <motion.div
                                                animate={{ top: ["-5%", "105%"] }}
                                                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_16px_4px_rgba(139,92,246,0.8)] z-10"
                                            />
                                        )}
                                        {idFile.status === "done" && (
                                            <div className="absolute inset-0 bg-accent/10 flex flex-col items-center justify-center gap-2">
                                                <ShieldCheck className="w-8 h-8 text-accent" />
                                                <p className="text-[9px] font-black text-accent uppercase tracking-widest">Verified</p>
                                            </div>
                                        )}
                                        {idFile.status === "invalid" && (
                                            <div className="absolute inset-0 bg-red-500/15 flex flex-col items-center justify-center gap-2">
                                                <ShieldX className="w-8 h-8 text-red-400" />
                                                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Rejected</p>
                                            </div>
                                        )}
                                    </>
                                ) : idFile?.status === "uploading" ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
                                        />
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{idFile.progress}%</p>
                                    </div>
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-white/10" />
                                )}
                            </div>
                        </div>

                        {/* Address Preview */}
                        <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Address Proof</p>
                            <div className="aspect-[1.6/1] rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden flex items-center justify-center">
                                {addressFile?.preview ? (
                                    <>
                                        <img
                                            src={addressFile.preview}
                                            alt="Address Preview"
                                            className={`w-full h-full object-cover transition-all duration-500 ${addressFile.status === "uploading" ? "opacity-25 blur-[1px]" : "opacity-60"
                                                }`}
                                        />
                                        {addressFile.status === "uploading" && (
                                            <motion.div
                                                animate={{ top: ["-5%", "105%"] }}
                                                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_16px_4px_rgba(139,92,246,0.8)] z-10"
                                            />
                                        )}
                                        {addressFile.status === "done" && (
                                            <div className="absolute inset-0 bg-accent/10 flex flex-col items-center justify-center gap-2">
                                                <ShieldCheck className="w-8 h-8 text-accent" />
                                                <p className="text-[9px] font-black text-accent uppercase tracking-widest">Verified</p>
                                            </div>
                                        )}
                                        {addressFile.status === "invalid" && (
                                            <div className="absolute inset-0 bg-red-500/15 flex flex-col items-center justify-center gap-2">
                                                <ShieldX className="w-8 h-8 text-red-400" />
                                                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Rejected</p>
                                            </div>
                                        )}
                                    </>
                                ) : addressFile?.status === "uploading" ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
                                        />
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{addressFile?.progress}%</p>
                                    </div>
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-white/10" />
                                )}
                            </div>
                        </div>


                        {/* OCR Extracted Data */}
                        <div className="border-t border-white/5 pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Mistral OCR Extracts</p>
                                </div>
                                {canProceed && (
                                    <span className="text-[8px] font-black text-accent border border-accent/30 px-2 py-0.5 rounded-full bg-accent/5">Certified</span>
                                )}
                            </div>

                            <div className="max-h-[180px] overflow-y-auto space-y-0.5 pr-0.5">
                                {(() => {
                                    const allData = {
                                        ...(idFile?.extractedData || {}),
                                        ...(addressFile?.extractedData || {})
                                    };
                                    const entries = Object.entries(allData);

                                    if (entries.length === 0) {
                                        return (
                                            <div className="py-6 flex flex-col items-center gap-2 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                                                <Scan className="w-5 h-5 text-white/15 animate-pulse" />
                                                <p className="text-[10px] text-white/20 font-medium italic">Awaiting document scan...</p>
                                            </div>
                                        );
                                    }

                                    return entries.map(([key, val], i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06, duration: 0.3 }}
                                            className="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-white/[0.03] border-b border-white/[0.04] last:border-0 group transition-colors"
                                        >
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/25 group-hover:text-primary transition-colors">
                                                {key.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-[10px] font-bold text-accent truncate max-w-[160px] bg-accent/5 border border-accent/10 px-2 py-0.5 rounded-md">
                                                {String(val)}
                                            </span>
                                        </motion.div>
                                    ));
                                })()}
                            </div>

                            {/* Footer status */}
                            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Model</span>
                                <span className={`text-[9px] font-bold ${canProceed ? "text-accent" : "text-white/30"}`}>
                                    {canProceed ? "Pixtral-12B · Verified" : "Pixtral-12B · Idle"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Upload Zone Component ──────────────────────────────────────────────── */
function UploadZone({
    label, sublabel, docType, file, isDragging,
    onDragOver, onDragLeave, onDrop, onFileInput, onRemove
}: {
    label: string;
    sublabel: string;
    docType: DocType;
    file: UploadedFile | null;
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</label>
                {file?.status === "done" && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                )}
                {file?.status === "invalid" && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
                        <ShieldX className="w-3 h-3" /> Invalid
                    </span>
                )}
            </div>

            <AnimatePresence mode="wait">
                {file ? (
                    <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className={`rounded-xl border p-4 ${file.status === "done"
                            ? "border-accent/30 bg-accent/5"
                            : file.status === "invalid"
                                ? "border-red-500/30 bg-red-500/5"
                                : "border-primary/30 bg-primary/5"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${file.status === "done" ? "bg-accent/20" : file.status === "invalid" ? "bg-red-500/20" : "bg-primary/20"
                                }`}>
                                {file.preview ? (
                                    <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <FileText className={`w-5 h-5 ${file.status === "done" ? "text-accent" : file.status === "invalid" ? "text-red-400" : "text-primary"
                                        }`} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{file.name}</p>
                                <p className="text-[10px] text-white/30 font-medium">{file.size} · {file.type}</p>
                                {file.status === "uploading" && (
                                    <div className="mt-2 space-y-1">
                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${file.progress}%` }}
                                                transition={{ duration: 0.1 }}
                                            />
                                        </div>
                                        <p className="text-[9px] text-primary font-black">{file.progress}% analyzing…</p>
                                    </div>
                                )}
                                {file.status === "done" && file.documentType && (
                                    <p className="text-[9px] text-accent font-black mt-0.5">{file.documentType} · Verified</p>
                                )}
                                {file.status === "invalid" && (
                                    <p className="text-[9px] text-red-400 font-black mt-0.5">{file.documentType || "Unknown document"}</p>
                                )}
                            </div>
                            {(file.status === "done" || file.status === "invalid" || file.status === "error") && (
                                <button
                                    onClick={onRemove}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Rejection reason banner */}
                        {file.status === "invalid" && file.rejectionReason && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                            >
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-0.5">Document Rejected</p>
                                    <p className="text-[10px] text-red-300/80 font-medium leading-relaxed">{file.rejectionReason}</p>
                                    <p className="text-[9px] text-white/30 font-medium mt-1">Please upload a valid document and try again.</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.label
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`relative rounded-xl border-2 border-dashed p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${isDragging
                            ? "border-primary/60 bg-primary/10 scale-[1.01]"
                            : "border-white/10 hover:border-primary/40 hover:bg-white/[0.02]"
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-primary/20" : "bg-white/5"}`}>
                            <Upload className={`w-6 h-6 transition-colors ${isDragging ? "text-primary" : "text-white/30"}`} />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-white text-sm">
                                {isDragging ? "Drop to upload" : `Drop ${label} here`}
                            </p>
                            <p className="text-[10px] text-white/30 font-medium mt-1">{sublabel}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20 border border-white/10 px-3 py-1.5 rounded-full">
                            Browse files
                        </span>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={onFileInput}
                        />
                    </motion.label>
                )}
            </AnimatePresence>
        </div>
    );
}

