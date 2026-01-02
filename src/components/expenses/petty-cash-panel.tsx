"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitClosingCash } from "@/lib/actions/expense-actions";

type Stats = {
    openingCash: number;
    cashInBreakdown: {
        drivers: number;
        sales: number;
        dispenser: number;
        total: number;
    };
    spent: number;
    expectedCash: number;
    closingCash: number;
    variance: number;
    isClosed: boolean;
};

export function PettyCashPanel({ stats, isEditable }: { stats: Stats | null, isEditable: boolean }) {
    const [closingInput, setClosingInput] = useState(stats?.closingCash.toString() || "");
    const [isPending, startTransition] = useTransition();

    if (!stats) return <Card><CardContent className="p-6 text-muted-foreground">Petty cash data pending day open.</CardContent></Card>;

    // Real-time calculation feedback
    const userClosing = parseInt(closingInput) || 0;
    const variance = userClosing - stats.expectedCash;

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                await submitClosingCash(userClosing);
                alert("Closing cash submitted!");
            } catch (e) {
                alert("Error: " + e);
            }
        });
    };

    return (
        <Card className="border-2 border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-muted/50 pb-2">
                <CardTitle className="text-lg">Petty Cash Tracking</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Yesterday Closing</span>
                    <span className="font-mono">₦{stats.openingCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Today In (Drivers+Sales+Disp)</span>
                    <span className="font-mono text-green-600">+₦{stats.cashInBreakdown.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Today Out (Expenses)</span>
                    <span className="font-mono text-red-600">-₦{stats.spent.toLocaleString()}</span>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-bold">
                    <span>Expected Cash</span>
                    <span className="font-mono text-lg">₦{stats.expectedCash.toLocaleString()}</span>
                </div>

                <div className="mt-4 space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Actual Closing Cash</label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={closingInput}
                            onChange={e => setClosingInput(e.target.value)}
                            placeholder="Count result..."
                            className="font-mono text-lg"
                            disabled={!isEditable}
                        />
                        <Button onClick={handleSubmit} disabled={isPending || !isEditable}>
                            {isPending ? "Saving..." : "Submit"}
                        </Button>
                    </div>
                </div>

                {/* Variance Display */}
                {userClosing > 0 && (
                    <div className={`p-3 rounded-md text-sm font-bold flex justify-between ${variance === 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        <span>Variance</span>
                        <span>{variance > 0 ? "+" : ""}{variance.toLocaleString()}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
