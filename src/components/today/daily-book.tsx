
"use client";

import { DriverDay, Trip, SupplierDelivery, TransferLog, DriverProfile, DayRecord } from "@prisma/client";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button"; // Standard Button
import { Plus } from "lucide-react";
import { DriverAccordion } from "./driver-accordion";

// Extended type (duplicate of accordion type, should share or export)
type ExtendedDriverDay = DriverDay & {
    driverProfile: DriverProfile;
    trips: Trip[];
    supplierDeliveries: SupplierDelivery[];
    transferLogs: TransferLog[];
};

interface DailyBookProps {
    drivers: ExtendedDriverDay[];
    day: DayRecord | null;
    isEditable: boolean;
    // Handlers
    onAddDriver: () => void;
    onAddTrip: (id: string) => void;
    onEditTrip: (trip: Trip) => void;
    onUpdateReturns: (id: string, val: number) => void;
    onAddSupplier: (id: string) => void;
    onUpdateCash: (id: string, val: number) => void;
    onAddTransfer: (id: string) => void;
}

export function DailyBook({
    drivers,
    day,
    isEditable,
    onAddDriver,
    onAddTrip,
    onEditTrip,
    onUpdateReturns,
    onAddSupplier,
    onUpdateCash,
    onAddTransfer
}: DailyBookProps) {
    return (
        <div className="space-y-6">
            {/* Quick Actions Header - Ledger Style */}
            <div className="flex items-center justify-between rounded-t-xl bg-blue-900 px-6 py-4 shadow-lg text-white">
                <div className="flex flex-col">
                    <h2 className="font-bold text-xl tracking-tight">Kool Joo Water Ledger</h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-blue-300">Daily Operations Log</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" onClick={onAddDriver} disabled={!isEditable} className="h-9 gap-1.5 bg-white text-blue-900 hover:bg-blue-50 border-0 font-bold shadow-md">
                        <Plus className="h-4 w-4" /> Add Driver
                    </Button>
                </div>
            </div>

            {/* Drivers List - Notebook Container */}
            <div className="relative min-h-[600px] rounded-b-xl border bg-white shadow-xl overflow-hidden">
                {/* Notebook background pattern (subtle lines) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }} />

                {/* Red ledger line on the left */}
                <div className="absolute left-[3rem] top-0 bottom-0 w-[2px] bg-red-500/20 pointer-events-none" />

                <div className="relative z-10 p-2 sm:p-4">
                    {drivers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-3 py-32 text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 text-blue-200" />
                            </div>
                            <p className="text-sm font-medium text-blue-950/40">No records found for this operational day.</p>
                            <Button variant="outline" onClick={onAddDriver} disabled={!isEditable} className="border-blue-200 text-blue-900 uppercase text-xs font-bold tracking-widest">
                                Initialize First Record
                            </Button>
                        </div>
                    ) : (
                        <Accordion type="multiple" className="w-full space-y-3">
                            {drivers.map(dd => (
                                <DriverAccordion
                                    key={dd.id}
                                    dd={dd}
                                    isEditable={isEditable}
                                    onAddTrip={onAddTrip}
                                    onEditTrip={onEditTrip}
                                    onUpdateReturns={onUpdateReturns}
                                    onAddSupplier={onAddSupplier}
                                    onUpdateCash={onUpdateCash}
                                    onAddTransfer={onAddTransfer}
                                />
                            ))}
                        </Accordion>
                    )}
                </div>
            </div>
        </div>
    );
}
