"use client";

import { useTransition, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateDriverDay } from "@/lib/actions/driver-detail-actions";

type DriverDaySummary = {
    id: string;
    totalTrips: number;
    totalLoadedBags: number;
    totalSoldBags: number;
    supplierBags: number;
    normalBags: number;
    finalReturnBags: number;

    expectedNaira: number;
    receivedLoggedNaira: number;
    cashReceivedNaira: number;

    outstandingStartNaira: number;
    outstandingEndNaira: number;

    driverCommissionNaira: number;
    motorBoyCommissionNaira: number;
    driverCommissionRate: number;
    motorBoyCommissionRate: number;

    expensesNaira: number;
};

export function SummarySection({ data, isEditable }: { data: DriverDaySummary, isEditable: boolean }) {
    const [isPending, startTransition] = useTransition();

    // Local state for immediate feedback on inputs, strictly syncing with prop on updates
    const [finalReturn, setFinalReturn] = useState(data.finalReturnBags.toString());
    const [cashReceived, setCashReceived] = useState(data.cashReceivedNaira.toString());

    useEffect(() => {
        setFinalReturn(data.finalReturnBags.toString());
        setCashReceived(data.cashReceivedNaira.toString());
    }, [data.finalReturnBags, data.cashReceivedNaira]);

    const handleUpdate = () => {
        startTransition(async () => {
            await updateDriverDay(data.id, {
                finalReturnBags: parseInt(finalReturn) || 0,
                cashReceivedNaira: parseFloat(cashReceived) || 0
            });
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/20 rounded-lg">

            {/* Inputs Section */}
            <div className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="finalReturn">Final Return Bags</Label>
                    <div className="flex gap-2">
                        <Input
                            id="finalReturn"
                            type="number"
                            value={finalReturn}
                            onChange={e => setFinalReturn(e.target.value)}
                            disabled={!isEditable}
                        />
                        {isEditable && (
                            <Button onClick={handleUpdate} disabled={isPending} variant="secondary">
                                Update
                            </Button>
                        )}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="cashReceived">Cash Received (₦)</Label>
                    <div className="flex gap-2">
                        <Input
                            id="cashReceived"
                            type="number"
                            value={cashReceived}
                            onChange={e => setCashReceived(e.target.value)}
                            disabled={!isEditable}
                        />
                        {isEditable && (
                            <Button onClick={handleUpdate} disabled={isPending} variant="secondary">
                                Update
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="space-y-2 text-sm bg-white dark:bg-black p-4 rounded shadow-sm border">
                <div className="flex justify-between font-medium text-lg border-b pb-2 mb-2">
                    <span>Financial Summary</span>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="text-muted-foreground">Total Loaded</div>
                    <div className="text-right font-mono">{data.totalLoadedBags}</div>

                    <div className="text-muted-foreground">Final Return</div>
                    <div className="text-right font-mono text-red-500">-{data.finalReturnBags}</div>

                    <div className="text-muted-foreground">Supplier Bags</div>
                    <div className="text-right font-mono text-blue-500">-{data.supplierBags}</div>

                    <div className="font-semibold pt-1 border-t">Normal Sold</div>
                    <div className="text-right font-mono font-bold pt-1 border-t">{data.normalBags}</div>
                </div>

                <Separator className="my-2" />

                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex justify-between col-span-2 text-xs text-muted-foreground">
                        <span>Commission Rates:</span>
                        <span>Dr: ₦{data.driverCommissionRate} / MB: ₦{data.motorBoyCommissionRate}</span>
                    </div>

                    <div className="text-muted-foreground">Driver Comm</div>
                    <div className="text-right font-mono text-green-600">-₦{data.driverCommissionNaira.toLocaleString()}</div>

                    <div className="text-muted-foreground">MB Comm</div>
                    <div className="text-right font-mono text-green-600">-₦{data.motorBoyCommissionNaira.toLocaleString()}</div>
                </div>

                <Separator className="my-2" />

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-medium">
                    <div className="">Start Debt</div>
                    <div className="text-right text-red-600">₦{data.outstandingStartNaira.toLocaleString()}</div>

                    <div className="">Expected Income</div>
                    <div className="text-right text-green-600">+₦{data.expectedNaira.toLocaleString()}</div>

                    <div className="">Total Received</div>
                    <div className="text-right text-blue-600">-₦{data.receivedLoggedNaira.toLocaleString()}</div>

                    <div className="">Expenses</div>
                    <div className="text-right text-orange-600">-₦{data.expensesNaira.toLocaleString()}</div>
                </div>

                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 rounded mt-2">
                    <span className="font-bold text-lg">Outstanding End</span>
                    <span className={`font-bold text-xl ${data.outstandingEndNaira > 5000 ? 'text-red-600' : 'text-green-600'}`}>
                        ₦{data.outstandingEndNaira.toLocaleString()}
                    </span>
                </div>

            </div>
        </div>
    );
}
