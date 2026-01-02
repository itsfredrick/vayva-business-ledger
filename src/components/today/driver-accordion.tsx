
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
import { clsx } from "clsx";

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
        <AccordionItem value={dd.id} className="border-0 border-b border-blue-100 bg-transparent px-0 mb-0 rounded-none overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-4 py-5 hover:bg-blue-50/50 transition-colors">
                <div className="flex w-full items-center justify-between pr-4">
                    <div className="text-left pl-10 border-l-[3px] border-blue-500/50">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-xl text-blue-950 tracking-tight">{dd.driverProfile.name}</span>
                            {dd.motorBoyName && (
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
                                    Member: {dd.motorBoyName}
                                </span>
                            )}
                        </div>
                        <div className="text-xs font-medium text-slate-500 mt-1 flex gap-4">
                            <span className="flex items-center gap-1">Start: <span className="font-mono text-slate-900 bg-slate-100 px-1.5 rounded"><Money amount={dd.outstandingStartNaira} /></span></span>
                            <span className={clsx("flex items-center gap-1 font-bold", dd.outstandingEndNaira > 0 ? "text-red-500" : "text-green-600")}>
                                Closing: <Money amount={dd.outstandingEndNaira} />
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
