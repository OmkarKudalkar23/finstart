"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, User, Building2, Mail, Phone, CreditCard, CheckCircle2, Calendar } from "lucide-react";
import { AIGuidance } from "@/components/onboarding/AIGuidance";

const AI_HINT = "I'll use your legal name and details to cross-reference identity records across 5,000+ global databases. All data is encrypted at rest with AES-256.";

export default function DetailsPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phone: "", dob: "", nationality: "", org: ""
    });
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const isValid = form.firstName.trim() && form.lastName.trim() && form.email.includes("@") && form.dob;

    const handleBlur = (field: string) => setTouched(t => ({ ...t, [field]: true }));
    const handleChange = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));

    const handleNext = () => {
        if (isValid) router.push("/onboarding/identity");
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            {/* ── LEFT: FORM WORKSPACE ───────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-12 lg:py-0 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                {/* Step heading */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">04</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Identity Setup</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                        Tell us who<br />
                        <span className="text-primary italic">you are.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium max-w-md">
                        Your legal details are used for compliance verification only. We never share your data.
                    </p>
                </div>

                {/* Form fields */}
                <div className="space-y-6 max-w-xl">

                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field
                            label="Legal First Name"
                            placeholder="Arjun"
                            value={form.firstName}
                            onChange={v => handleChange("firstName", v)}
                            onBlur={() => handleBlur("firstName")}
                            error={touched.firstName && !form.firstName.trim() ? "Required" : ""}
                            icon={<User className="w-4 h-4" />}
                        />
                        <Field
                            label="Legal Last Name"
                            placeholder="Sharma"
                            value={form.lastName}
                            onChange={v => handleChange("lastName", v)}
                            onBlur={() => handleBlur("lastName")}
                            error={touched.lastName && !form.lastName.trim() ? "Required" : ""}
                        />
                    </div>

                    {/* Email */}
                    <Field
                        label="Email Address"
                        placeholder="arjun.sharma@email.com"
                        type="email"
                        value={form.email}
                        onChange={v => handleChange("email", v)}
                        onBlur={() => handleBlur("email")}
                        error={touched.email && !form.email.includes("@") ? "Enter a valid email" : ""}
                        icon={<Mail className="w-4 h-4" />}
                        hint="We'll send your verification receipt here."
                    />

                    {/* Phone + DOB row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field
                            label="Phone Number"
                            placeholder="+91 98765 43210"
                            type="tel"
                            value={form.phone}
                            onChange={v => handleChange("phone", v)}
                            icon={<Phone className="w-4 h-4" />}
                            optional
                        />
                        <Field
                            label="Date of Birth"
                            placeholder="DD/MM/YYYY"
                            type="date"
                            value={form.dob}
                            onChange={v => handleChange("dob", v)}
                            onBlur={() => handleBlur("dob")}
                            error={touched.dob && !form.dob ? "Required" : ""}
                            icon={<Calendar className="w-4 h-4" />}
                        />
                    </div>

                    {/* Nationality + Organisation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field
                            label="Nationality"
                            placeholder="Indian"
                            value={form.nationality}
                            onChange={v => handleChange("nationality", v)}
                            icon={<CreditCard className="w-4 h-4" />}
                            optional
                        />
                        <Field
                            label="Organisation"
                            placeholder="Visionary Labs"
                            value={form.org}
                            onChange={v => handleChange("org", v)}
                            icon={<Building2 className="w-4 h-4" />}
                            optional
                        />
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                        <button
                            onClick={handleNext}
                            disabled={!isValid}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                        >
                            Continue to Document Review
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-4 text-[10px] text-white/20 font-medium">
                            Step 4 of 9 · Your progress is automatically saved.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: CONTEXTUAL VISUAL ───────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606]">
                <AIGuidance
                    step="04"
                    title="Identity Verification"
                    message={AI_HINT}
                    status="Awaiting input"
                />

                {/* Visual: Identity card mock */}
                <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-black/60 p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Identity Record</span>
                    </div>
                    {[
                        { label: "Full Name", val: form.firstName ? `${form.firstName} ${form.lastName}`.trim() : "—" },
                        { label: "Email", val: form.email || "—" },
                        { label: "Date of Birth", val: form.dob || "—" },
                        { label: "Nationality", val: form.nationality || "—" },
                        { label: "Status", val: isValid ? "Ready" : "Incomplete", accent: isValid },
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{row.label}</span>
                            <span className={`text-[11px] font-bold ${row.accent ? "text-accent" : "text-white/50"}`}>{row.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Reusable Field ─────────────────────────────────────────────────────── */
function Field({
    label, placeholder, value, onChange, onBlur, error, hint, icon, type = "text", optional
}: {
    label: string; placeholder: string; value: string;
    onChange: (v: string) => void; onBlur?: () => void;
    error?: string; hint?: string; icon?: React.ReactNode;
    type?: string; optional?: boolean;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    {label}
                </label>
                {optional && (
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Optional</span>
                )}
            </div>
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 ${icon ? "pl-11" : ""} text-white font-semibold text-sm placeholder:text-white/15 outline-none transition-all focus:bg-white/[0.05] ${error
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/[0.08] focus:border-primary/60"
                        }`}
                />
                {value && !error && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                )}
            </div>
            {error && <p className="text-[10px] text-red-400 font-bold">{error}</p>}
            {hint && !error && <p className="text-[10px] text-white/25 font-medium">{hint}</p>}
        </div>
    );
}
