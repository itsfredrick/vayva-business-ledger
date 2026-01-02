
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Money } from "@/lib/format";
import { Lock, Unlock, Package, Droplets, Building, CreditCard } from "lucide-react";

interface StickySummaryProps {
    // Pure water totals
    pwBags: number;
    pwExpected: number;
    pwReceived: number;
    pwOutstanding: number;

    // Dispenser totals (mocked or passed)
    dispbottles: number;
    dispAmount: number;

    // Office totals
    officeBags: number;
    officeAmount: number;

    // Expenses
    expensesTotal: number;

    // Cash Ledger
    cashInHand: number; // calculated from received

    dayStatus: "OPEN" | "CLOSED";
    isEditable: boolean;

    // Actions
    onCloseDay: () => void;
    onRequestUnlock: () => void;
    onAddOfficeSale: () => void;
    onAddExpense: () => void;
    onAddDispenser: () => void;
}

export function StickySummary({
    pwBags, pwExpected, pwReceived, pwOutstanding,
    dispbottles, dispAmount,
    officeBags, officeAmount,
    expensesTotal,
    cashInHand,
    dayStatus,
    isEditable,
    onCloseDay, onRequestUnlock, onAddOfficeSale, onAddExpense, onAddDispenser
}: StickySummaryProps) {
    const totalRevenue = pwExpected + dispAmount + officeAmount;
    const netCash = cashInHand - expensesTotal; // Simplified

    return (
        <div className="sticky top-24 space-y-6">

            {/* Main Summary Card */}
            <Card className="border-0 shadow-[0_20px_50px_-10px_rgba(30,58,138,0.15)] ring-1 ring-slate-100 rounded-[32px] overflow-hidden bg-white">
                <CardHeader className="pb-4 pt-8 px-8 border-b border-slate-50">
                    <CardTitle className="text-2xl font-black text-blue-950 tracking-tighter">Day Summary</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Financial Pulse — Real-time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-8">

                    {/* Pure Water (Sachet) Block */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            <Package className="h-3.5 w-3.5" /> Pure Water (Sachet)
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-500">Bags Sold</span>
                            <span className="text-xl font-black text-blue-950">{pwBags}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-500">Expected</span>
                            <span className="text-lg font-black text-blue-950/40 tabular-nums tracking-tighter"><Money amount={pwExpected} /></span>
                        </div>
                    </div>

                    <Separator className="bg-slate-50" />

                    {/* Dispenser Water & Office Block */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                <Droplets className="h-3 w-3" /> Dispenser
                            </div>
                            <div className="text-lg font-black text-blue-950 tabular-nums leading-none"><Money amount={dispAmount} /></div>
                            <p className="text-[9px] font-bold text-slate-400 leading-none">{dispbottles} Bottles</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                <Building className="h-3 w-3" /> Office
                            </div>
                            <div className="text-lg font-black text-blue-950 tabular-nums leading-none"><Money amount={officeAmount} /></div>
                            <p className="text-[9px] font-bold text-slate-400 leading-none">{officeBags} Bags</p>
                        </div>
                    </div>

                    {/* Financials Block */}
                    <div className="rounded-3xl bg-blue-50/50 p-6 space-y-4 ring-1 ring-blue-100/50">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gross Rev</span>
                            <span className="font-bold text-blue-900 tabular-nums"><Money amount={totalRevenue} /></span>
                        </div>
                        <div className="flex justify-between items-center text-red-500">
                            <span className="text-xs font-bold uppercase tracking-widest">Expenses</span>
                            <span className="font-bold tabular-nums">(<Money amount={expensesTotal} />)</span>
                        </div>
                        <Separator className="bg-blue-100/50" />
                        <div className="flex justify-between items-baseline pt-1">
                            <span className="text-xs font-black text-blue-950 uppercase tracking-widest">Net Cash</span>
                            <span className="text-3xl font-black text-blue-900 tracking-tighter tabular-nums"><Money amount={netCash} /></span>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Quick Actions Panel */}
            <Card className="border-0 shadow-sm ring-1 ring-slate-100 rounded-[28px] overflow-hidden">
                <CardHeader className="pb-3 pt-6 px-6">
                    <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 p-6 pt-0">
                    <Button variant="outline" className="h-auto py-3.5 flex flex-col gap-1.5 text-[10px] font-black uppercase tracking-wider rounded-2xl border-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95" onClick={onAddOfficeSale} disabled={!isEditable}>
                        <Building className="h-4 w-4" /> Office
                    </Button>
                    <Button variant="outline" className="h-auto py-3.5 flex flex-col gap-1.5 text-[10px] font-black uppercase tracking-wider rounded-2xl border-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95" onClick={onAddDispenser} disabled={!isEditable}>
                        <Droplets className="h-4 w-4" /> Dispenser
                    </Button>
                    <Button variant="outline" className="h-auto py-3.5 flex flex-col gap-1.5 text-[10px] font-black uppercase tracking-wider rounded-2xl border-slate-100 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95" onClick={onAddExpense} disabled={!isEditable}>
                        <CreditCard className="h-4 w-4" /> Expense
                    </Button>
                    <Button variant="outline" className="h-auto py-3.5 flex flex-col gap-1.5 text-[10px] font-black uppercase tracking-wider rounded-2xl border-slate-100 opacity-40" disabled>
                        <Package className="h-4 w-4" /> Inventory
                    </Button>
                </CardContent>
            </Card>

            {/* Close Day Button */}
            <div className="px-2">
                {dayStatus === "OPEN" ? (
                    <Button className="w-full h-14 rounded-2xl gap-3 bg-red-600 hover:bg-black text-white font-black uppercase tracking-widest shadow-xl shadow-red-600/20 active:scale-95 transition-all" onClick={onCloseDay}>
                        <Lock className="h-5 w-5" /> Close Operational Day
                    </Button>
                ) : (
                    <Button className="w-full h-14 rounded-2xl gap-3 bg-blue-950 hover:bg-black text-white font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all" onClick={onRequestUnlock}>
                        <Unlock className="h-5 w-5" /> Request Lock Removal
                    </Button>
                )}
            </div>

        </div>
    );
}
