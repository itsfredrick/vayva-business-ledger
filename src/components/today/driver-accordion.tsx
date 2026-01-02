
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
        <AccordionItem value={dd.id} className="border-0 bg-transparent mb-4 overflow-hidden group">
            <AccordionTrigger className="hover:no-underline px-6 py-6 transition-all bg-white hover:bg-slate-50 rounded-[28px] ring-1 ring-slate-100 shadow-sm data-[state=open]:shadow-lg data-[state=open]:ring-blue-100 data-[state=open]:rounded-b-none">
                <div className="flex w-full items-center justify-between pr-4">
                    <div className="text-left flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <span className="font-black text-blue-600 group-hover:text-white uppercase transition-colors">{dd.driverProfile.name?.[0]}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="font-black text-xl text-blue-950 tracking-tighter">{dd.driverProfile.name.toUpperCase()}</span>
                                {dd.motorBoyName && (
                                    <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg uppercase tracking-widest border border-blue-100">
                                        {dd.motorBoyName}
                                    </span>
                                )}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1 flex gap-6">
                                <span className="flex items-center gap-1 uppercase tracking-widest italic opacity-70">Starting Debt: <span className="font-mono text-slate-600 bg-slate-100 px-1.5 rounded-md"><Money amount={dd.outstandingStartNaira} /></span></span>
                                <span className={clsx("flex items-center gap-1 font-black uppercase tracking-widest", dd.outstandingEndNaira > 0 ? "text-red-500" : "text-green-600")}>
                                    Closing Gear: <Money amount={dd.outstandingEndNaira} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Chips (Tablet+) */}
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sold / Loaded</span>
                            <div className="font-black text-blue-950 text-sm">{dd.totalSoldBags} / {dd.totalLoadedBags}</div>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-100 mx-2" />
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expected</span>
                            <div className="font-black text-blue-950/40 text-sm tabular-nums"><Money amount={dd.expectedNaira} /></div>
                        </div>
                        <div className="flex flex-col items-end pl-4">
                            <Badge variant={dd.receivedLoggedNaira >= dd.expectedNaira ? "default" : "destructive"} className="font-black tabular-nums h-7 px-3 rounded-lg text-[10px]">
                                REC: <Money amount={dd.receivedLoggedNaira} />
                            </Badge>
                        </div>
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-8 pb-8 pt-8 space-y-8 bg-white ring-1 ring-blue-100 rounded-b-[28px] shadow-lg">

                {/* A) Trip Strip */}
                <TripStrip
                    trips={dd.trips}
                    onAddTrip={() => onAddTrip(dd.id)}
                    onEditTrip={onEditTrip}
                    isEditable={isEditable}
                />

                <div className="grid gap-10 md:grid-cols-2">
                    {/* B & C) Returns & Supplier */}
                    <div className="space-y-6">
                        {/* Final Return */}
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black text-blue-950 uppercase tracking-[0.2em] opacity-60">Final Return Verification</Label>
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50/30 ring-1 ring-blue-50">
                                <Input
                                    type="number"
                                    min="0"
                                    value={dd.finalReturnBags}
                                    onChange={(e) => onUpdateReturns(dd.id, parseFloat(e.target.value) || 0)}
                                    disabled={!isEditable}
                                    className="h-12 font-black text-xl text-blue-900 border-none bg-white rounded-xl shadow-inner focus-visible:ring-blue-500 w-32"
                                />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Counted Bags</p>
                                    <p className="text-[9px] text-blue-600/60 font-medium italic">
                                        Sold = {dd.totalLoadedBags} (Load) - {dd.finalReturnBags} (Ret) - {dd.supplierBags} (Supp)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Supplier Deliveries */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-black text-blue-950 uppercase tracking-[0.2em] opacity-60">Supplier Direct Loads</Label>
                                {isEditable && (
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50" onClick={() => onAddSupplier(dd.id)}>
                                        + Record New
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {dd.supplierDeliveries.length === 0 ? (
                                    <div className="p-4 rounded-xl border border-dashed text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">No Direct Deliveries</div>
                                ) : (
                                    dd.supplierDeliveries.map(s => (
                                        <div key={s.id} className="flex justify-between items-center p-3 px-4 bg-white ring-1 ring-slate-100 rounded-xl">
                                            <span className="text-xs font-bold text-slate-600">{s.supplierName} <span className="text-blue-600 text-[10px] ml-1">({s.bags} bags)</span></span>
                                            <span className="font-black text-blue-950 tabular-nums"><Money amount={s.amountNaira} /></span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* D) Money Received */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black text-blue-950 uppercase tracking-[0.2em] opacity-60 italic">Collections & Payments</Label>
                        <MoneyReceivedPanel
                            cashReceived={dd.cashReceivedNaira}
                            transfers={dd.transferLogs}
                            onCashChange={(val) => onUpdateCash(dd.id, val)}
                            onAddTransfer={() => onAddTransfer(dd.id)}
                            isEditable={isEditable}
                        />
                    </div>
                </div>

                {/* E) Summary Bar */}
                <div className="pt-2">
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
                </div>

            </AccordionContent>
        </AccordionItem>
    );
}
