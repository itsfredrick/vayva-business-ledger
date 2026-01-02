"use client";

import { Money } from "@/lib/format";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
        <div className="mt-8 rounded-[28px] bg-blue-50/50 p-8 ring-1 ring-blue-100/50 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <div className="w-24 h-24 bg-blue-500 rounded-full blur-3xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                {/* Movement Section */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] opacity-40">Sheet Movement</p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-500">Loaded</span>
                            <span className="font-black text-blue-950">{totalLoaded}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-500">Returns</span>
                            <span className="font-black text-blue-950">{finalReturn}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-500">Supplier</span>
                            <span className="font-black text-blue-600">-{supplierBags}</span>
                        </div>
                        <Separator className="bg-blue-100/50" />
                        <div className="flex justify-between items-center text-sm font-black text-blue-900 uppercase tracking-tighter">
                            <span>Sold Units</span>
                            <span className="text-xl">{totalSold}</span>
                        </div>
                    </div>
                </div>

                {/* Expected & Received */}
                <div className="lg:col-span-2 space-y-4">
                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] opacity-40">Financial Settlement</p>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Expected</p>
                            <div className="text-2xl font-black text-blue-950/40 tabular-nums tracking-tighter"><Money amount={expectedNaira} /></div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-green-600 uppercase tracking-widest leading-none">Received</p>
                            <div className="text-2xl font-black text-green-600 tabular-nums tracking-tighter"><Money amount={receivedNaira} /></div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Shortfall</p>
                            <div className={cn("text-xl font-black tabular-nums tracking-tighter", shortfall > 0 ? "text-red-500" : "text-slate-300")}>
                                <Money amount={shortfall} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest leading-none">Commission Earned</p>
                            <div className="text-xl font-black text-orange-600 tabular-nums tracking-tighter"><Money amount={commission} /></div>
                        </div>
                    </div>
                </div>

                {/* Outstanding */}
                <div className="flex flex-col justify-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Legacy Balance</p>
                    <div className={cn("text-3xl font-black tabular-nums tracking-tighter mb-1", outstandingEnd > 0 ? "text-red-600" : "text-emerald-600")}>
                        <Money amount={outstandingEnd} />
                    </div>
                    <div className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mx-auto", outstandingEnd > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")}>
                        {outstandingEnd > 0 ? "Owed To Company" : "Account Surplus"}
                    </div>
                </div>
            </div>
        </div>
    );
}
