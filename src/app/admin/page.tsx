"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ExplainableAMLDecisions, AMLDecision } from "@/components/admin/ExplainableAMLDecisions";
import { getMistralOCRService } from "@/lib/mistralOCR";
import { 
    Users,
    UserPlus,
    AlertTriangle,
    CheckCircle,
    Filter,
    Download,
    Search,
    MoreHorizontal,
    Activity,
    Zap,
    ShieldAlert,
    BarChart2,
    TrendingUp,
    ArrowRight,
    Brain,
    MessageSquare,
    Eye,
    Clock,
    Settings
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

const FUNNEL_DATA = [
    { name: 'Start', visitors: 4000, color: '#8b5cf6' },
    { name: 'Details', visitors: 3000, color: '#0ea5e9' },
    { name: 'Docs', visitors: 2000, color: '#10b981' },
    { name: 'Video', visitors: 1500, color: '#8b5cf6' },
    { name: 'Active', visitors: 1200, color: '#0ea5e9' },
];

const RECENT_APPLICATIONS = [
    { name: 'Emily Zhang', type: 'Personal', status: 'Pending KYC', risk: 'Low', date: '2 mins ago', score: 820 },
    { name: 'Global Tech Corp', type: 'Business', status: 'In Review', risk: 'Medium', date: '15 mins ago', score: 640 },
    { name: 'Marcus Aurelius', type: 'Personal', status: 'Flagged', risk: 'High', date: '45 mins ago', score: 210 },
    { name: 'Sophia Loren', type: 'Personal', status: 'Completed', risk: 'Low', date: '1 hour ago', score: 910 },
    { name: 'Neo Dynamics', type: 'Business', status: 'Pending DOCS', risk: 'Low', date: '3 hours ago', score: 750 },
];

// Mock AML decisions for the advanced features
const mockAMLDecisions: AMLDecision[] = [
    {
        id: "aml_001",
        userId: "user_123456",
        timestamp: new Date(Date.now() - 3600000),
        overallDecision: "approve",
        confidence: 94,
        riskScore: 15,
        triggeredRules: [
            {
                ruleId: "rule_001",
                ruleName: "Standard Identity Verification",
                category: "behavioral",
                severity: "low",
                confidence: 96,
                details: "User passed all standard identity verification checks with high confidence scores across all biometric and document analysis modules.",
                evidence: ["Document authenticity: 98%", "Face match: 95%", "Liveness detection: 97%"]
            }
        ],
        decisionFactors: {
            identityVerification: { documentAuthenticity: 98, ocrConfidence: 96, faceMatch: 95 },
            behavioralAnalysis: { completionTime: 240, deviceConsistency: true, locationConsistency: true, typingPattern: 89 },
            riskIndicators: { amlScore: 95, fraudProbability: 2, politicallyExposedPerson: false, sanctionsHit: false }
        },
        auditTrail: [
            {
                timestamp: new Date(Date.now() - 3600000),
                action: "Document upload initiated",
                actor: "user_123456",
                details: "User uploaded passport document",
                systemGenerated: true
            }
        ]
    }
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart2 },
        { id: "aml", label: "AML/KYC Decisions", icon: ShieldAlert },
        { id: "ai", label: "AI Features", icon: Brain },
        { id: "staff", label: "Staff Assist", icon: MessageSquare }
    ];

    const renderAdvancedFeatures = () => (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Advanced AI Features Status
                </h3>
                <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { 
                        name: "AI Onboarding Copilot", 
                        status: "active", 
                        users: "2,847", 
                        accuracy: "96%",
                        description: "Real-time AI assistant guiding users through onboarding"
                    },
                    { 
                        name: "Smart Document Quality Scoring", 
                        status: "active", 
                        users: "2,847", 
                        accuracy: "94%",
                        description: "AI-powered document quality assessment before upload"
                    },
                    { 
                        name: "Mistral OCR Integration", 
                        status: "active", 
                        users: "1,423", 
                        accuracy: "97.3%",
                        description: "Advanced text extraction and document analysis using Mistral AI"
                    },
                    { 
                        name: "Risk-Adaptive Flow", 
                        status: "active", 
                        users: "2,847", 
                        accuracy: "92%",
                        description: "Dynamic onboarding steps based on real-time risk scoring"
                    },
                    { 
                        name: "Drop-off Recovery", 
                        status: "active", 
                        users: "156", 
                        accuracy: "89%",
                        description: "Automated recovery campaigns for abandoned sessions"
                    },
                    { 
                        name: "Fraud Learning Loop", 
                        status: "training", 
                        users: "2,847", 
                        accuracy: "94.2%",
                        description: "Self-improving AI models from reviewer feedback"
                    },
                    { 
                        name: "Staff Assist Mode", 
                        status: "active", 
                        users: "3", 
                        accuracy: "98%",
                        description: "AI confidence-based human escalation system"
                    }
                ].map((feature, index) => (
                    <div key={index} className="bg-black/40 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    feature.status === "active" ? "bg-green-400" : 
                                    feature.status === "training" ? "bg-amber-400" : "bg-red-400"
                                }`} />
                                <span className="text-sm font-medium text-white">{feature.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                {feature.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-white/60 mb-3">{feature.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/40">{feature.users} users</span>
                            <span className="text-xs text-primary font-medium">{feature.accuracy} accuracy</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mistral OCR Statistics */}
            <div className="mt-8 bg-black/40 border border-white/10 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Mistral OCR Performance Metrics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Documents Processed", value: "1,423", change: "+12%" },
                        { label: "Average Confidence", value: "97.3%", change: "+2.1%" },
                        { label: "Extraction Accuracy", value: "94.8%", change: "+3.2%" },
                        { label: "Processing Time", value: "2.3s", change: "-0.5s" }
                    ].map((metric, index) => (
                        <div key={index} className="text-center">
                            <p className="text-2xl font-bold text-white">{metric.value}</p>
                            <p className="text-xs text-white/60">{metric.label}</p>
                            <p className="text-xs text-green-400 mt-1">{metric.change}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <>
                        {/* Original admin content */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Applications", value: "24,582", sub: "+5.2%", icon: UserPlus, color: "text-primary" },
                                { label: "Processing Rate", value: "98.4%", sub: "Instantly", icon: Zap, color: "text-accent" },
                                { label: "High Risk Alerts", value: "12", sub: "-2 from yesterday", icon: ShieldAlert, color: "text-red-500" },
                                { label: "KYC Success", value: "92.1%", sub: "+1.2%", icon: CheckCircle, color: "text-secondary" },
                            ].map((stat, i) => (
                                <Card key={i} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-[10px] font-bold ${stat.color.includes('red') ? 'text-red-500' : 'text-accent'}`}>{stat.sub}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
                                    <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                                </Card>
                            ))}
                        </div>

                        {/* Analytics & Funnel */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 p-8 overflow-hidden">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <CardTitle className="text-xl">Onboarding Funnel</CardTitle>
                                        <p className="text-sm text-muted-foreground">Real-time conversion tracking</p>
                                    </div>
                                </div>

                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={FUNNEL_DATA}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                                            <XAxis dataKey="name" stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                                                itemStyle={{ color: '#fff' }}
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            />
                                            <Bar dataKey="visitors" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="p-8">
                                <CardTitle className="text-xl mb-6">AI Decision Log</CardTitle>
                                <div className="space-y-6">
                                    {[
                                        { time: "Just Now", text: "Identity verified for Mark S.", system: "OCR-3", type: "success" },
                                        { time: "2m ago", text: "Flagged: High-risk AML match", system: "WATCH-2", type: "alert" },
                                        { time: "5m ago", text: "Face Match 99.4% precision - Global ID", system: "BIO-1", type: "success" },
                                        { time: "10m ago", text: "Manual review - Document Blur", system: "OCR-3", type: "manual" },
                                    ].map((log, i) => (
                                        <div key={i} className="flex gap-4 group cursor-pointer">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-2 h-2 rounded-full mt-1.5 ${log.type === 'success' ? 'bg-accent shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                        log.type === 'alert' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                            log.type === 'manual' ? 'bg-amber-500' : 'bg-primary'
                                                    }`} />
                                                <div className="w-px flex-1 bg-border my-1" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{log.text}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{log.time}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase bg-white/5 px-1.5 py-0.5 rounded italic">{log.system}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Application Queue Table */}
                        <Card className="overflow-hidden">
                            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border-b border-border">
                                <div>
                                    <CardTitle className="text-lg">Real-time Application Queue</CardTitle>
                                    <CardDescription>Monitor and manage incoming onboarding requests</CardDescription>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                    <input
                                        placeholder="Search by name, email or ID..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Applicant</th>
                                            <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Type</th>
                                            <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Risk Score</th>
                                            <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Status</th>
                                            <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {RECENT_APPLICATIONS.map((app, i) => (
                                            <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                                                <td className="p-4">
                                                    <div>
                                                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{app.name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase">{app.date}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs font-medium text-muted-foreground">{app.type}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${app.score > 800 ? 'bg-accent' :
                                                                        app.score > 500 ? 'bg-amber-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${app.score / 10}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold">{app.score}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={
                                                        app.status === 'Completed' ? 'success' :
                                                            app.status === 'Flagged' ? 'destructive' :
                                                                app.status === 'In Review' ? 'secondary' : 'default'
                                                    }>
                                                        {app.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                                            Review
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                );
            case "aml":
                return <ExplainableAMLDecisions decisions={mockAMLDecisions} />;
            case "ai":
                return renderAdvancedFeatures();
            case "staff":
                return (
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Staff Assist Mode
                        </h3>
                        <p className="text-muted-foreground mb-6">AI confidence-based human escalation and staff performance analytics</p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold">Active Escalations</h4>
                                {[
                                    { id: "ESC001", user: "John Doe", reason: "Low confidence", time: "2 min ago", priority: "high" },
                                    { id: "ESC002", user: "Jane Smith", reason: "Complex case", time: "5 min ago", priority: "medium" },
                                    { id: "ESC003", user: "Bob Johnson", reason: "User request", time: "12 min ago", priority: "low" }
                                ].map((escalation) => (
                                    <div key={escalation.id} className="bg-black/40 border border-white/10 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium text-white">{escalation.user}</p>
                                                <p className="text-sm text-white/60">{escalation.reason}</p>
                                            </div>
                                            <Badge variant={escalation.priority === "high" ? "destructive" : "secondary"}>
                                                {escalation.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-white/40">{escalation.time}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold">Staff Performance</h4>
                                {[
                                    { name: "Sarah Chen", active: 2, avgTime: "2.3min", satisfaction: "98%" },
                                    { name: "Marcus Johnson", active: 1, avgTime: "3.1min", satisfaction: "95%" },
                                    { name: "Priya Patel", active: 0, avgTime: "1.8min", satisfaction: "97%" }
                                ].map((staff) => (
                                    <div key={staff.name} className="bg-black/40 border border-white/10 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-medium text-white">{staff.name}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                                <span className="text-xs text-green-400">Available</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Active: {staff.active}</span>
                                            <span className="text-white/60">Avg: {staff.avgTime}</span>
                                            <span className="text-primary">{staff.satisfaction}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                );
            default:
                return null;
        }
    };
    return (
        <main className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <Navbar />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Admin Header with Tabs */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-bold">Operations Hub</h1>
                                <Badge variant="secondary">Bank Admin</Badge>
                            </div>
                            <p className="text-muted-foreground">Monitoring 1,240 active onboarding sessions across all regions.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button size="sm" variant="outline" className="rounded-xl">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            <Button size="sm" className="rounded-xl">
                                <Download className="w-4 h-4 mr-2" />
                                Export Report
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-2 border-b border-border">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Content */}
                {renderContent()}
            </div>
        </main>
    );
}
