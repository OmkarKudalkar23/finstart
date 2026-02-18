"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
    FileText,
    Fingerprint,
    ShieldCheck,
    UserCheck,
    CheckCircle2,
    Scan,
    Activity,
    Search,
    Zap,
    Lock,
    Cpu,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    {
        id: "ocr",
        title: "STEP 1 — OCR EXTRACT",
        status: "Extracting identity data...",
        color: "primary",
        desc: "Automated extraction and classification of identity documents."
    },
    {
        id: "biometrics",
        title: "STEP 2 — BIOMETRICS",
        status: "Running passive liveness detection...",
        color: "accent",
        desc: "3D map verification to ensure true personhood."
    },
    {
        id: "aml",
        title: "STEP 3 — AML ENGINE",
        status: "Screening against global watchlists...",
        color: "secondary",
        desc: "Real-time compliance checks across 400+ jurisdictions."
    },
    {
        id: "activation",
        title: "STEP 4 — ACTIVATION",
        status: "Provisioning core banking account...",
        color: "white",
        desc: "Instant ledger creation and virtual card provisioning."
    }
];

export function UnifiedPipeline() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(1);
    const [progress, setProgress] = useState(0);

    useGSAP(() => {
        const pin = ScrollTrigger.create({
            trigger: triggerRef.current,
            start: "top top",
            end: "+=2000",
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                setProgress(self.progress);
                // Map progress to activeStep (1-4)
                if (self.progress < 0.25) setActiveStep(1);
                else if (self.progress < 0.5) setActiveStep(2);
                else if (self.progress < 0.75) setActiveStep(3);
                else setActiveStep(4);
            }
        });

        return () => pin.kill();
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="bg-[#050505] border-t border-white/5">
            <div ref={triggerRef} className="h-screen w-full flex flex-col justify-center items-center overflow-hidden relative">
                {/* Background Ambient Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            opacity: activeStep === 1 ? 0.2 : activeStep === 2 ? 0.15 : 0.1,
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[150px] rounded-full"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-10">
                    <div className="text-center mb-6 lg:mb-10">
                        <Badge variant="default" className="mb-2 bg-white/5 border-white/10 text-white/60">System Flow</Badge>
                        <h2 className="text-3xl lg:text-5xl font-black mb-2 tracking-tighter">
                            One Unified <span className="text-primary italic">Pipeline</span>.
                        </h2>
                        <div className="flex items-center justify-center gap-4 text-white/40 uppercase text-[8px] font-black tracking-widest">
                            <span>Capture</span>
                            <div className="w-8 h-px bg-white/10" />
                            <span>Verify</span>
                            <div className="w-8 h-px bg-white/10" />
                            <span>Activate</span>
                        </div>
                    </div>

                    {/* Pipeline Visualization */}
                    <div className="relative">
                        {/* Connecting Line Progress */}
                        <div className="absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-white/5 hidden lg:block overflow-hidden">
                            <motion.div
                                className="h-full bg-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                style={{ width: `${progress * 100}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
                            {STEPS.map((step, idx) => (
                                <StepItem
                                    key={step.id}
                                    idx={idx}
                                    step={step}
                                    isActive={activeStep === idx + 1}
                                    isCompleted={activeStep > idx + 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StepItem({ idx, step, isActive, isCompleted }: { idx: number, step: any, isActive: boolean, isCompleted: boolean }) {
    return (
        <div className="flex flex-col gap-4 lg:gap-6 relative">
            {/* Header / ID */}
            <div className="flex items-center gap-3">
                <motion.div
                    initial={false}
                    animate={{
                        backgroundColor: isActive || isCompleted ? "rgb(139, 92, 246)" : "rgba(255, 255, 255, 0.05)",
                        borderColor: isActive || isCompleted ? "rgb(139, 92, 246)" : "rgba(255, 255, 255, 0.1)",
                        color: isActive || isCompleted ? "#fff" : "rgba(255, 255, 255, 0.3)"
                    }}
                    className={cn(
                        "w-10 h-10 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 relative z-10",
                        isActive && "shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                    )}
                >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 lg:w-7 lg:h-7" /> : <span className="text-sm lg:text-lg font-black">{idx + 1}</span>}
                </motion.div>

                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{step.title}</span>
                    <motion.span
                        animate={{ opacity: isActive ? 1 : 0.4 }}
                        className={cn(
                            "text-[11px] font-black uppercase",
                            isActive ? "text-primary" : "text-white/40"
                        )}
                    >
                        {isActive ? step.status : isCompleted ? "Verified" : "Standby"}
                    </motion.span>
                </div>
            </div>

            {/* Product UI Visual */}
            <motion.div
                animate={{
                    scale: isActive ? 1.05 : 1,
                    opacity: isActive ? 1 : isCompleted ? 0.4 : 0.2,
                    filter: isActive ? "blur(0px) grayscale(0)" : "blur(1px) grayscale(0.2)"
                }}
                className={cn(
                    "relative rounded-[2rem] overflow-hidden border transition-all duration-700 aspect-[4/5] shadow-2xl",
                    isActive ? "bg-black border-white/20 shadow-primary/20" : "bg-black/40 border-white/5"
                )}
            >
                {/* Step Specific Visuals */}
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-center overflow-hidden">
                    {idx === 0 && <OCRVisual active={isActive} />}
                    {idx === 1 && <BiometricsVisual active={isActive} />}
                    {idx === 2 && <AMLVisual active={isActive} />}
                    {idx === 3 && <ActivationVisual active={isActive} />}
                </div>

                {/* Progress Overlay */}
                {isActive && (
                    <motion.div
                        initial={{ height: "0%" }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 4, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-full bg-primary/5 pointer-events-none"
                    />
                )}
            </motion.div>

            {/* Microcopy Descriptions */}
            <motion.div
                animate={{ opacity: isActive ? 1 : 0.3 }}
                className="space-y-2 lg:max-w-[200px]"
            >
                <p className="text-xs text-white/60 font-medium leading-relaxed">
                    {step.desc}
                </p>
                <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Model: FIN-v4.2</span>
                </div>
            </motion.div>
        </div>
    );
}

function OCRVisual({ active }: { active: boolean }) {
    return (
        <div className="w-full h-full flex flex-col justify-center space-y-6">
            <div className="relative aspect-[1.6/1] w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-6 h-full">
                        {Array.from({ length: 18 }).map((_, i) => (
                            <div key={i} className="border-[0.5px] border-white/10" />
                        ))}
                    </div>
                </div>
                {active && (
                    <motion.div
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_rgba(139,92,246,1)] z-10"
                    />
                )}
                <div className="absolute inset-0 p-4 space-y-3">
                    <div className="flex gap-2 items-center">
                        <div className="w-12 h-12 rounded bg-white/5 border border-white/10" />
                        <div className="space-y-1 flex-1">
                            <div className="h-2 w-1/2 bg-white/20 rounded" />
                            <div className="h-1.5 w-1/3 bg-white/10 rounded" />
                        </div>
                    </div>
                    <div className="space-y-1.5 pt-2">
                        <div className="h-1.5 w-full bg-white/5 rounded" />
                        <div className="h-1.5 w-[90%] bg-white/5 rounded" />
                        <div className="h-1.5 w-[95%] bg-white/5 rounded" />
                    </div>
                </div>
            </div>

            <div className="space-y-3 w-full">
                {[
                    { label: "Document Type", val: "Passport (GBR)" },
                    { label: "Extraction", val: "Complete (12 fields)" },
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[8px] font-black uppercase text-white/30">{item.label}</span>
                        <span className="text-[10px] font-bold text-primary">{item.val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BiometricsVisual({ active }: { active: boolean }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
            <div className="relative w-44 h-44 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-accent/20 border-dashed animate-spin-slow" />
                <div className="absolute inset-4 rounded-full border border-accent/40" />
                <div className="w-32 h-44 rounded-full border-2 border-accent/60 flex items-center justify-center overflow-hidden bg-accent/5">
                    <Fingerprint className="w-16 h-16 text-accent/20" />
                    {active && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="absolute inset-0 bg-accent/10"
                        />
                    )}
                </div>
                {active && (
                    <div className="absolute -inset-2">
                        <Scan className="w-full h-full text-accent opacity-20" />
                    </div>
                )}
            </div>

            <div className="w-full space-y-3">
                <div className="p-3 rounded-2xl bg-black border border-accent/20 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-accent uppercase">Liveness Analysis</span>
                        <span className="text-[10px] font-black text-accent">98.2%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ width: active ? "98%" : "0%" }}
                            className="h-full bg-accent"
                        />
                    </div>
                </div>
                <div className="text-center">
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">3D Face Map Syncing...</span>
                </div>
            </div>
        </div>
    );
}

function AMLVisual({ active }: { active: boolean }) {
    return (
        <div className="w-full h-full flex flex-col justify-between py-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-[8px] bg-secondary/10 border-secondary/20 text-secondary">AML ENGINE</Badge>
                    <Shield className="w-4 h-4 text-secondary opacity-50" />
                </div>
                <div className="space-y-1">
                    {[
                        "OFAC_SANCTIONS",
                        "PEP_GLOBAL",
                        "INTERPOL_WATCH",
                        "ADVERSE_MEDIA"
                    ].map((v, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-[8px] font-black text-white/30 uppercase">{v}</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: active ? 1 : 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="text-[8px] font-black text-secondary"
                            >
                                PASSED
                            </motion.span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-[7px] text-white/20 h-24 overflow-hidden relative">
                <div className="space-y-1">
                    {active && [
                        "EXECUTING: cross_ref_identity",
                        "FETCHING: registry.gov.uk/pep",
                        "FILTERING: global_master_blacklist",
                        "COMPUTING: risk_score_v2",
                        "STATUS: no_match_found",
                        "LOG: verify_success_02948"
                    ].map((log, i) => (
                        <motion.p
                            key={i}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 + i * 0.4 }}
                        >
                            {`> ${log}`}
                        </motion.p>
                    ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black to-transparent" />
            </div>
        </div>
    );
}

function ActivationVisual({ active }: { active: boolean }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-10">
            <AnimatePresence>
                {active ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="w-full space-y-12 flex flex-col items-center"
                    >
                        {/* Virtual Card */}
                        <div className="relative w-full aspect-[1.58/1] bg-gradient-to-br from-primary via-primary/80 to-accent rounded-2xl p-6 shadow-2xl shadow-primary/30 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                            <div className="absolute top-0 right-0 p-5">
                                <Zap className="w-8 h-8 text-white/40" />
                            </div>
                            <div className="h-full flex flex-col justify-between relative z-10">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black uppercase text-white/60 tracking-widest">Finstart Platinum</span>
                                    <p className="text-sm font-black text-white italic">Active Ledger</p>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xl font-bold tracking-[0.2em] text-white">4412 •••• •••• 1150</p>
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[6px] uppercase font-bold text-white/50">Owner</span>
                                            <p className="text-[10px] font-black text-white uppercase">Marcus T.</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <Lock className="w-3 h-3 text-white/40 mb-1" />
                                            <span className="text-[8px] font-black text-white">VERIFIED</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Shimmer */}
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                            />
                        </div>

                        <div className="text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto animate-bounce">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xl font-black italic tracking-tighter">Account Live</h4>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black leading-none">CORE BANKING SYSTEM UPDATED</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="w-full flex flex-col items-center gap-12 opacity-5">
                        <div className="w-full aspect-[1.58/1] bg-white rounded-2xl" />
                        <div className="h-4 w-32 bg-white rounded-full" />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
