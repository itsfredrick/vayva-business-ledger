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
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1600px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Command Center</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Live Operational Intelligence</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Range Toggle */}
                    <div className="inline-flex h-12 items-center justify-center rounded-2xl bg-white p-1.5 text-slate-400 ring-1 ring-slate-200 shadow-sm">
                        <Link href="/app/dashboard?range=TODAY" className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${range === "TODAY" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:text-blue-600 hover:bg-blue-50"}`}>
                            Today
                        </Link>
                        <Link href="/app/dashboard?range=WEEK" className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${range === "WEEK" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:text-blue-600 hover:bg-blue-50"}`}>
                            Weekly
                        </Link>
                        <Link href="/app/dashboard?range=MONTH" className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${range === "MONTH" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:text-blue-600 hover:bg-blue-50"}`}>
                            Monthly
                        </Link>
                    </div>

                    <Link href="/app/reports">
                        <Button variant="ghost" className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 shadow-sm bg-white">
                            <FileBarChart className="w-4 h-4 mr-2 text-blue-600" />
                            View Analytics
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
                        <div className="p-8 rounded-[32px] bg-blue-950 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 opacity-20 group-hover:rotate-12 transition-all duration-500 scale-150">
                                <Truck className="w-40 h-40 text-blue-400" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div>
                                    <h4 className="font-black text-2xl tracking-tighter italic uppercase leading-tight">Elite Force<br />Operations</h4>
                                    <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mt-2">Systems Optimization</p>
                                </div>
                                <div className="space-y-3">
                                    <Link href="/app/drivers" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest ring-1 ring-white/10 group/item">
                                        Fleet Management
                                        <ExternalLink className="w-3.5 h-3.5 group-hover/item:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link href="/app/sales" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest ring-1 ring-white/10 group/item">
                                        Revenue Streams
                                        <ExternalLink className="w-3.5 h-3.5 group-hover/item:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                <div className="pt-2">
                                    <p className="text-blue-400/60 text-[9px] font-black uppercase tracking-widest text-center italic">"Excellence in every drop"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
