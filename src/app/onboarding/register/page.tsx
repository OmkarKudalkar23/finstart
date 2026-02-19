"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, User, Mail, Phone, CreditCard, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";
import { useVoiceAgent } from "@/components/voice/VoiceAgentProvider";

export default function RegisterPage() {
    const router = useRouter();
    const { registerStep } = useVoiceAgent();

    const [form, setForm] = useState({
        fullName: "", email: "", phone: "", idNumber: "", password: "", confirmPassword: ""
    });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Register voice step
    useEffect(() => {
        registerStep(
            "register",
            {
                fields: ["fullName", "email", "phone", "idNumber", "password"],
                currentValues: form,
                description: "User registration form. Ask for name, email, phone, and ID."
            },
            {
                onFill: (data) => {
                    setForm(prev => ({ ...prev, ...data }));
                    // Mark filled fields as touched
                    const newTouched: Record<string, boolean> = {};
                    Object.keys(data).forEach(k => newTouched[k] = true);
                    setTouched(prev => ({ ...prev, ...newTouched }));
                },
                onNext: () => handleSubmit() // Trigger submit
            }
        );
    }, [form]); // Update context when form changes

    const errors: Record<string, string> = {};
    if (touched.fullName && !form.fullName.trim()) errors.fullName = "Full name is required";
    if (touched.email && !form.email.includes("@")) errors.email = "Enter a valid email address";
    if (touched.phone && form.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a valid phone number";
    if (touched.idNumber && form.idNumber.trim().length < 6) errors.idNumber = "Enter a valid ID number";
    if (touched.password && form.password.length < 8) errors.password = "Password must be at least 8 characters";
    if (touched.confirmPassword && form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";

    const passwordStrength = (() => {
        const p = form.password;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    })();

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
    const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-400", "bg-accent"][passwordStrength];

    const isValid =
        form.fullName.trim() &&
        form.email.includes("@") &&
        form.phone.replace(/\D/g, "").length >= 10 &&
        form.idNumber.trim().length >= 6 &&
        form.password.length >= 8 &&
        form.password === form.confirmPassword;

    const handleChange = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));
    const handleBlur = (field: string) => setTouched(t => ({ ...t, [field]: true }));

    const handleSubmit = async () => {
        // Validation check for voice-triggered submit
        const isVoiceValid =
            form.fullName.trim() &&
            form.email.includes("@") &&
            form.phone.replace(/\D/g, "").length >= 10 &&
            form.idNumber.trim().length >= 6;

        if (isValid || isVoiceValid) {
            // Send email notification (fire and forget to not block UI)
            fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.fullName, email: form.email }),
            }).catch(err => console.error("Email error:", err));

            router.push("/onboarding/assistant");
        }
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            {/* ── LEFT: REGISTRATION FORM ─────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-12 lg:py-0 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                {/* Step heading */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">01</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Account Registration</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                        Create your<br />
                        <span className="text-primary italic">account.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium max-w-md">
                        Begin your secure banking journey. All information is encrypted and protected under RBI compliance standards.
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6 max-w-xl">

                    {/* Full Name */}
                    <Field
                        label="Full Name"
                        placeholder="Arjun Sharma"
                        value={form.fullName}
                        onChange={v => handleChange("fullName", v)}
                        onBlur={() => handleBlur("fullName")}
                        error={errors.fullName}
                        icon={<User className="w-4 h-4" />}
                        hint="As per your government-issued ID"
                    />

                    {/* Email */}
                    <Field
                        label="Email Address"
                        placeholder="arjun.sharma@email.com"
                        type="email"
                        value={form.email}
                        onChange={v => handleChange("email", v)}
                        onBlur={() => handleBlur("email")}
                        error={errors.email}
                        icon={<Mail className="w-4 h-4" />}
                        hint="Verification receipt will be sent here"
                    />

                    {/* Phone + ID row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field
                            label="Phone Number"
                            placeholder="+91 98765 43210"
                            type="tel"
                            value={form.phone}
                            onChange={v => handleChange("phone", v)}
                            onBlur={() => handleBlur("phone")}
                            error={errors.phone}
                            icon={<Phone className="w-4 h-4" />}
                        />
                        <Field
                            label="ID Number"
                            placeholder="AADHAAR / PAN / Passport"
                            value={form.idNumber}
                            onChange={v => handleChange("idNumber", v)}
                            onBlur={() => handleBlur("idNumber")}
                            error={errors.idNumber}
                            icon={<CreditCard className="w-4 h-4" />}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                            Create Password
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={e => handleChange("password", e.target.value)}
                                onBlur={() => handleBlur("password")}
                                placeholder="Min. 8 characters"
                                className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 pl-11 pr-11 text-white font-semibold text-sm placeholder:text-white/15 outline-none transition-all focus:bg-white/[0.05] ${errors.password ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-primary/60"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {/* Strength bar */}
                        {form.password && (
                            <div className="space-y-1.5">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength ? strengthColor : "bg-white/10"}`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-[10px] font-bold ${passwordStrength >= 3 ? "text-accent" : passwordStrength === 2 ? "text-yellow-400" : "text-red-400"}`}>
                                    {strengthLabel} password
                                </p>
                            </div>
                        )}
                        {errors.password && <p className="text-[10px] text-red-400 font-bold">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={e => handleChange("confirmPassword", e.target.value)}
                                onBlur={() => handleBlur("confirmPassword")}
                                placeholder="Re-enter your password"
                                className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 pl-11 pr-11 text-white font-semibold text-sm placeholder:text-white/15 outline-none transition-all focus:bg-white/[0.05] ${errors.confirmPassword ? "border-red-500/50 focus:border-red-500" : form.confirmPassword && form.password === form.confirmPassword ? "border-accent/40" : "border-white/[0.08] focus:border-primary/60"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(v => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            {form.confirmPassword && form.password === form.confirmPassword && (
                                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                    <CheckCircle2 className="w-4 h-4 text-accent" />
                                </div>
                            )}
                        </div>
                        {errors.confirmPassword && <p className="text-[10px] text-red-400 font-bold">{errors.confirmPassword}</p>}
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                        >
                            Start Onboarding
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-4 text-[10px] text-white/20 font-medium">
                            Step 1 of 9 · Your data is encrypted end-to-end
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: SECURITY PANEL ───────────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606] gap-8">

                {/* AI Guidance */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">AI Guidance</span>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/15 space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Ready to begin</span>
                        </div>
                        <h3 className="text-base font-black text-white">Account Registration</h3>
                        <p className="text-xs text-white/40 font-medium leading-relaxed">
                            I'll guide you through each step of the onboarding process. Your information is protected by bank-grade AES-256 encryption and never shared with third parties.
                        </p>
                    </motion.div>
                </div>

                {/* Security features */}
                <div className="rounded-[1.5rem] border border-white/10 bg-black/60 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Security Standards</span>
                    </div>
                    {[
                        { label: "Encryption", val: "AES-256 bit" },
                        { label: "Protocol", val: "TLS 1.3" },
                        { label: "Compliance", val: "RBI / KYC" },
                        { label: "Data Storage", val: "Zero-knowledge" },
                        { label: "Status", val: "Protected", accent: true },
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{row.label}</span>
                            <span className={`text-[11px] font-bold ${row.accent ? "text-accent" : "text-white/50"}`}>{row.val}</span>
                        </div>
                    ))}
                </div>

                {/* Progress indicator */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Onboarding Progress</span>
                        <span className="text-[10px] font-black text-primary">Step 1 of 9</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "11%" }} />
                    </div>
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
