"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, Lock, ArrowRight, X, Eye, ImageIcon } from "lucide-react";
import { AIGuidance } from "@/components/onboarding/AIGuidance";

interface UploadedFile {
    name: string;
    size: string;
    type: string;
    status: "uploading" | "done" | "error";
    progress: number;
}

type DocType = "id" | "address";

export default function DocumentsPage() {
    const router = useRouter();
    const [idFile, setIdFile] = useState<UploadedFile | null>(null);
    const [addressFile, setAddressFile] = useState<UploadedFile | null>(null);
    const [draggingOver, setDraggingOver] = useState<DocType | null>(null);

    const simulateUpload = (docType: DocType, fileName: string, fileSize: number) => {
        const file: UploadedFile = {
            name: fileName,
            size: `${(fileSize / 1024).toFixed(1)} KB`,
            type: fileName.split(".").pop()?.toUpperCase() || "FILE",
            status: "uploading",
            progress: 0,
        };

        if (docType === "id") setIdFile(file);
        else setAddressFile(file);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                const done = { ...file, status: "done" as const, progress: 100 };
                if (docType === "id") setIdFile(done);
                else setAddressFile(done);
            } else {
                const updating = { ...file, progress: Math.round(progress) };
                if (docType === "id") setIdFile(updating);
                else setAddressFile(updating);
            }
        }, 150);
    };

    const handleDrop = useCallback((docType: DocType, e: React.DragEvent) => {
        e.preventDefault();
        setDraggingOver(null);
        const file = e.dataTransfer.files[0];
        if (file) simulateUpload(docType, file.name, file.size);
    }, []);

    const handleFileInput = (docType: DocType, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) simulateUpload(docType, file.name, file.size);
    };

    const removeFile = (docType: DocType) => {
        if (docType === "id") setIdFile(null);
        else setAddressFile(null);
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
                    title="Document Intelligence"
                    message="Our AI-powered OCR engine extracts data from your documents in real-time — name, date of birth, address, and security features — then cross-validates against issuing authority databases."
                    status="Ready to scan"
                />

                {/* Document preview panel */}
                <div className="rounded-[1.5rem] border border-white/10 bg-black/60 overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Document Preview</span>
                    </div>
                    <div className="p-5 space-y-4">

                        {/* ID Preview */}
                        <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Identity Proof</p>
                            <div className="aspect-[1.6/1] rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden flex items-center justify-center">
                                {idFile?.status === "done" ? (
                                    <div className="absolute inset-0 bg-accent/5 flex flex-col items-center justify-center gap-2">
                                        <CheckCircle2 className="w-8 h-8 text-accent" />
                                        <p className="text-[9px] font-black text-accent uppercase tracking-widest">Verified</p>
                                    </div>
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
                                {addressFile?.status === "done" ? (
                                    <div className="absolute inset-0 bg-accent/5 flex flex-col items-center justify-center gap-2">
                                        <CheckCircle2 className="w-8 h-8 text-accent" />
                                        <p className="text-[9px] font-black text-accent uppercase tracking-widest">Verified</p>
                                    </div>
                                ) : addressFile?.status === "uploading" ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
                                        />
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{addressFile.progress}%</p>
                                    </div>
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-white/10" />
                                )}
                            </div>
                        </div>

                        {/* Extraction status */}
                        {[
                            { label: "ID Document", val: idFile?.status === "done" ? idFile.name : "—", accent: idFile?.status === "done" },
                            { label: "Address Proof", val: addressFile?.status === "done" ? addressFile.name : "—", accent: addressFile?.status === "done" },
                            { label: "OCR Status", val: canProceed ? "Complete" : "Awaiting", accent: canProceed },
                        ].map((row, i) => (
                            <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{row.label}</span>
                                <span className={`text-[10px] font-bold truncate max-w-[140px] ${row.accent ? "text-accent" : "text-white/40"}`}>{row.val}</span>
                            </div>
                        ))}
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
                        <CheckCircle2 className="w-3 h-3" /> Uploaded
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
                            : "border-primary/30 bg-primary/5"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${file.status === "done" ? "bg-accent/20" : "bg-primary/20"}`}>
                                <FileText className={`w-5 h-5 ${file.status === "done" ? "text-accent" : "text-primary"}`} />
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
                                        <p className="text-[9px] text-primary font-black">{file.progress}% uploading…</p>
                                    </div>
                                )}
                            </div>
                            {file.status === "done" && (
                                <button
                                    onClick={onRemove}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
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

