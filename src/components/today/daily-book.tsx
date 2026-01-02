
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
        <div className="space-y-4">
            {/* Quick Actions Header */}
            <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
                <h2 className="font-semibold">Daily Book</h2>
                <div className="flex gap-2">
                    <Button size="sm" onClick={onAddDriver} disabled={!isEditable} className="h-8 gap-1">
                        <Plus className="h-3.5 w-3.5" /> Driver
                    </Button>
                    {/* Add other quick actions if needed global */}
                </div>
            </div>

            {/* Drivers List */}
            {drivers.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed py-12 text-center">
                    <p className="text-sm text-muted-foreground">No drivers added for today yet.</p>
                    <Button variant="outline" onClick={onAddDriver} disabled={!isEditable}>Add First Driver</Button>
                </div>
            ) : (
                <Accordion type="multiple" className="w-full">
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
    );
}
