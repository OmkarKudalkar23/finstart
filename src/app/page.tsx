"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Brain,
  BarChart3,
  Globe,
  Lock,
  Activity,
  Search,
  FileText,
  UserCheck,
  LayoutDashboard,
  Bell,
  Fingerprint,
  Database,
  Cpu,
  RefreshCw,
  TrendingUp,
  Star,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UnifiedPipeline } from "@/components/layout/UnifiedPipeline";

export default function Home() {
  const [activeStage, setActiveStage] = useState(0);
  const stages = ["Identity Scan", "Biometric Match", "Risk Analysis", "Account Ready"];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden">
      <Navbar />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[15%] w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-20" />
      </div>

      {/* Hero Section: Reimagined with Card Stack */}
      <section className="relative pt-28 lg:pt-36 pb-20 px-6 max-w-[1400px] mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-white/5 bg-black/20 backdrop-blur-sm rounded-3xl overflow-hidden">

          {/* Left: Headline (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col justify-center p-8 lg:p-16 border-r border-white/5 min-h-[600px]">
            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl lg:text-[82px] font-black leading-[0.95] tracking-tighter"
              >
                Intelligent Banking <br />
                <span className="italic font-light opacity-80">for True Financial</span> <br />
                Freedom
              </motion.h1>
              <div className="mt-12 max-w-md">
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  Open. Honest. Hardworking. <br /> Changing lives - one member at a time
                </p>
              </div>
            </div>
          </div>

          {/* Right: Card Stack & CTA (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 lg:p-16 h-full bg-white/[0.02]">
            {/* Fanned Card Stack */}
            <div className="relative h-[420px] mb-12 flex items-center justify-center">
              <div className="relative w-full h-full scale-110 lg:scale-125 origin-center">
                <CardStack />

                {/* Stamp Badge - Floating relative to cards */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[-40px] right-[-40px] w-32 h-32 flex items-center justify-center hidden xl:flex z-50 pointer-events-none"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <path id="circlePath" d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0 " fill="transparent" />
                    <text className="text-[6px] font-black uppercase tracking-[0.35em] fill-white/60">
                      <textPath xlinkHref="#circlePath">
                        START USING STANDCARD TODAY • START USING STANDCARD TODAY •
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white fill-white opacity-40" />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="space-y-6 pt-12">
              <Link href="/onboarding" className="block transform hover:scale-[1.02] transition-transform duration-300">
                <Button size="lg" className="w-full h-20 rounded-none bg-[#0a5cf5] hover:bg-[#084ac2] text-white text-xl font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(10,92,245,0.3)] border-none">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Strip: Infinite Scroll */}
      <section className="relative py-12 lg:py-16 border-b border-white/5 bg-black/40 z-10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] min-w-[180px] text-center lg:text-left opacity-60">
            Trusted by hundreds <br className="hidden lg:block" /> of companies
          </span>

          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="flex items-center gap-20 whitespace-nowrap py-4"
            >
              {[
                "Spotify", "Allianz (11)", "L'ORÉAL", "Kellogg's", "NETFLIX", "Discord", "Revolut", "Samsung", "Disney+", "T-Mobile"
              ].map((logo, i) => (
                <span key={i} className="text-2xl font-black italic tracking-tighter opacity-30 hover:opacity-100 transition-opacity cursor-default uppercase">
                  {logo}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                "Spotify", "Allianz (11)", "L'ORÉAL", "Kellogg's", "NETFLIX", "Discord", "Revolut", "Samsung", "Disney+", "T-Mobile"
              ].map((logo, i) => (
                <span key={`dup-${i}`} className="text-2xl font-black italic tracking-tighter opacity-30 hover:opacity-100 transition-opacity cursor-default uppercase">
                  {logo}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="opacity-20 hidden lg:block"
          >
            <ArrowRight className="w-8 h-8 rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* Product Flow Section: "The Intelligent Pipeline" */}
      <UnifiedPipeline />

      {/* ── FEATURE SECTION ─────────────────────────────────────────── */}
      <section className="relative bg-[#050505] overflow-hidden">

        {/* ── FEATURE 1: Admin Intelligence ──────────────────────────── */}
        <div className="relative min-h-screen flex items-center border-b border-white/[0.04]">

          {/* Full-bleed background number */}
          <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none overflow-hidden">
            <span className="text-[28vw] font-black text-white/[0.02] leading-none tracking-tighter">85</span>
          </div>

          {/* Gradient blobs */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[180px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/8 blur-[140px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-32 grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-center relative z-10">

            {/* Left: Copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Admin Intelligence</span>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Manual Review Reduction</p>
                <h2 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                  Cut noise.<br />
                  <span className="relative inline-block">
                    <span className="text-primary italic">Not corners.</span>
                    <motion.div
                      animate={{ scaleX: [0, 1] }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-primary/40 origin-left"
                    />
                  </span>
                </h2>
              </div>

              <p className="text-base text-white/40 leading-relaxed max-w-md font-medium">
                Our AI surfaces only the cases that need human eyes. Every other decision is handled, logged, and compliant — automatically.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                {[
                  { val: "85%", label: "Fewer manual reviews" },
                  { val: "2.3s", label: "Avg. decision time" },
                  { val: "99.8%", label: "Compliance rate" },
                ].map((s, i) => (
                  <div key={i} className="space-y-1 border-l border-white/10 pl-4">
                    <p className="text-2xl font-black text-white tracking-tight">{s.val}</p>
                    <p className="text-[10px] text-white/30 font-medium leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Admin Dashboard */}
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-[3rem] blur-2xl" />

              <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.08] bg-[#0c0c0c] shadow-[0_40px_120px_rgba(0,0,0,0.8)]">

                {/* Window chrome */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-4 h-5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center px-3">
                    <span className="text-[9px] text-white/20 font-mono">finstart.io/admin/compliance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[8px] font-black text-accent uppercase tracking-widest">Live</span>
                  </div>
                </div>

                {/* Dashboard body */}
                <div className="p-5 space-y-4">

                  {/* Metric cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Success Rate", val: "94.2%", sub: "+2.1% vs last week", color: "accent", bg: "bg-accent/5 border-accent/15" },
                      { label: "Fraud Alerts", val: "12", sub: "3 high-risk", color: "red-400", bg: "bg-red-500/5 border-red-500/15" },
                      { label: "Queue", val: "4", sub: "↓ from 31", color: "primary", bg: "bg-primary/5 border-primary/15" },
                    ].map((m, i) => (
                      <div key={i} className={`p-3 rounded-xl border ${m.bg} space-y-1`}>
                        <p className={`text-[8px] font-black uppercase tracking-widest text-${m.color} opacity-70`}>{m.label}</p>
                        <p className={`text-xl font-black text-${m.color} leading-none`}>{m.val}</p>
                        <p className="text-[8px] text-white/20 font-medium">{m.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Sparkline bar chart */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Verification Volume — 7d</span>
                      <span className="text-[9px] font-bold text-accent">↑ 18%</span>
                    </div>
                    <div className="flex items-end gap-1 h-10">
                      {[40, 65, 45, 80, 55, 90, 72].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                          className={`flex-1 rounded-sm ${i === 5 ? "bg-primary" : "bg-white/10"}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1.5">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                        <span key={i} className="text-[7px] text-white/15 font-bold flex-1 text-center">{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Activity feed */}
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 px-1 mb-2">Live Activity</p>
                    {[
                      { name: "Sarah W.", country: "🇬🇧", status: "Verified", statusColor: "text-accent", dot: "bg-accent", time: "2s" },
                      { name: "Marcus T.", country: "🇩🇪", status: "Manual Review", statusColor: "text-amber-400", dot: "bg-amber-400", time: "15s" },
                      { name: "Neo Corp", country: "🇸🇬", status: "Verified", statusColor: "text-accent", dot: "bg-accent", time: "1m" },
                      { name: "Priya K.", country: "🇮🇳", status: "Flagged", statusColor: "text-red-400", dot: "bg-red-400", time: "3m" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
                        <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 shrink-0">
                          {row.name[0]}
                        </div>
                        <span className="text-[11px] font-semibold text-white/60 flex-1">{row.name}</span>
                        <span className="text-[10px]">{row.country}</span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${row.dot} ${row.dot === "bg-accent" ? "animate-pulse" : ""}`} />
                          <span className={`text-[9px] font-black uppercase tracking-wider ${row.statusColor}`}>{row.status}</span>
                        </div>
                        <span className="text-[8px] text-white/15 font-mono">{row.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FEATURE 2: Biometric KYC ───────────────────────────────── */}
        <div className="relative min-h-screen flex items-center border-b border-white/[0.04]">

          {/* Background number */}
          <div className="absolute inset-0 flex items-center justify-start pl-8 pointer-events-none select-none overflow-hidden">
            <span className="text-[28vw] font-black text-white/[0.02] leading-none tracking-tighter">02</span>
          </div>

          {/* Gradient blobs */}
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/8 blur-[160px] rounded-full translate-x-1/3 -translate-y-1/2 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-32 grid lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-24 items-center relative z-10">

            {/* Left: Biometric HUD */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-br from-accent/8 via-transparent to-primary/8 rounded-[3rem] blur-2xl" />

              <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.08] bg-[#0c0c0c] shadow-[0_40px_120px_rgba(0,0,0,0.8)] aspect-[4/3] flex items-center justify-center">

                {/* Grid bg */}
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                />

                {/* Radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)]" />

                {/* Face oval */}
                <div className="relative flex flex-col items-center gap-6">
                  <div className="relative w-44 h-56">
                    {/* Outer rings */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.35, 0.15] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -inset-6 rounded-full border border-primary/30"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.2, 0.08] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      className="absolute -inset-12 rounded-full border border-primary/15"
                    />

                    {/* Main oval */}
                    <div className="absolute inset-0 rounded-full border-2 border-primary/50 overflow-hidden bg-primary/[0.03]">
                      {/* Scan line */}
                      <motion.div
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[1px] bg-primary/70 shadow-[0_0_12px_rgba(139,92,246,0.9)]"
                      />
                    </div>

                    {/* Corner brackets */}
                    {[
                      "top-0 left-0 border-t-2 border-l-2",
                      "top-0 right-0 border-t-2 border-r-2",
                      "bottom-0 left-0 border-b-2 border-l-2",
                      "bottom-0 right-0 border-b-2 border-r-2",
                    ].map((cls, i) => (
                      <div key={i} className={`absolute w-5 h-5 border-primary/60 ${cls}`} />
                    ))}

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Fingerprint className="w-16 h-16 text-primary/15" />
                    </div>
                  </div>

                  {/* Status pill */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl">
                    <Activity className="w-3 h-3 text-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Passive liveness active</span>
                  </div>
                </div>

                {/* Floating HUD chips */}
                <div className="absolute top-6 left-6 px-3 py-1.5 rounded-lg bg-black/70 border border-primary/20 backdrop-blur-xl">
                  <p className="text-[8px] font-black uppercase tracking-widest text-primary/70">Depth Map</p>
                  <p className="text-[11px] font-bold text-white">68 pts · OK</p>
                </div>
                <div className="absolute top-6 right-6 px-3 py-1.5 rounded-lg bg-black/70 border border-accent/20 backdrop-blur-xl">
                  <p className="text-[8px] font-black uppercase tracking-widest text-accent/70">Confidence</p>
                  <p className="text-[11px] font-bold text-white">98.4%</p>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-3 rounded-xl bg-black/70 border border-white/[0.06] backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Liveness Score</span>
                    <span className="text-[9px] font-black text-accent">PASSED</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: ["0%", "98%"] }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-accent shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/80">Customer Experience</span>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Zero-friction KYC</p>
                <h2 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                  Verified in<br />
                  <span className="text-accent italic">seconds.</span>
                </h2>
              </div>

              <blockquote className="border-l-2 border-accent/40 pl-5">
                <p className="text-base text-white/50 italic leading-relaxed font-medium">
                  "I was verified and accessing my account before my coffee was ready."
                </p>
                <p className="text-[10px] text-white/25 font-black uppercase tracking-widest mt-2">— Early access user</p>
              </blockquote>

              <p className="text-sm text-white/35 leading-relaxed font-medium max-w-sm">
                No awkward phrases. No head movements. Passive liveness detection runs silently in the background — invisible to the user, impossible to spoof.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { icon: <Zap className="w-4 h-4" />, label: "Instant Activation", color: "text-accent" },
                  { icon: <ShieldCheck className="w-4 h-4" />, label: "Bank-Grade Privacy", color: "text-primary" },
                  { icon: <Brain className="w-4 h-4" />, label: "Passive AI Detection", color: "text-accent" },
                  { icon: <Globe className="w-4 h-4" />, label: "190+ Countries", color: "text-primary" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                    <div className={`${item.color} opacity-60`}>{item.icon}</div>
                    <span className="text-[11px] font-bold text-white/50">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enterprise Analytics Preview */}
      <section className="relative py-32 overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-4xl font-bold tracking-tight">Enterprise Intelligence.</h2>
              <p className="text-muted-foreground leading-relaxed">
                Monitor your entire onboarding funnel across all regions with sub-second precision. Identify friction points before they become drop-offs.
              </p>
              <div className="space-y-6">
                {[
                  { label: "Conversion Lift", value: "32%", icon: TrendingUp, color: "text-accent" },
                  { label: "AI Decision Rate", value: "98.4%", icon: Cpu, color: "text-primary" },
                  { label: "Risk Mitigation", value: "$4.2M", icon: ShieldCheck, color: "text-secondary" }
                ].map(stat => (
                  <div key={stat.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 relative">
              <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
              <Card className="p-8 bg-[#0a0a0a] border-white/10 shadow-3xl overflow-hidden relative">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Global Funnel Performance</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-[10px] uppercase font-black opacity-50">Detailed Report</Button>
                </div>

                <div className="h-[300px] w-full flex items-end gap-2 px-2">
                  {[60, 45, 80, 55, 90, 70, 40, 65, 85, 50, 75, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 0.8 }}
                      className="flex-1 bg-gradient-to-t from-primary/10 via-primary/40 to-primary rounded-t-sm relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold">
                        {Math.floor(Math.random() * 1000)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">USA</p>
                    <p className="text-sm font-bold text-accent">98.2%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">EUROPE</p>
                    <p className="text-sm font-bold text-primary">94.5%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">ASIA</p>
                    <p className="text-sm font-bold text-secondary">91.8%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">OTHERS</p>
                    <p className="text-sm font-bold">88.4%</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Status Bar */}
      <section className="relative py-12 border-y border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-white/10 bg-gradient-to-br from-white/20 to-transparent ring-1 ring-white/10" />
              ))}
            </div>
            <div>
              <p className="text-xs font-bold">Trusted by 20+ Neo-Banks</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Join the ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-black uppercase text-accent tracking-tighter">Systems Operational</span>
              </div>
              <span className="text-[9px] text-muted-foreground uppercase font-black px-2 py-0.5 rounded bg-white/5 border border-white/10 mt-1">Global Latency: 12ms</span>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="flex flex-col items-start px-4 py-2 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Security Integrity</p>
              <div className="flex gap-2 items-center">
                <ShieldCheck className="w-3 h-3 text-primary" />
                <p className="text-[10px] font-bold">AES-256 E2EE ACTIVE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter italic">Stop losing users <br /> at <span className="text-gradient">Day Zero.</span></h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto tracking-tight">
            Deploy the world's most advanced AI onboarding agent in less than 48 hours. Enterprise security, custom branding, and instant deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="h-16 px-12 rounded-3xl text-lg font-black bg-white text-black hover:bg-white/90 shadow-2xl">Get Started Free</Button>
            </Link>
            <button className="h-16 px-12 rounded-3xl text-sm font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/5 transition-all">Request Enterprise Key</button>
          </div>
        </div>
      </section>

      {/* Refined Footer */}
      <footer className="relative py-20 px-6 border-t border-white/5 bg-[#050505] z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Fin<span className="text-primary font-black">start</span> AI
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Digitizing the banking journey with production-grade AI since 2024. Licensed and compliant across 120 jurisdictions.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Platform</h4>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">AI Onboarding</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Video KYC</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Fraud Engine</li>
              <li className="hover:text-primary transition-colors cursor-pointer">AML Watch</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Solutions</h4>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Retail Banking</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Crypto Assets</li>
              <li className="hover:text-primary transition-colors cursor-pointer">B2B Enterprise</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Public Sector</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Company</h4>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Security</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Support</li>
              <li className="hover:text-primary transition-colors cursor-pointer">System Status</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Legal</h4>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Cookie Policy</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-primary transition-colors cursor-pointer">SLA</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest select-none">© 2026 Finstart AI Technologies Inc.</p>
          <div className="flex gap-6 grayscale opacity-50">
            <span className="text-[10px] font-black tracking-tighter italic">FINRA MEMBER</span>
            <span className="text-[10px] font-black tracking-tighter italic">SOC2 TYPE II</span>
            <span className="text-[10px] font-black tracking-tighter italic">ISO 27001</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function CardStack() {
  const cards = [
    { name: "Yurnero", color: "bg-[#fbb014]", rotate: -25, x: 0, z: 10, y: 0 },
    { name: "Arya Hima", color: "bg-[#f2f2f2]", textColor: "text-black", rotate: -15, x: 100, z: 20, y: 15 },
    { name: "Sarah Wilson", color: "bg-[#0a5cf5]", rotate: -5, x: 200, z: 30, y: 30 },
  ];

  return (
    <div className="relative w-full h-full flex items-end">
      {cards.map((card, i) => (
        <motion.div
          key={card.name}
          initial={{ y: 200, opacity: 0, rotate: -40 }}
          animate={{ y: card.y, opacity: 1, x: card.x, rotate: card.rotate }}
          transition={{
            delay: i * 0.1,
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className={cn(
            "absolute bottom-0 w-[240px] h-[360px] rounded-[24px] p-8 shadow-[20px_40px_80px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden ring-1 ring-white/20",
            card.color,
            card.textColor || "text-white"
          )}
          style={{
            zIndex: card.z,
            transformOrigin: "bottom left"
          }}
        >
          {/* Card Tech & Chip */}
          <div className="flex justify-between items-start">
            <div className="w-10 h-8 border border-current/20 rounded-lg flex flex-col p-1 gap-0.5">
              <div className="h-full border-b border-current/20" />
              <div className="h-full border-b border-current/20" />
            </div>
            <div className="flex flex-col items-end">
              <Zap className="w-6 h-6 fill-current" />
              <span className="text-[8px] font-black tracking-widest mt-1 uppercase">Standcard</span>
            </div>
          </div>

          <div className="mt-auto space-y-6">
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Card Number</p>
              <p className="text-lg font-bold tracking-[0.1em]">**** 2568</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Name</p>
                <p className="text-sm font-bold uppercase tracking-tighter">{card.name}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Exp. Date</p>
                <p className="text-sm font-bold tracking-[0.2em]">05/25</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
