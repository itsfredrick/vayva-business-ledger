
"use client";

import { Money } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

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
        <div className="mt-4 rounded-lg border bg-muted/40 p-4 text-sm">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 sm:grid-cols-4">
                {/* Bags Section */}
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Movement</p>
                    <div className="flex justify-between text-xs">
                        <span>Loaded:</span>
                        <span className="font-medium">{totalLoaded}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span>Returns:</span>
                        <span className="font-medium">{finalReturn}</span>
                    </div>
                    <div className="flex justify-between text-xs text-blue-600">
                        <span>Supplier:</span>
                        <span className="font-medium">{supplierBags}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-bold">
                        <span>Sold:</span>
                        <span>{totalSold}</span>
                    </div>
                </div>

                {/* Expected & Received */}
                <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground">Cash Reconciliation</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-muted-foreground">Expected</div>
                            <div className="font-medium text-foreground"><Money amount={expectedNaira} /></div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Received</div>
                            <div className="font-bold text-green-600"><Money amount={receivedNaira} /></div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Shortfall</div>
                            <div className={`font-medium ${shortfall > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                <Money amount={shortfall} />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Commissions</div>
                            <div className="font-medium text-orange-600"><Money amount={commission} /></div>
                        </div>
                    </div>
                </div>

                {/* Outstanding */}
                <div className="flex flex-col justify-end space-y-1 rounded-sm bg-white p-2 shadow-sm dark:bg-zinc-900">
                    <p className="text-xs font-medium text-muted-foreground">New Balance</p>
                    <div className={`text-lg font-bold ${outstandingEnd > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        <Money amount={outstandingEnd} />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        {outstandingEnd > 0 ? "Driver Owes" : "Company Owes"}
                    </p>
                </div>
            </div>
        </div>
    );
}
