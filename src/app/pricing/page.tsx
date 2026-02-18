"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, Zap, Shield, Globe, Users, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const PLANS = [
    {
        name: "Starter",
        price: "$999",
        description: "Ideal for small regional banks and credit unions.",
        features: [
            "Up to 1,000 onboardings/mo",
            "Standard KYC/AML Check",
            "AI Document Extraction",
            "Email Support",
            "Security Audit Log"
        ],
        icon: Zap,
        color: "primary"
    },
    {
        name: "Enterprise",
        price: "$2,499",
        description: "Complete automation for national banking institutions.",
        features: [
            "Unlimited onboardings",
            "Advanced Video KYC",
            "Biometric Face Match",
            "Real-time Fraud Engine",
            "24/7 Dedicated Support",
            "Custom Compliance Rules"
        ],
        icon: Shield,
        color: "accent",
        featured: true
    },
    {
        name: "Global",
        price: "Custom",
        description: "Multinational support for worldwide financial groups.",
        features: [
            "Multi-jurisdiction AML",
            "150+ Language Support",
            "On-premise Deployment",
            "Custom AI Training",
            "Unlimited B2B Entities"
        ],
        icon: Globe,
        color: "secondary"
    }
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto text-center mb-20">
                <Badge variant="accent" className="mb-6">Flexible SaaS Licensing</Badge>
                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Scale Your <span className="text-gradient">Onboarding Power</span></h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Choose a plan that fits your volume. All plans include our core AI decision engine and OCR modules.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className={`relative p-8 h-full flex flex-col ${plan.featured ? 'border-accent shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}>
                            {plan.featured && (
                                <div className="absolute top-0 right-12 -translate-y-1/2 bg-accent text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-4 rounded-2xl bg-${plan.color}/10`}>
                                    <plan.icon className={`w-8 h-8 text-${plan.color}`} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Platform License</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-black">{plan.price}</span>
                                {plan.price !== 'Custom' && <span className="text-muted-foreground ml-2 text-sm">/ month</span>}
                            </div>

                            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                                {plan.description}
                            </p>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-accent" />
                                        </div>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.featured ? 'accent' : 'outline'}
                                className="w-full h-14 rounded-2xl"
                            >
                                {plan.price === 'Custom' ? 'Contact Solutions' : 'Start Free Trial'}
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* FAQ/Trust */}
            <div className="max-w-4xl mx-auto mt-32 text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 grayscale opacity-50 mb-20">
                    <Check className="w-12 h-12 mx-auto" />
                    <Shield className="w-12 h-12 mx-auto" />
                    <Zap className="w-12 h-12 mx-auto" />
                    <Globe className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground">
                    Need a custom deployment? <span className="text-primary font-bold cursor-pointer">Talk to our Enterprise team.</span>
                </p>
            </div>
        </main>
    );
}
