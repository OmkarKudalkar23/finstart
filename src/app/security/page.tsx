"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { Shield, Lock, FileCheck, Eye, Key, Server, BadgeCheck, Scale } from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityPage() {
    return (
        <main className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
            <Navbar />

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Enterprise-Grade <br /><span className="text-primary">Security Architecture</span></h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Finstart AI is built on the principle of extreme security. We protect your customers' data with multi-layer encryption and military-grade compliance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {[
                        {
                            icon: Lock,
                            title: "AES-256 Encryption",
                            desc: "All PII data is encrypted at rest and in transit using industry-standard protocols.",
                            items: ["Dynamic Key Rotation", "Field-Level Encryption"]
                        },
                        {
                            icon: Server,
                            title: "SOC2 Type II Compliant",
                            desc: "Our infrastructure undergoes rigorous third-party audits to ensure total data sovereignty.",
                            items: ["Annual Audit Reports", "Continuous Monitoring"]
                        },
                        {
                            icon: Eye,
                            title: "Zero-Knowledge Proofs",
                            desc: "Verify identity without exposing sensitive raw data to unnecessary systems.",
                            items: ["Privacy-Preserving KYC", "Secure Data Silos"]
                        },
                        {
                            icon: Scale,
                            title: "Global Compliance",
                            desc: "Automatically stay up to date with GDPR, CCPA, and regional banking regulations.",
                            items: ["Real-time Policy Updates", "Geo-fencing Data"]
                        }
                    ].map((item, i) => (
                        <Card key={i} className="p-8 group hover:border-primary/50 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{item.desc}</p>
                            <div className="flex gap-4">
                                {item.items.map((it) => (
                                    <span key={it} className="text-[10px] uppercase font-black tracking-widest text-primary/80">{it}</span>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="p-12 text-center bg-white/5 border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                    <BadgeCheck className="w-16 h-16 text-accent mx-auto mb-6" />
                    <h3 className="text-3xl font-black mb-4">Transparency is our priority</h3>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        For our institutional partners, we provide full access to our security whitepaper, penetration testing reports, and compliance certificates.
                    </p>
                    <button className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all uppercase tracking-widest text-xs">
                        Download Security Whitepaper
                    </button>
                </Card>
            </div>
        </main>
    );
}
