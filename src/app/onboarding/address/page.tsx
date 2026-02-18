"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Home, Building, Globe, CheckCircle2, Navigation } from "lucide-react";
import { AIGuidance } from "@/components/onboarding/AIGuidance";

export default function AddressPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        line1: "", line2: "", city: "", state: "", pincode: "", country: "India"
    });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const isValid = form.line1.trim() && form.city.trim() && form.state.trim() && form.pincode.trim().length >= 6;

    const handleBlur = (field: string) => setTouched(t => ({ ...t, [field]: true }));
    const handleChange = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));

    const handleVerify = () => {
        if (!isValid) return;
        setVerifying(true);
        setTimeout(() => {
            setVerifying(false);
            setVerified(true);
        }, 2000);
    };

    const handleNext = () => {
        if (verified) router.push("/onboarding/financial");
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            {/* ── LEFT: ADDRESS FORM ──────────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-12 lg:py-0 max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-[8px] font-black text-primary">06</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Address Verification</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
                        Confirm your<br />
                        <span className="text-primary italic">address.</span>
                    </h1>
                    <p className="text-sm text-white/40 font-medium max-w-md">
                        Your residential address is required for KYC compliance. This must match your uploaded address proof document.
                    </p>
                </div>

                <div className="space-y-6 max-w-xl">

                    {/* Address Line 1 */}
                    <Field
                        label="Address Line 1"
                        placeholder="Flat 4B, Sunrise Apartments"
                        value={form.line1}
                        onChange={v => handleChange("line1", v)}
                        onBlur={() => handleBlur("line1")}
                        error={touched.line1 && !form.line1.trim() ? "Required" : ""}
                        icon={<Home className="w-4 h-4" />}
                    />

                    {/* Address Line 2 */}
                    <Field
                        label="Address Line 2"
                        placeholder="MG Road, Koramangala"
                        value={form.line2}
                        onChange={v => handleChange("line2", v)}
                        icon={<MapPin className="w-4 h-4" />}
                        optional
                    />

                    {/* City + State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field
                            label="City"
                            placeholder="Bengaluru"
                            value={form.city}
                            onChange={v => handleChange("city", v)}
                            onBlur={() => handleBlur("city")}
                            error={touched.city && !form.city.trim() ? "Required" : ""}
                            icon={<Building className="w-4 h-4" />}
                        />
                        <Field
                            label="State"
                            placeholder="Karnataka"
                            value={form.state}
                            onChange={v => handleChange("state", v)}
                            onBlur={() => handleBlur("state")}
                            error={touched.state && !form.state.trim() ? "Required" : ""}
                        />
                    </div>

                    {/* Pincode + Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field
                            label="PIN Code"
                            placeholder="560034"
                            value={form.pincode}
                            onChange={v => handleChange("pincode", v)}
                            onBlur={() => handleBlur("pincode")}
                            error={touched.pincode && form.pincode.trim().length < 6 ? "Enter valid PIN code" : ""}
                            icon={<Navigation className="w-4 h-4" />}
                        />
                        <Field
                            label="Country"
                            placeholder="India"
                            value={form.country}
                            onChange={v => handleChange("country", v)}
                            icon={<Globe className="w-4 h-4" />}
                        />
                    </div>

                    {/* Verify + Continue */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                        {!verified ? (
                            <button
                                onClick={handleVerify}
                                disabled={!isValid || verifying}
                                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
                            >
                                {verifying ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                                        />
                                        Verifying Address…
                                    </>
                                ) : (
                                    <>
                                        Verify Address
                                        <Navigation className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-accent/20"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Address Verified — Continue
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                    <p className="text-[10px] text-white/20 font-medium">
                        Step 6 of 9 · Address must match your uploaded proof document
                    </p>
                </div>
            </div>

            {/* ── RIGHT: MAP VISUAL ───────────────────────────────────────── */}
            <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-center px-12 xl:px-16 border-l border-white/[0.05] bg-[#060606] gap-8">
                <AIGuidance
                    step="06"
                    title="Address Verification"
                    message="We cross-reference your address against postal databases and your uploaded address proof. This ensures your account is linked to a verified residential location as per RBI guidelines."
                    status={verified ? "Address verified ✓" : verifying ? "Verifying…" : "Awaiting address"}
                />

                {/* Address card mock */}
                <div className="rounded-[1.5rem] border border-white/10 bg-black/60 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Address Record</span>
                    </div>

                    {/* Map placeholder */}
                    <div className="aspect-video rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)]" />
                        {/* Grid lines */}
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
                                backgroundSize: "20px 20px"
                            }}
                        />
                        {verified ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-accent" />
                                </div>
                                <p className="text-[9px] font-black text-accent uppercase tracking-widest">Location Pinned</p>
                            </motion.div>
                        ) : (
                            <MapPin className="w-8 h-8 text-white/10" />
                        )}
                    </div>

                    {[
                        { label: "Line 1", val: form.line1 || "—" },
                        { label: "City", val: form.city || "—" },
                        { label: "State", val: form.state || "—" },
                        { label: "PIN Code", val: form.pincode || "—" },
                        { label: "Verification", val: verified ? "Confirmed" : verifying ? "Checking…" : "Pending", accent: verified },
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{row.label}</span>
                            <span className={`text-[11px] font-bold truncate max-w-[160px] ${row.accent ? "text-accent" : "text-white/50"}`}>{row.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

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
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</label>
                {optional && <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Optional</span>}
            </div>
            <div className="relative">
                {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">{icon}</div>}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 ${icon ? "pl-11" : ""} text-white font-semibold text-sm placeholder:text-white/15 outline-none transition-all focus:bg-white/[0.05] ${error ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-primary/60"}`}
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
