k"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";
import {
    CreditCard,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    FileText,
    ShieldCheck,
    TrendingUp,
    Clock,
    Settings,
    MoreVertical,
    ChevronRight,
    PieChart
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const DATA = [
    { name: 'Sep', value: 4000 },
    { name: 'Oct', value: 3000 },
    { name: 'Nov', value: 5000 },
    { name: 'Dec', value: 4500 },
    { name: 'Jan', value: 6000 },
    { name: 'Feb', value: 8000 },
];

export default function CustomerDashboard() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <Navbar />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Good morning, John Doe</h1>
                        <p className="text-muted-foreground">Here's your financial overview for today.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button size="sm" variant="outline" className="rounded-xl">
                            <Clock className="w-4 h-4 mr-2" />
                            History
                        </Button>
                        <Button size="sm" className="rounded-xl">
                            <Wallet className="w-4 h-4 mr-2" />
                            Add Funds
                        </Button>
                    </div>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-10 -mt-10" />
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <Wallet className="w-6 h-6 text-primary" />
                            </div>
                            <Badge variant="accent">+12.5%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Total Balance</p>
                        <h2 className="text-4xl font-black mt-1">$45,280.00</h2>
                        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                            <ArrowUpRight className="w-4 h-4 text-accent" />
                            <span>Up from last month</span>
                        </div>
                    </Card>

                    <Card className="p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl -mr-10 -mt-10" />
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-secondary/10">
                                <CreditCard className="w-6 h-6 text-secondary" />
                            </div>
                            <Badge variant="outline">Enterprise</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Active Cards</p>
                        <h2 className="text-4xl font-black mt-1">3</h2>
                        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-secondary w-3/4 rounded-full" />
                            </div>
                            <span className="font-bold">75% Limit</span>
                        </div>
                    </Card>

                    <Card className="p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -mr-10 -mt-10" />
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-accent/10">
                                <ShieldCheck className="w-6 h-6 text-accent" />
                            </div>
                            <Badge variant="success">Verified</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">KYC Status</p>
                        <h2 className="text-4xl font-black mt-1">Tier 3</h2>
                        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-4 h-4 text-accent" />
                            <span>Expires in 12 months</span>
                        </div>
                    </Card>
                </div>

                {/* Charts and Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <Card className="lg:col-span-2 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <CardTitle className="text-xl">Financial Growth</CardTitle>
                                <CardDescription>Monthly revenue and investment growth</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                {['1W', '1M', '3M', '1Y'].map((t) => (
                                    <button key={t} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-colors">
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={DATA}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                                    <XAxis dataKey="name" stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Risk Indicator */}
                        <Card className="p-6">
                            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Risk Profile</CardTitle>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-2xl font-bold text-accent">Low Risk</span>
                                <span className="text-xs text-muted-foreground font-bold">Score: 820</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                                <div className="h-full bg-accent w-4/5" />
                                <div className="h-full bg-secondary w-[10%]" />
                                <div className="h-full bg-primary w-[10%]" />
                            </div>
                            <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
                                Your account demonstrates high compliance standards and healthy transaction patterns.
                            </p>
                        </Card>

                        {/* Smart Alerts */}
                        <Card className="p-0 overflow-hidden">
                            <div className="p-6 border-b border-border bg-white/5">
                                <CardTitle className="text-sm uppercase tracking-widest">Recommended Actions</CardTitle>
                            </div>
                            <div className="divide-y divide-border">
                                {[
                                    { icon: ShieldCheck, title: "Enable 2FA", desc: "Add extra security layer", color: "text-primary" },
                                    { icon: FileText, title: "Update Tax ID", desc: "Required for high-limit access", color: "text-secondary" },
                                    { icon: TrendingUp, title: "Smart Invest", desc: "Allocate $2k to Gold Fund", color: "text-accent" },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] cursor-pointer group">
                                        <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold">{item.title}</p>
                                            <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Transaction History Sub-Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <Card className="lg:col-span-3 overflow-hidden">
                        <div className="p-6 flex justify-between items-center border-b border-border">
                            <CardTitle className="text-lg">Recent Transactions</CardTitle>
                            <Button size="sm" variant="ghost" className="text-xs">View All</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Transaction</th>
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Category</th>
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Date</th>
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {[
                                        { name: 'Apple Inc.', cat: 'Electronics', date: 'Feb 18, 2024', amount: '-$1,299.00', color: 'text-foreground' },
                                        { name: 'Amazon Web Services', cat: 'Cloud Services', date: 'Feb 15, 2024', amount: '-$450.20', color: 'text-foreground' },
                                        { name: 'Stripe Payout', cat: 'Revenue', date: 'Feb 14, 2024', amount: '+$3,400.00', color: 'text-accent' },
                                        { name: 'Spotify Premium', cat: 'Entertainment', date: 'Feb 12, 2024', amount: '-$14.99', color: 'text-foreground' }
                                    ].map((tx, i) => (
                                        <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs">
                                                        {tx.name[0]}
                                                    </div>
                                                    <span className="text-sm font-medium">{tx.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs text-muted-foreground">{tx.cat}</td>
                                            <td className="p-4 text-xs text-muted-foreground">{tx.date}</td>
                                            <td className={`p-4 text-sm font-bold text-right ${tx.color}`}>{tx.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card className="p-6 flex flex-col items-center justify-center text-center">
                        <PieChart className="w-16 h-16 text-primary mb-6 opacity-20" />
                        <h3 className="text-lg font-bold mb-2">Portfolio Insights</h3>
                        <p className="text-xs text-muted-foreground mb-8">
                            Based on your activity, you could save $1,200 annually by switching to Enterprise Plus.
                        </p>
                        <Button variant="outline" size="sm" className="w-full rounded-xl">Unlock Insights</Button>
                    </Card>
                </div>
            </div>
        </main>
    );
}
