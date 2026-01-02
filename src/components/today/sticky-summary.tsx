
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
        <div className="sticky top-20 space-y-4">

            {/* Main Summary Card */}
            <Card className="shadow-md border-t-4 border-t-blue-600">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Day Summary</CardTitle>
                    <CardDescription>Real-time totals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* Pure Water (Sachet) Block */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                            <Package className="h-4 w-4 text-blue-500" /> Pure Water (Sachet)
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Bags Sold:</span>
                            <span className="font-bold">{pwBags}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Expected:</span>
                            <span className="font-mono"><Money amount={pwExpected} /></span>
                        </div>
                    </div>

                    <Separator />

                    {/* Dispenser Water & Office Block */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                            <Droplets className="h-4 w-4 text-blue-500" /> Dispenser Water
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Bottles: {dispbottles}</span>
                            <span className="font-mono"><Money amount={dispAmount} /></span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                            <Building className="h-4 w-4 text-blue-500" /> Office Sales
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Bags: {officeBags}</span>
                            <span className="font-mono"><Money amount={officeAmount} /></span>
                        </div>
                    </div>

                    <Separator />

                    {/* Financials Block */}
                    <div className="rounded-md bg-muted p-2 text-sm space-y-2">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Gross Rev:</span>
                            <span><Money amount={totalRevenue} /></span>
                        </div>
                        <div className="flex justify-between text-red-500">
                            <span>Expenses:</span>
                            <span>(<Money amount={expensesTotal} />)</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-muted-foreground/20 font-bold text-lg">
                            <span>Net Cash:</span>
                            <span><Money amount={netCash} /></span>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Quick Actions Panel */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-auto py-2 flex flex-col gap-1 text-xs" onClick={onAddOfficeSale} disabled={!isEditable}>
                        <Building className="h-4 w-4" /> Office Sale
                    </Button>
                    <Button variant="outline" className="h-auto py-2 flex flex-col gap-1 text-xs" onClick={onAddDispenser} disabled={!isEditable}>
                        <Droplets className="h-4 w-4" /> Delivery
                    </Button>
                    <Button variant="outline" className="h-auto py-2 flex flex-col gap-1 text-xs" onClick={onAddExpense} disabled={!isEditable}>
                        <CreditCard className="h-4 w-4" /> Expense
                    </Button>
                    <Button variant="ghost" className="h-auto py-2 flex flex-col gap-1 text-xs text-muted-foreground" disabled>
                        Inventory
                    </Button>
                </CardContent>
            </Card>

            {/* Close Day Button */}
            {dayStatus === "OPEN" ? (
                <Button className="w-full gap-2" variant="destructive" onClick={onCloseDay}>
                    <Lock className="h-4 w-4" /> Close Day
                </Button>
            ) : (
                <Button className="w-full gap-2" variant="secondary" onClick={onRequestUnlock}>
                    <Unlock className="h-4 w-4" /> Request Unlock
                </Button>
            )}

        </div>
    );
}
