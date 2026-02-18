"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
    ArrowRight
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

export default function AdminDashboard() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <Navbar />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Admin Header */}
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

                {/* Global Metrics */}
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
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Volume</span>
                                </div>
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

                        <div className="mt-8 grid grid-cols-4 gap-4 border-t border-border pt-8">
                            {[
                                { label: "Drop-off Rate", value: "14%", icon: TrendingUp },
                                { label: "Avg. Duration", value: "4m 20s", icon: Activity },
                                { label: "Automation", value: "85%", icon: Zap },
                                { label: "Manual Review", value: "15%", icon: Users },
                            ].map((m, i) => (
                                <div key={i}>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{m.label}</p>
                                    <p className="text-lg font-bold">{m.value}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-8">
                        <CardTitle className="text-xl mb-6">AI Decision Log</CardTitle>
                        <div className="space-y-6">
                            {[
                                { time: "Just Now", text: "Identity verified for Mark S.", system: "OCR-3", type: "success" },
                                { time: "2m ago", text: "Flagged: High-risk AML match found", system: "WATCH-2", type: "alert" },
                                { time: "5m ago", text: "Face Match 99.4% precision - Global ID", system: "BIO-1", type: "success" },
                                { time: "10m ago", text: "Manual review requested - Document Blur", system: "OCR-3", type: "manual" },
                                { time: "12m ago", text: "New application started via Mobile", system: "API", type: "info" }
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
                        <Button variant="ghost" className="w-full mt-6 text-xs text-muted-foreground">View Full Audit Log</Button>
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
            </div>
        </main>
    );
}
