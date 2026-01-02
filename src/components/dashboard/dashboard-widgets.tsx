"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Truck, Droplets, AlertCircle, TrendingUp, TrendingDown, ArrowRight, ExternalLink } from "lucide-react";
import { Money } from "@/lib/format";
import { cn } from "@/lib/utils";

type Alert = {
    type: string;
    message: string;
    link: string;
    severity: string;
};

export function DashboardAlerts({ alerts }: { alerts: Alert[] }) {
    if (alerts.length === 0) return (
        <div className="p-4 text-center text-sm text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            No active alerts. Operational status normal.
        </div>
    );

    return (
        <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" /> System Alerts
            </h3>
            {alerts.map((alert, idx) => (
                <div key={idx} className={cn(
                    "relative overflow-hidden p-3 rounded-lg border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-950",
                    alert.severity === "CRITICAL" ? "border-red-200 bg-red-50/30" : "border-amber-200 bg-amber-50/30"
                )}>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-semibold leading-tight pr-4">{alert.message}</span>
                            <Badge variant={alert.severity === "CRITICAL" ? "destructive" : "secondary"} className="text-[10px] uppercase h-5">
                                {alert.severity}
                            </Badge>
                        </div>
                        <a href={alert.link} className="text-xs flex items-center gap-1 text-primary font-medium hover:underline">
                            Take Action <ArrowRight className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ---

type StatsData = {
    koolJoo: { bagsSold: number; revenueExpected: number; cashReceived: number; outstanding: number; };
    dispenser: { bottlesDelivered: number; revenue: number; billed: number; totalOwingBottles: number; };
    expenses: { total: number; };
};

export function DashboardStats({ stats }: { stats: StatsData }) {
    return (
        <div className="space-y-12">
            {/* Pure Water (Sachet) Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-black text-xl italic tracking-tighter text-blue-950 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/10">
                                <ShoppingBag className="w-4 h-4" />
                            </span>
                            Sachet Production
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold pl-10">Daily Operations & Liquidity</p>
                    </div>
                    <Badge variant="secondary" className="font-mono bg-blue-50 text-blue-700 tracking-widest text-xs px-3 py-1">{stats.koolJoo.bagsSold.toLocaleString()} BAGS</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Revenue Expected"
                        value={stats.koolJoo.revenueExpected}
                        isCurrency
                        subtitle="Projected Yield"
                        icon={TrendingUp}
                        iconColor="text-blue-400"
                    />
                    <StatCard
                        title="Cash in Hand"
                        value={stats.koolJoo.cashReceived}
                        isCurrency
                        trend="UP"
                        valueColor="text-emerald-600 dark:text-emerald-400"
                        accentColor="bg-emerald-500"
                        subtitle="Liquid Assets"
                        icon={DollarSign}
                        iconColor="text-emerald-500"
                    />
                    <StatCard
                        title="Outstanding"
                        value={stats.koolJoo.outstanding}
                        isCurrency
                        trend={stats.koolJoo.outstanding > 0 ? "DOWN" : "UP"}
                        valueColor={stats.koolJoo.outstanding > 10000 ? "text-red-600 dark:text-red-400" : "text-slate-600"}
                        accentColor="bg-red-500"
                        subtitle="Uncollected Debt"
                        icon={AlertCircle}
                        iconColor="text-red-500"
                    />
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(100, (stats.koolJoo.cashReceived / stats.koolJoo.revenueExpected) * 100)}%` }}
                    />
                </div>
            </div>

            {/* Dispenser Water Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-black text-xl italic tracking-tighter text-blue-950 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white shadow-md shadow-cyan-900/10">
                                <Droplets className="w-4 h-4" />
                            </span>
                            Dispenser Logistics
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold pl-10">Corporate Supply Chain</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Revenue Value" value={stats.dispenser.revenue} isCurrency subtitle="Delivery Value" />
                    <StatCard title="Invoiced" value={stats.dispenser.billed} isCurrency subtitle="Billed to Client" />
                    <StatCard title="Bottles Owing" value={stats.dispenser.totalOwingBottles} subtitle="Asset Deficit" icon={AlertCircle} iconColor="text-amber-500" />
                    <StatCard title="Delivered" value={stats.dispenser.bottlesDelivered} subtitle="Volume Moved" icon={Truck} />
                </div>
            </div>

            {/* Expenses Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <h3 className="font-black text-xl italic tracking-tighter text-red-950 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-md shadow-red-900/10">
                        <DollarSign className="w-4 h-4" />
                    </span>
                    Operational Overhead
                </h3>
                <Card className="border-none bg-gradient-to-br from-red-50/50 to-white shadow-lg shadow-red-900/5 ring-1 ring-red-100/50 rounded-[2rem] overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
                    <CardContent className="p-8 md:p-10 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                            <div className="space-y-2">
                                <p className="text-[11px] font-black text-red-400 uppercase tracking-[0.3em]">Total Daily Outflow</p>
                                <div className="text-6xl font-black tabular-nums tracking-tighter text-red-600 drop-shadow-sm">
                                    <Money amount={stats.expenses.total} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 max-w-md">
                                {[
                                    { label: "Salary", active: true },
                                    { label: "Diesel", active: true },
                                    { label: "Maintenance", active: true },
                                    { label: "Supplies", active: false },
                                ].map((tag) => (
                                    <Badge
                                        key={tag.label}
                                        variant="outline"
                                        className={cn(
                                            "px-5 py-2 rounded-xl border-none font-black text-[10px] uppercase tracking-wider transition-all",
                                            tag.active
                                                ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                                                : "bg-white text-slate-300 ring-1 ring-slate-100"
                                        )}
                                    >
                                        {tag.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    isCurrency = false,
    trend = null,
    valueColor = "",
    accentColor = "bg-blue-600",
    subtitle = "",
    icon: Icon,
    iconColor = "text-slate-300"
}: {
    title: string,
    value: number,
    isCurrency?: boolean,
    trend?: "UP" | "DOWN" | null,
    valueColor?: string,
    accentColor?: string,
    subtitle?: string,
    icon?: any,
    iconColor?: string
}) {
    return (
        <Card className="border-none shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white ring-1 ring-slate-100 rounded-[2rem] overflow-hidden group relative">
            <CardHeader className="pb-2 pt-8 px-8 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {title}
                </CardTitle>
                {Icon && <Icon className={cn("w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity", iconColor)} />}
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-1">
                <div className={cn("text-4xl font-black tabular-nums tracking-tighter text-blue-950", valueColor)}>
                    {isCurrency ? <Money amount={value} /> : value.toLocaleString()}
                </div>
                {subtitle && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic opacity-60 group-hover:opacity-100 transition-opacity">{subtitle}</p>}
            </CardContent>
            {/* Hover Accent */}
            <div className={cn("absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity", accentColor)} />
        </Card>
    );
}
