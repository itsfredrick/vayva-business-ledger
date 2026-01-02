
"use client";

import { DayRecord, DriverDay, Trip, SupplierDelivery, TransferLog, DriverProfile, KoolJooOfficeSale, Expense } from "@prisma/client";
import { DailyBook } from "@/components/today/daily-book";
import { StickySummary } from "@/components/today/sticky-summary";
import { updateDriverDay } from "@/lib/actions/driver-detail-actions";
import { closeDayAction } from "@/lib/actions/day-actions";
import { toast } from "sonner";
import { useState } from "react";
import { AddTripDialog } from "./dialogs/add-trip-dialog";
import { AddDriverDialog } from "./dialogs/add-driver-dialog";

// Extended types
type ExtendedDriverDay = DriverDay & {
    driverProfile: DriverProfile;
    trips: Trip[];
    supplierDeliveries: SupplierDelivery[];
    transferLogs: TransferLog[];
};

interface TodayClientProps {
    day: DayRecord;
    drivers: ExtendedDriverDay[];
    officeSales: KoolJooOfficeSale[];
    expenses: Expense[];
    isEditable: boolean;
    allDriverProfiles: DriverProfile[];
}

export default function TodayClient({ day, drivers, officeSales, expenses, isEditable, allDriverProfiles }: TodayClientProps) {

    // -- Aggregates for Sticky Summary --
    const pwBags = drivers.reduce((sum, d) => sum + d.totalSoldBags, 0);
    const pwExpected = drivers.reduce((sum, d) => sum + d.expectedNaira, 0);
    const pwReceived = drivers.reduce((sum, d) => sum + d.receivedLoggedNaira, 0);
    const pwOutstanding = drivers.reduce((sum, d) => sum + d.outstandingEndNaira, 0);

    // Mock Dispenser for now
    const dispbottles = 0;
    const dispAmount = 0;

    const officeBags = officeSales.reduce((sum, s) => sum + s.bags, 0);
    const officeAmount = officeSales.reduce((sum, s) => sum + s.amountNaira, 0);

    const expensesTotal = expenses.reduce((sum, e) => sum + e.amountNaira, 0);

    const cashInHand = pwReceived + officeAmount;

    // -- Dialog State --
    const [addTripId, setAddTripId] = useState<string | null>(null);
    const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
            {/* Dialogs */}
            <AddTripDialog
                open={!!addTripId}
                onOpenChange={(v) => !v && setAddTripId(null)}
                driverDayId={addTripId}
            />
            <AddDriverDialog
                open={isAddDriverOpen}
                onOpenChange={setIsAddDriverOpen}
                dayId={day.id}
                profiles={allDriverProfiles}
            />

            {/* Left Column: Daily Book (Grow) */}
            <div className="flex-1 min-w-0">
                <DailyBook
                    drivers={drivers}
                    day={day}
                    isEditable={isEditable}
                    onAddDriver={() => setIsAddDriverOpen(true)}
                    onAddTrip={(id) => setAddTripId(id)}
                    onEditTrip={(trip) => toast.info("Edit Trip not implemented yet")}
                    onUpdateReturns={async (id, val) => {
                        try {
                            await updateDriverDay(id, { finalReturnBags: val });
                            toast.success("Updated returns");
                        } catch (e) {
                            toast.error("Failed to update returns", { description: String(e) });
                        }
                    }}
                    onAddSupplier={(id) => toast.info("Add Supplier not implemented yet")}
                    onUpdateCash={async (id, val) => {
                        try {
                            await updateDriverDay(id, { cashReceivedNaira: val });
                        } catch (e) {
                            toast.error("Failed to update cash", { description: String(e) });
                        }
                    }}
                    onAddTransfer={(id) => toast.info("Add Transfer not implemented yet")}
                />
            </div>

            {/* Right Column: Sticky Summary (Fixed width) */}
            <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0">
                <StickySummary
                    pwBags={pwBags}
                    pwExpected={pwExpected}
                    pwReceived={pwReceived}
                    pwOutstanding={pwOutstanding}
                    dispbottles={dispbottles}
                    dispAmount={dispAmount}
                    officeBags={officeBags}
                    officeAmount={officeAmount}
                    expensesTotal={expensesTotal}
                    cashInHand={cashInHand}
                    dayStatus={day.status}
                    isEditable={isEditable}
                    onCloseDay={async () => {
                        if (confirm("Close day?")) await closeDayAction(day.id);
                    }}
                    onRequestUnlock={() => toast.info("Unlock Flow not implemented yet")}
                    onAddOfficeSale={() => toast.info("Office Sale not implemented yet")}
                    onAddExpense={() => toast.info("Expense Log not implemented yet")}
                    onAddDispenser={() => toast.info("Dispenser not implemented yet")}
                />
            </div>
        </div>
    );
}
