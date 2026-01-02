
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
            {/* Quick Actions Header - Premium Style */}
            <div className="flex items-center justify-between rounded-[32px] bg-blue-900 px-8 py-6 shadow-[0_20px_40px_-15px_rgba(30,58,138,0.4)] text-white overflow-hidden relative">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />

                <div className="flex flex-col relative z-10">
                    <h2 className="font-black text-2xl tracking-tighter leading-tight">DAILY LOG</h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-400">Ledger Management System</p>
                </div>
                <div className="flex gap-2 relative z-10">
                    <Button size="lg" onClick={onAddDriver} disabled={!isEditable} className="h-12 px-6 gap-2 bg-white text-blue-900 hover:bg-white/90 border-0 font-black rounded-2xl shadow-xl active:scale-95 transition-all">
                        <Plus className="h-5 w-5" /> Add Driver Entry
                    </Button>
                </div>
            </div>

            {/* Drivers List - Premium Notebook Container */}
            <div className="relative min-h-[600px] rounded-[40px] border-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 overflow-hidden">
                {/* Notebook background pattern (subtle lines) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 3rem' }} />

                {/* Red ledger line on the left */}
                <div className="absolute left-[3.5rem] top-0 bottom-0 w-[2px] bg-red-500/10 pointer-events-none" />

                <div className="relative z-10 p-6 md:p-8">
                    {drivers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-32 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-4">
                                <Plus className="w-10 h-10 text-blue-200" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-blue-950 tracking-tight">Sheet Is Empty</h3>
                                <p className="text-sm font-medium text-slate-400 max-w-[240px]">Initialize the daily log by adding your first driver entry.</p>
                            </div>
                            <Button variant="outline" onClick={onAddDriver} disabled={!isEditable} className="h-11 border-blue-100 text-blue-600 rounded-xl px-8 uppercase text-[10px] font-black tracking-widest hover:bg-blue-50">
                                Initialize Operational Day
                            </Button>
                        </div>
                    ) : (
                        <Accordion type="multiple" className="w-full space-y-4">
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
