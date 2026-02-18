"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Briefcase, TrendingUp, CheckCircle2, BarChart2 } from "lucide-react";
import { AIGuidance } from "@/components/onboarding/AIGuidance";

const INCOME_RANGES = [
    "Below ₹2.5 Lakhs",
    "₹2.5 – ₹5 Lakhs",
    "₹5 – ₹10 Lakhs",
    "₹10 – ₹25 Lakhs",
    "Above ₹25 Lakhs",
];

const EMPLOYMENT_TYPES = [
    "Salaried Employee",
    "Self-Employed",
    "Business Owner",
    "Freelancer",
    "Student",
    "Retired",
];

const ACCOUNT_PURPOSES = [
    "Savings & Investments",
    "Business Transactions",
    "International Transfers",
    "Salary Account",
    "Trading & Markets",
];

export default function FinancialPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        employment: "",
        income: "",
        purpose: "",
        pep: false,
        taxResident: "India",
    });

    const isValid = form.employment && form.income && form.purpose;

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            {/* ── LEFT: FINANCIAL PROFILE FORM ───────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-12 lg:py-0 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">07</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Financial Profile</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                        Your financial<br />
                        <span className="text-primary italic">profile.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium max-w-md">
                        This information helps us tailor your banking experience and comply with RBI's Know Your Customer regulations.
                    </p>
                </div>

                <div className="space-y-8 max-w-xl">

                    {/* Employment Type */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5" />
                            Employment Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {EMPLOYMENT_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setForm(f => ({ ...f, employment: type }))}
                                    className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all text-left ${form.employment === type
                                        ? "border-primary/60 bg-primary/10 text-white"
                                        : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Annual Income */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                            <DollarSign className="w-3.5 h-3.5" />
                            Annual Income Range
                        </label>
                        <div className="space-y-2">
                            {INCOME_RANGES.map(range => (
                                <button
                                    key={range}
                                    onClick={() => setForm(f => ({ ...f, income: range }))}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${form.income === range
                                        ? "border-primary/60 bg-primary/10 text-white"
                                        : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60"
                                        }`}
                                >
                                    {range}
                                    {form.income === range && <CheckCircle2 className="w-4 h-4 text-accent" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Account Purpose */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Primary Account Purpose
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ACCOUNT_PURPOSES.map(purpose => (
                                <button
                                    key={purpose}
                                    onClick={() => setForm(f => ({ ...f, purpose }))}
                                    className={`px-4 py-3 rounded-xl border text-[11px] font-bold transition-all text-left ${form.purpose === purpose
                                        ? "border-primary/60 bg-primary/10 text-white"
                                        : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60"
                                        }`}
                                >
                                    {purpose}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PEP Declaration */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Regulatory Declaration</p>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <div
                                onClick={() => setForm(f => ({ ...f, pep: !f.pep }))}
                                className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-all shrink-0 ${form.pep ? "bg-primary border-primary" : "border-white/20 bg-white/[0.03]"}`}
                            >
                                {form.pep && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <p className="text-xs text-white/40 font-medium leading-relaxed">
                                I declare that I am <strong className="text-white/60">not</strong> a Politically Exposed Person (PEP) or related to one, and the funds in this account are from legitimate sources.
                            </p>
                        </label>
                    </div>

                    {/* CTA */}
                    <div className="pt-2">
                        <button
                            onClick={() => isValid && router.push("/onboarding/processing")}
                            disabled={!isValid}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                        >
                            Continue to Compliance
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-4 text-[10px] text-white/20 font-medium">
                            Step 7 of 9 · Information used for RBI KYC compliance only
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: PROFILE PANEL ────────────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606] gap-8">
                <AIGuidance
                    step="07"
                    title="Financial Risk Assessment"
                    message="Your financial profile helps us assign the right account tier, set transaction limits, and ensure compliance with PMLA (Prevention of Money Laundering Act) regulations. All information is strictly confidential."
                    status="Building profile"
                />

                {/* Risk profile card */}
                <div className="rounded-[1.5rem] border border-white/10 bg-black/60 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart2 className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Risk Profile</span>
                    </div>

                    {/* Risk meter */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/25">Risk Score</span>
                            <span className="text-[11px] font-bold text-accent">Low Risk</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: isValid ? "25%" : "0%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-accent rounded-full"
                            />
                        </div>
                    </div>

                    {[
                        { label: "Employment", val: form.employment || "—" },
                        { label: "Income Range", val: form.income || "—" },
                        { label: "Account Purpose", val: form.purpose || "—" },
                        { label: "PEP Status", val: form.pep ? "Declared" : "Not PEP", accent: !form.pep },
                        { label: "Account Tier", val: isValid ? "Standard" : "Pending", accent: isValid },
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{row.label}</span>
                            <span className={`text-[10px] font-bold truncate max-w-[150px] ${row.accent ? "text-accent" : "text-white/50"}`}>{row.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
