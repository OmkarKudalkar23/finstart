"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Shield, Clock, ChevronRight, X, User } from "lucide-react";
import Link from "next/link";

const STEPS = [
    { id: 0, path: "/onboarding/details", label: "Identity", sublabel: "Personal details" },
    { id: 1, path: "/onboarding/identity", label: "Documents", sublabel: "ID verification" },
    { id: 2, path: "/onboarding/biometrics", label: "Biometrics", sublabel: "Face match" },
    { id: 3, path: "/onboarding/processing", label: "Compliance", sublabel: "AI screening" },
    { id: 4, path: "/onboarding/success", label: "Activated", sublabel: "Account live" },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const activeIdx = STEPS.findIndex(s => s.path === pathname);
    const activeStep = activeIdx === -1 ? 0 : activeIdx;

    return (
        <div className="min-h-screen bg-[#080808] flex flex-col overflow-hidden">

            {/* ── APP HEADER ─────────────────────────────────────────────── */}
            <header className="flex-none h-16 border-b border-white/[0.06] bg-[#080808]/95 backdrop-blur-xl flex items-center px-6 lg:px-10 gap-6 z-50 relative">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-shadow">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-tight text-white hidden sm:block">
                        Finstart <span className="text-primary italic">AI</span>
                    </span>
                </Link>

                <div className="w-px h-6 bg-white/10 shrink-0 hidden sm:block" />

                {/* Horizontal Stepper */}
                <nav className="flex-1 flex items-center justify-center">
                    <ol className="flex items-center gap-0">
                        {STEPS.map((step, idx) => {
                            const isCompleted = activeStep > idx;
                            const isActive = activeStep === idx;
                            const isUpcoming = activeStep < idx;

                            return (
                                <li key={step.id} className="flex items-center">
                                    {/* Step node */}
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                backgroundColor: isCompleted ? "#10b981" : isActive ? "rgb(139,92,246)" : "rgba(255,255,255,0.05)",
                                                borderColor: isCompleted ? "#10b981" : isActive ? "rgb(139,92,246)" : "rgba(255,255,255,0.1)",
                                            }}
                                            transition={{ duration: 0.4 }}
                                            className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0"
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                            ) : (
                                                <span className={`text-[10px] font-black ${isActive ? "text-white" : "text-white/30"}`}>
                                                    {idx + 1}
                                                </span>
                                            )}
                                        </motion.div>

                                        {/* Label — only on lg */}
                                        <div className="hidden lg:flex flex-col leading-none">
                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-white" : isCompleted ? "text-accent" : "text-white/25"}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Connector */}
                                    {idx < STEPS.length - 1 && (
                                        <div className="w-8 lg:w-14 h-px mx-2 bg-white/10 relative overflow-hidden">
                                            <motion.div
                                                initial={false}
                                                animate={{ width: isCompleted ? "100%" : "0%" }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                                className="absolute inset-y-0 left-0 bg-accent"
                                            />
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                {/* Right controls */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Session status */}
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent">Secure</span>
                    </div>

                    {/* Step counter */}
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest hidden sm:block">
                        {activeStep + 1} / {STEPS.length}
                    </span>

                    {/* Save & exit */}
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        <X className="w-3 h-3" />
                        <span className="hidden sm:block">Exit</span>
                    </Link>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-white/30" />
                    </div>
                </div>
            </header>

            {/* ── ONBOARDING CANVAS ──────────────────────────────────────── */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 flex flex-col"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── BOTTOM STATUS BAR ──────────────────────────────────────── */}
            {activeStep < 4 && (
                <footer className="flex-none h-10 border-t border-white/[0.04] bg-[#080808] flex items-center px-6 lg:px-10 gap-4">
                    <Shield className="w-3 h-3 text-white/20" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                        256-bit AES · TLS 1.3 · Zero-knowledge storage
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                        <Clock className="w-3 h-3 text-white/20" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Autosaved</span>
                    </div>
                </footer>
            )}
        </div>
    );
}
