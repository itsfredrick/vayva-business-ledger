"use client";

import { Money } from "@/lib/format";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface DriverSummaryBarProps {
    totalLoaded: number;
    finalReturn: number;
    supplierBags: number;
    totalSold: number;
    expectedNaira: number;
    receivedNaira: number;
    outstandingEnd: number;
    commission: number;
}

export function DriverSummaryBar({
    totalLoaded,
    finalReturn,
    supplierBags,
    totalSold,
    expectedNaira,
    receivedNaira,
    outstandingEnd,
    commission
}: DriverSummaryBarProps) {
    const shortfall = expectedNaira - receivedNaira;

    return (
        <div className="mt-8 rounded-[24px] bg-slate-950 text-white p-8 overflow-hidden relative shadow-2xl shadow-blue-900/20 ring-1 ring-white/10">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none">
                <div className="w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                {/* Movement Section */}
                <div className="space-y-5">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Stock Reconciliation</p>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-400">Total Loaded</span>
                            <span className="font-bold font-mono">{totalLoaded}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-400">Returns</span>
                            <span className="font-bold font-mono text-slate-200">-{finalReturn}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-400">Supplier Direct</span>
                            <span className="font-bold font-mono text-blue-400">-{supplierBags}</span>
                        </div>
                        <Separator className="bg-slate-800" />
                        <div className="flex justify-between items-center font-black uppercase tracking-tight">
                            <span className="text-slate-300 text-xs">Net Sold</span>
                            <span className="text-2xl text-white">{totalSold}</span>
                        </div>
                    </div>
                </div>

                {/* Expected & Received */}
                <div className="lg:col-span-2 space-y-5">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Financial Settlement</p>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Expected Revenue</p>
                            <div className="text-3xl font-black text-white tabular-nums tracking-tighter"><Money amount={expectedNaira} /></div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Total Received</p>
                            <div className="text-3xl font-black text-emerald-400 tabular-nums tracking-tighter"><Money amount={receivedNaira} /></div>
                        </div>

                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Shortfall / Over</p>
                            <div className={cn("text-xl font-bold tabular-nums tracking-tight flex items-center gap-2", shortfall > 0 ? "text-red-400" : "text-slate-400")}>
                                <Money amount={shortfall} />
                                {shortfall > 0 && <AlertCircle className="w-4 h-4" />}
                            </div>
                        </div>

                        <div>
                            <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Commission Payout</p>
                            <div className="text-xl font-bold text-orange-400 tabular-nums tracking-tight opacity-90"><Money amount={commission} /></div>
                        </div>
                    </div>
                </div>

                {/* Outstanding / Closing Balance */}
                <div className={cn("flex flex-col justify-center rounded-[20px] p-6 text-center ring-1 inset-0 transition-colors",
                    outstandingEnd > 0 ? "bg-red-500/10 ring-red-500/30" : "bg-emerald-500/10 ring-emerald-500/30"
                )}>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 leading-none opacity-60">Closing Balance</p>
                    <div className={cn("text-4xl font-black tabular-nums tracking-tighter mb-2",
                        outstandingEnd > 0 ? "text-red-400" : "text-emerald-400"
                    )}>
                        <Money amount={outstandingEnd} />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        {outstandingEnd <= 0 ? (
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                <CheckCircle2 className="w-3 h-3" /> Account Clear
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500">
                                <AlertCircle className="w-3 h-3" /> Debt Outstanding
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
