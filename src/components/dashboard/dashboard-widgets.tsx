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
        <div className="grid grid-cols-1 gap-10">
            {/* Pure Water Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-blue-500" /> Kool Joo Volume & Cash
                    </h3>
                    <Badge variant="outline" className="font-mono">{stats.koolJoo.bagsSold.toLocaleString()} Bags Sold</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        title="Revenue Expected"
                        value={stats.koolJoo.revenueExpected}
                        isCurrency
                        subtitle="Total value of bags sold"
                    />
                    <StatCard
                        title="Cash Received"
                        value={stats.koolJoo.cashReceived}
                        isCurrency
                        trend="UP"
                        valueColor="text-green-600 dark:text-green-400"
                        subtitle="Confirmed cash in hand"
                    />
                    <StatCard
                        title="Outstanding"
                        value={stats.koolJoo.outstanding}
                        isCurrency
                        trend={stats.koolJoo.outstanding > 0 ? "DOWN" : "UP"}
                        valueColor={stats.koolJoo.outstanding > 10000 ? "text-red-600 dark:text-red-400" : ""}
                        subtitle="Total collection pending"
                    />
                </div>

                {/* Performance Visualizer (Simple CSS Bar) */}
                <div className="p-4 rounded-xl border bg-muted/10">
                    <div className="flex justify-between text-xs font-medium mb-2">
                        <span>Collection Progress</span>
                        <span>{Math.round((stats.koolJoo.cashReceived / stats.koolJoo.revenueExpected) * 100) || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, (stats.koolJoo.cashReceived / stats.koolJoo.revenueExpected) * 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Dispenser Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-cyan-500" /> Dispenser Operations
                    </h3>
                    <Badge variant="outline" className="font-mono">{stats.dispenser.bottlesDelivered.toLocaleString()} Delivered</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Delivered Revenue" value={stats.dispenser.revenue} isCurrency />
                    <StatCard title="Monthly Invoiced" value={stats.dispenser.billed} isCurrency />
                    <StatCard title="Bottles Owing" value={stats.dispenser.totalOwingBottles} />
                </div>
            </div>

            {/* Expenses Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-red-500" /> Operational Costs
                    </h3>
                </div>
                <Card className="bg-zinc-50 dark:bg-zinc-900 shadow-none border-dashed">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Expenses</p>
                                <div className="text-4xl font-black tabular-nums mt-1 text-red-600 dark:text-red-400">
                                    <Money amount={stats.expenses.total} />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="bg-white dark:bg-black">Salary</Badge>
                                <Badge variant="outline" className="bg-white dark:bg-black">Diesel</Badge>
                                <Badge variant="outline" className="bg-white dark:bg-black">Maintenance</Badge>
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
    subtitle = ""
}: {
    title: string,
    value: number,
    isCurrency?: boolean,
    trend?: "UP" | "DOWN" | null,
    valueColor?: string,
    subtitle?: string
}) {
    return (
        <Card className="border shadow-none hover:border-primary/20 transition-colors">
            <CardHeader className="pb-1">
                <CardTitle className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest flex justify-between items-center">
                    {title}
                    {trend === "UP" && <TrendingUp className="w-3 h-3 text-green-500" />}
                    {trend === "DOWN" && <TrendingDown className="w-3 h-3 text-red-500" />}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-black tabular-nums tracking-tight", valueColor)}>
                    {isCurrency ? <Money amount={value} /> : value.toLocaleString()}
                </div>
                {subtitle && <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">{subtitle}</p>}
            </CardContent>
        </Card>
    );
}
