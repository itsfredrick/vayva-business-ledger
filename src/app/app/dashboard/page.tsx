import { requireRole } from "@/lib/auth-checks";
import { getDashboardStats, getSystemAlerts, DashboardRange } from "@/lib/actions/report-actions";
import { DashboardStats, DashboardAlerts } from "@/components/dashboard/dashboard-widgets";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileBarChart, Truck, ExternalLink } from "lucide-react";

export default async function DashboardPage(props: { searchParams?: Promise<{ range?: string }> }) {
    const searchParams = await props.searchParams;
    await requireRole(["OWNER"]);

    const range = (searchParams?.range || "TODAY") as DashboardRange;

    // Fetch Data
    const stats = await getDashboardStats(range);
    const alerts = await getSystemAlerts();

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 max-w-[1600px] mx-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight underline decoration-primary/20 underline-offset-8">Dashboard</h1>
                    <p className="text-muted-foreground mt-2 font-medium italic">Operational summary & system alerts.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Range Toggle */}
                    <div className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/50 p-1 text-muted-foreground border shadow-inner">
                        <Link href="/app/dashboard?range=TODAY" className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-all ${range === "TODAY" ? "bg-white dark:bg-zinc-900 text-foreground shadow-sm border" : "hover:text-primary"}`}>
                            Today
                        </Link>
                        <Link href="/app/dashboard?range=WEEK" className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-all ${range === "WEEK" ? "bg-white dark:bg-zinc-900 text-foreground shadow-sm border" : "hover:text-primary"}`}>
                            Week
                        </Link>
                        <Link href="/app/dashboard?range=MONTH" className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-all ${range === "MONTH" ? "bg-white dark:bg-zinc-900 text-foreground shadow-sm border" : "hover:text-primary"}`}>
                            Month
                        </Link>
                    </div>

                    <Link href="/app/reports">
                        <Button variant="outline" className="h-10 rounded-xl font-bold border-2 shadow-sm">
                            <FileBarChart className="w-4 h-4 mr-2" />
                            REPORTS
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Main Stats Column */}
                <div className="flex-1 min-w-0 space-y-10">
                    <DashboardStats stats={stats} />
                </div>

                {/* Sidebar Alerts Column */}
                <div className="lg:w-[350px] xl:w-[400px] shrink-0 space-y-8">
                    <div className="h-fit sticky top-8 space-y-8">
                        <DashboardAlerts alerts={alerts} />

                        {/* Quick Navigation / Help */}
                        <div className="p-6 rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
                                <Truck className="w-20 h-20" />
                            </div>
                            <h4 className="font-black text-xl italic mb-1">PRO TIPS</h4>
                            <p className="text-zinc-400 dark:text-zinc-600 text-xs mb-4">Use Cmd+K to quickly search across all records.</p>
                            <div className="space-y-2">
                                <Link href="/app/drivers" className="flex items-center justify-between p-2 rounded bg-white/10 dark:bg-black/10 hover:bg-white/20 transition-colors text-sm font-bold">
                                    Manage Drivers <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <Link href="/app/sales" className="flex items-center justify-between p-2 rounded bg-white/10 dark:bg-black/10 hover:bg-white/20 transition-colors text-sm font-bold">
                                    Daily Sales <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
