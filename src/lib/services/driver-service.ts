
import { prisma } from "@/lib/prisma";

export class DriverService {
    /**
     * Recomputes all totals, commissions, and outstanding balance for a DriverDay.
     * Use this after any mutation (Trip added, Supplier Delivery, Returns, etc.)
     */
    static async recomputeDay(driverDayId: string) {
        // 1. Fetch all data needed
        const dd = await prisma.driverDay.findUnique({
            where: { id: driverDayId },
            include: {
                trips: true,
                supplierDeliveries: true,
                transferLogs: true,
                day: true
            }
        });

        if (!dd) return;

        // 2. Fetch Settings for Rates
        const settings = await prisma.companySettings.findFirst();
        const retailPrice = settings?.sachetRetailPrice || 350;

        // Snapshot rates if not already set (or always update? Prompt implied forward-only, sticking to current logic)
        // If they are 0, maybe initialize them. If set, keep them? 
        // For simplicity/robustness, we might want to refresh them if the day is still open? 
        // But "forward only" usually means once set, don't change. 
        // Let's rely on what's there if non-zero, else update.
        let driverCommissionRate = dd.driverCommissionRate;
        let motorBoyCommissionRate = dd.motorBoyCommissionRate;

        if (driverCommissionRate === 0) driverCommissionRate = settings?.driverCommissionPerBag || 5;
        if (motorBoyCommissionRate === 0) motorBoyCommissionRate = settings?.motorBoyCommissionPerBag || 3;

        // 3. Aggregations
        const totalLoaded = dd.trips.reduce((sum, t) => sum + t.loadedBags, 0);
        const supplierBags = dd.supplierDeliveries.reduce((sum, s) => sum + s.bags, 0);
        const supplierAmount = dd.supplierDeliveries.reduce((sum, s) => sum + s.amountNaira, 0);

        const finalReturn = dd.finalReturnBags;

        // Normal Bags Logic
        let normalBags = totalLoaded - finalReturn - supplierBags;
        if (normalBags < 0) normalBags = 0;

        const totalSold = supplierBags + normalBags;

        // 4. Financials
        const expectedFromRetail = normalBags * retailPrice;
        const expectedTotal = expectedFromRetail + supplierAmount;

        // Commissions
        const driverComm = normalBags * driverCommissionRate;
        const motorBoyComm = normalBags * motorBoyCommissionRate;

        // Received
        // Only counting valid transfers? For now sum all.
        const transferTotal = dd.transferLogs.reduce((sum, t) => sum + t.amountNaira, 0);
        const expenses = dd.expensesNaira;

        const receivedTotal = dd.cashReceivedNaira + transferTotal;

        // Outstanding
        const outstandingEnd = dd.outstandingStartNaira + expectedTotal - receivedTotal - expenses - driverComm - motorBoyComm;

        // 5. Update Record
        await prisma.driverDay.update({
            where: { id: driverDayId },
            data: {
                totalTrips: dd.trips.length,
                totalLoadedBags: totalLoaded,
                totalSoldBags: totalSold,
                supplierBags: supplierBags,
                normalBags: normalBags,

                expectedNaira: expectedTotal,
                receivedLoggedNaira: receivedTotal,

                driverCommissionNaira: driverComm,
                motorBoyCommissionNaira: motorBoyComm,
                driverCommissionRate: driverCommissionRate,
                motorBoyCommissionRate: motorBoyCommissionRate,

                outstandingEndNaira: outstandingEnd
            }
        });
    }
}
