
"use client";

import { DriverDay, Trip, SupplierDelivery, TransferLog, DriverProfile } from "@prisma/client";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Money } from "@/lib/format";
import { TripStrip } from "./trip-strip";
import { DriverSummaryBar } from "./driver-summary-bar";
import { MoneyReceivedPanel } from "./money-received-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

// Extended type to include relations
type ExtendedDriverDay = DriverDay & {
    driverProfile: DriverProfile;
    trips: Trip[];
    supplierDeliveries: SupplierDelivery[];
    transferLogs: TransferLog[];
};

interface DriverAccordionProps {
    dd: ExtendedDriverDay;
    isEditable: boolean;
    onAddTrip: (id: string) => void;
    onEditTrip: (trip: Trip) => void;
    onUpdateReturns: (id: string, val: number) => void;
    onAddSupplier: (id: string) => void;
    onUpdateCash: (id: string, val: number) => void;
    onAddTransfer: (id: string) => void;
}

export function DriverAccordion({
    dd,
    isEditable,
    onAddTrip,
    onEditTrip,
    onUpdateReturns,
    onAddSupplier,
    onUpdateCash,
    onAddTransfer
}: DriverAccordionProps) {
    return (
        <AccordionItem value={dd.id} className="border rounded-lg bg-card px-2 mb-2 shadow-sm">
            <AccordionTrigger className="hover:no-underline px-2 py-3">
                <div className="flex w-full items-center justify-between pr-4">
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{dd.driverProfile.name}</span>
                            {dd.motorBoyName && (
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    w/ {dd.motorBoyName}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                            <span>Outstanding Start: <span className="font-mono font-medium text-foreground"><Money amount={dd.outstandingStartNaira} /></span></span>
                            {/* Outstanding End Preview */}
                            <span className={dd.outstandingEndNaira > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                                End: <Money amount={dd.outstandingEndNaira} />
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats Chips (Tablet+) */}
                    <div className="hidden sm:flex gap-2">
                        <Badge variant="outline" className="font-normal">
                            Loaded: {dd.totalLoadedBags}
                        </Badge>
                        <Badge variant="outline" className="font-normal">
                            Sold: {dd.totalSoldBags}
                        </Badge>
                        <Badge variant="secondary" className="font-mono">
                            Exp: <Money amount={dd.expectedNaira} />
                        </Badge>
                        <Badge variant={dd.receivedLoggedNaira >= dd.expectedNaira ? "default" : "destructive"} className="font-mono">
                            Rec: <Money amount={dd.receivedLoggedNaira} />
                        </Badge>
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-2 pb-4 pt-0 space-y-6">

                {/* A) Trip Strip */}
                <TripStrip
                    trips={dd.trips}
                    onAddTrip={() => onAddTrip(dd.id)}
                    onEditTrip={onEditTrip}
                    isEditable={isEditable}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    {/* B & C) Returns & Supplier */}
                    <div className="space-y-4">
                        {/* Final Return */}
                        <div className="flex items-end gap-3 rounded-md border p-3 bg-muted/20">
                            <div className="space-y-1.5 flex-1">
                                <Label className="text-xs font-semibold">Final Return Bags</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={dd.finalReturnBags}
                                    onChange={(e) => onUpdateReturns(dd.id, parseFloat(e.target.value) || 0)}
                                    disabled={!isEditable}
                                    className="h-9 font-mono"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Sold = {dd.totalLoadedBags} (Loaded) - {dd.finalReturnBags} (Ret) - {dd.supplierBags} (Supp)
                                </p>
                            </div>
                        </div>

                        {/* Supplier Deliveries */}
                        <div className="rounded-md border p-3">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="text-xs font-semibold">Supplier Deliveries</h5>
                                {isEditable && (
                                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onAddSupplier(dd.id)}>
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-1">
                                {dd.supplierDeliveries.length === 0 ? (
                                    <p className="text-[10px] text-muted-foreground">None</p>
                                ) : (
                                    dd.supplierDeliveries.map(s => (
                                        <div key={s.id} className="flex justify-between text-xs border-b pb-1 last:border-0">
                                            <span>{s.supplierName} ({s.bags} bags)</span>
                                            <span className="font-mono"><Money amount={s.amountNaira} /></span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* D) Money Received */}
                    <MoneyReceivedPanel
                        cashReceived={dd.cashReceivedNaira}
                        transfers={dd.transferLogs}
                        onCashChange={(val) => onUpdateCash(dd.id, val)}
                        onAddTransfer={() => onAddTransfer(dd.id)}
                        isEditable={isEditable}
                    />
                </div>

                {/* E) Summary Bar */}
                <DriverSummaryBar
                    totalLoaded={dd.totalLoadedBags}
                    finalReturn={dd.finalReturnBags}
                    supplierBags={dd.supplierBags}
                    totalSold={dd.totalSoldBags}
                    expectedNaira={dd.expectedNaira}
                    receivedNaira={dd.receivedLoggedNaira}
                    outstandingEnd={dd.outstandingEndNaira}
                    commission={dd.driverCommissionNaira + dd.motorBoyCommissionNaira}
                />

            </AccordionContent>
        </AccordionItem>
    );
}
