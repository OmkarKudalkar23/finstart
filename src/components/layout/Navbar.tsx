"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Shield,
    Bell,
    User,
    Zap,
    ChevronRight,
    Activity,
    ChevronDown,
    Menu,
    X,
    CreditCard,
    Lock,
    PieChart,
    Command
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Products", href: "#", hasDropdown: true },
        { name: "Security", href: "/security", hasDropdown: false },
        { name: "Pricing", href: "/pricing", hasDropdown: false },
        { name: "Support", href: "#", hasDropdown: true },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-4 py-4 lg:px-6",
                isScrolled ? "py-2 lg:py-3" : "py-4 lg:py-6"
            )}
        >
            <div className={cn(
                "max-w-[1400px] mx-auto relative flex items-center justify-between px-4 lg:px-8 h-14 lg:h-16 rounded-2xl transition-all duration-500",
                "border border-white/5 shadow-2xl overflow-hidden",
                isScrolled
                    ? "bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                    : "bg-white/[0.02] backdrop-blur-md"
            )}>
                {/* Ambient Glow behind the navbar on scroll */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500",
                    isScrolled && "opacity-100"
                )} />

                {/* --- LEFT: BRAND BLOCK --- */}
                <div className="flex items-center gap-12 relative z-10">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="w-11 h-11 flex items-center justify-center relative transition-transform duration-500 group-hover:rotate-[10deg]">
                                {/* Background geometric shapes */}
                                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:bg-primary/30 transition-colors" />
                                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Outer Frame */}
                                    <rect x="2" y="2" width="40" height="40" rx="10" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />

                                    {/* Abstract Logo Mark: "The FinStart Monolith" */}
                                    <path
                                        d="M14 12V32M14 12L22 20L30 12M14 22H24"
                                        stroke="url(#logo-gradient)"
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="group-hover:stroke-white transition-colors duration-500"
                                    />

                                    <defs>
                                        <linearGradient id="logo-gradient" x1="14" y1="12" x2="30" y2="32" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#8B5CF6" />
                                            <stop offset="1" stopColor="#3B82F6" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Glow ring */}
                                <div className="absolute -inset-1 border border-white/5 rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </div>

                        <div className="flex flex-col text-left">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold tracking-tighter text-white leading-none">
                                    Fin<span className="text-primary font-black">start</span>
                                </span>
                                <div className="px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 backdrop-blur-sm">
                                    <span className="text-[9px] font-bold text-primary tracking-wider leading-none">AI</span>
                                </div>
                            </div>
                            <div className="h-[1px] w-full bg-gradient-to-r from-primary/30 to-transparent mt-1.5 opacity-40 shrink-0" />
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative"
                                onMouseEnter={() => setActiveMenu(link.name)}
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-[11px] font-black uppercase tracking-[0.25em] transition-all flex items-center gap-1.5",
                                        activeMenu === link.name ? "text-white" : "text-white/50 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                    {link.hasDropdown && <ChevronDown className={cn("w-3 h-3 transition-transform", activeMenu === link.name && "rotate-180")} />}
                                </Link>
                                {/* Active Indicator Line */}
                                <AnimatePresence>
                                    {activeMenu === link.name && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="absolute -bottom-7 left-0 right-0 h-0.5 bg-primary"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            exit={{ scaleX: 0 }}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT: CONTROL ZONE --- */}
                <div className="flex items-center gap-4 relative z-10">


                    {/* Notification Center */}
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group relative">
                        <Bell className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-black animate-pulse" />
                    </button>

                    <div className="h-8 w-px bg-white/5 hidden md:block" />

                    {/* Primary CTA */}
                    <Link href="/onboarding" className="hidden sm:block">
                        <Button
                            size="sm"
                            className={cn(
                                "rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-6 h-10 lg:h-11 shadow-lg shadow-primary/20 group relative overflow-hidden",
                                isScrolled && "h-10 lg:h-10 text-[9px]"
                            )}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Open Account
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            />
                        </Button>
                    </Link>

                    {/* Profile / Account Access */}
                    <button className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all flex items-center justify-center group overflow-hidden p-0.5">
                        <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center group-hover:scale-95 transition-transform">
                            <User className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                        </div>
                    </button>

                    {/* Mobile Menu Trigger */}
                    <button
                        className="lg:hidden p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* --- MOBILE NAVIGATION PANEL --- */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-4 right-4 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 lg:hidden shadow-3xl z-50"
                    >
                        <div className="space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center justify-between group"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="text-2xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors text-white">{link.name}</span>
                                    <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                            <div className="h-px bg-white/5 my-8" />
                            <div className="grid grid-cols-2 gap-4">
                                <Button size="lg" variant="outline" className="rounded-2xl font-bold">Sign In</Button>
                                <Button size="lg" className="rounded-2xl font-bold bg-primary text-white">Join Now</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mega Menu Dropdown Mockup (for Products) */}
            <AnimatePresence>
                {activeMenu === "Products" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        onMouseEnter={() => setActiveMenu("Products")}
                        onMouseLeave={() => setActiveMenu(null)}
                        className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[900px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 hidden lg:grid grid-cols-3 gap-8 shadow-3xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />

                        <div className="space-y-6 relative">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 text-left">Core Elements</p>
                            {[
                                { title: "Smart Cards", desc: "Intelligent issuance & control", icon: CreditCard, color: "primary" },
                                { title: "Vault Security", desc: "Bank-grade asset storage", icon: Lock, color: "accent" }
                            ].map(item => (
                                <Link key={item.title} href="#" className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5 text-white text-left">
                                    <div className={cn("p-2 rounded-xl bg-white/5 text-white/40 group-hover/item:text-white transition-colors")}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold mb-1 opacity-80 group-hover/item:opacity-100">{item.title}</p>
                                        <p className="text-[10px] text-white/40 leading-tight">{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-6 relative">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 text-left">Platform Intelligence</p>
                            {[
                                { title: "AI Analytics", desc: "Predictive spend insights", icon: PieChart, color: "primary" },
                                { title: "SDK / API", desc: "Developer first integration", icon: Command, color: "secondary" }
                            ].map(item => (
                                <Link key={item.title} href="#" className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5 text-white text-left">
                                    <div className="p-2 rounded-xl bg-white/5 text-white/40 group-hover/item:text-white transition-colors">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold mb-1 opacity-80 group-hover/item:opacity-100">{item.title}</p>
                                        <p className="text-[10px] text-white/40 leading-tight">{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="relative bg-white/5 rounded-[2rem] p-6 flex flex-col justify-between border border-white/5 text-white text-left">
                            <div className="space-y-4">
                                <Badge variant="accent">Beta</Badge>
                                <h4 className="text-xl font-black italic tracking-tighter">Biometric High-Speed Checkout</h4>
                                <p className="text-[11px] text-white/40 leading-relaxed">Early access for institutional partners is now open for limited slots.</p>
                            </div>
                            <Button variant="outline" className="w-full mt-6 rounded-xl font-bold uppercase tracking-widest text-[10px] h-10">Request Access</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
