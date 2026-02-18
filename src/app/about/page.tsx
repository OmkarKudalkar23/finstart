"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Brain, Users, Globe, Zap, Rocket, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
            <Navbar />

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-32">
                    <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter italic">We are the <br /><span className="text-secondary text-gradient">Future of Trust.</span></h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Finstart AI was founded in 2024 with a simple mission: to make financial access instant, secure, and human-centric through advanced artificial intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-40">
                    <div className="text-center">
                        <div className="text-5xl font-black mb-2 text-primary">12ms</div>
                        <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Decision Latency</p>
                    </div>
                    <div className="text-center border-x border-border">
                        <div className="text-5xl font-black mb-2 text-secondary">500k+</div>
                        <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Daily Verifications</p>
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-black mb-2 text-accent">0.001%</div>
                        <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">False Match Rate</p>
                    </div>
                </div>

                <div className="space-y-32">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <Badge variant="secondary" className="mb-6">The AI Advantage</Badge>
                            <h2 className="text-4xl font-bold mb-6">Beyond Simple Forms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Traditional onboarding is slow, manual, and prone to human error. Finstart's neural networks analyze documents and biometrics with better-than-human precision, reducing the process from days to seconds.
                            </p>
                        </div>
                        <Card className="aspect-square bg-white/5 border-white/10 flex items-center justify-center relative overflow-hidden">
                            <Brain className="w-48 h-48 text-primary/20 absolute" />
                            <div className="relative z-10 p-12 text-center">
                                <p className="text-sm font-medium italic">"Finstart isn't just a tool; it's the intelligent partner that helps us scale without adding operational friction."</p>
                                <p className="mt-4 text-xs font-bold uppercase tracking-widest">— CTO, Global Digital Bank</p>
                            </div>
                        </Card>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <Card className="order-2 md:order-1 aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 border-white/5 flex items-center justify-center">
                            <Globe className="w-24 h-24 text-white/10" />
                        </Card>
                        <div className="order-1 md:order-2">
                            <Badge variant="accent" className="mb-6">Global Vision</Badge>
                            <h2 className="text-4xl font-bold mb-6">Unified Financial World</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We believe geography shouldn't be a barrier to banking. Our AI understands 150+ languages and thousands of regional identity documents, making global expansion a reality for any institution.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-40 text-center py-20 border-t border-border">
                    <Heart className="w-12 h-12 text-red-500 mx-auto mb-8 animate-pulse" />
                    <h3 className="text-3xl font-bold mb-6">Join the Revolution</h3>
                    <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
                        Ready to transform your bank's onboarding experience? Let's build something extraordinary together.
                    </p>
                    <Button size="lg" className="rounded-2xl px-12">Contact Sales</Button>
                </div>
            </div>
        </main>
    );
}
