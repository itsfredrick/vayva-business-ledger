"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, ShieldAlert } from "lucide-react";

export function SystemPreviewSection() {
    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
                <div className="bg-blue-950 rounded-[64px] p-12 lg:p-24 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(29,78,216,0.2)]">

                    <div className="absolute top-0 right-0 w-[60%] h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-blue-400 rounded-full blur-[120px]" />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">Proprietary Infrastructure</p>
                                <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-[1.1]">
                                    Business Ledger & <br /> Accountability
                                </h2>
                                <p className="text-xl text-blue-200 font-bold leading-relaxed max-w-lg italic">
                                    Drivers, trips, sales, and inventory—tracked daily in Naira (₦) with absolute precision.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-white text-blue-950 hover:bg-blue-50 font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-white/10 transition-all active:scale-95 leading-none">
                                    <Link href="/app/today">Enter System</Link>
                                </Button>
                                <Button asChild variant="ghost" size="lg" className="h-16 px-10 rounded-2xl text-white hover:bg-white/10 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 leading-none">
                                    <Link href="/login">Staff Login</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Mock Dashboard Card */}
                        <div className="relative group">
                            <div className="bg-white/5 backdrop-blur-3xl rounded-[48px] border border-white/10 p-10 lg:p-12 shadow-2xl transition-transform duration-700 group-hover:rotate-2 group-hover:scale-[1.03]">
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">Live Operational Feed</span>
                                        </div>
                                        <BarChart3 className="w-5 h-5 text-white/30" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/95 p-6 rounded-3xl space-y-2">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bags Sold Today</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-blue-950 tracking-tighter italic">1,240</span>
                                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="bg-white/95 p-6 rounded-3xl space-y-2">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue (₦)</p>
                                            <div className="text-2xl font-black text-blue-950 tracking-tighter italic">248,000</div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-600/20 rounded-[32px] p-8 border border-blue-400/30 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Driver Performance</p>
                                            <Users className="w-4 h-4 text-blue-200/50" />
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-3xl font-black text-white italic tracking-tighter leading-none">04</p>
                                                <p className="text-[10px] font-black text-blue-300 uppercase leading-none">Trips Logged</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-xl font-black text-emerald-400 italic tracking-tighter leading-none">100%</p>
                                                <p className="text-[10px] font-black text-blue-300 uppercase leading-none">Fulfilled</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                                        <ShieldAlert className="w-4 h-4 text-red-400" />
                                        <span className="text-[10px] font-black text-red-200 uppercase tracking-widest">2 Outstanding Drivers Tracked</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
