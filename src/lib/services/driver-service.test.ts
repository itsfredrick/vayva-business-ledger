
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { DriverService } from '@/lib/services/driver-service';

// Use a separate prisma instance or the global one
const prisma = new PrismaClient();

describe('DriverService Integration', () => {
    let dayId: string;
    let driverProfileId: string;
    let driverDayId: string;

    beforeAll(async () => {
        // Cleanup potential conflicts
        const testDate = new Date("2024-01-01"); // Fixed test date
        await prisma.dayRecord.deleteMany({ where: { date: testDate } });

        // Setup: Create Day and Driver Profile
        const day = await prisma.dayRecord.create(
            { data: { date: testDate, status: "OPEN" } }
        );
        dayId = day.id;

        const profile = await prisma.driverProfile.create({ data: { name: 'Test Driver ' + Date.now() } });
        driverProfileId = profile.id;

        // Ensure settings exist
        const settings = await prisma.companySettings.findFirst();
        if (!settings) {
            await prisma.companySettings.create({
                data: {
                    sachetRetailPrice: 350,
                    driverCommissionPerBag: 5,
                    motorBoyCommissionPerBag: 3
                }
            });
        }
    });

    afterAll(async () => {
        // Cleanup
        if (dayId) await prisma.dayRecord.delete({ where: { id: dayId } }).catch(() => { });
        if (driverProfileId) await prisma.driverProfile.delete({ where: { id: driverProfileId } }).catch(() => { });
    });

    it('should correctly compute totals and outstanding', async () => {
        // 1. Create Driver Day
        const dd = await prisma.driverDay.create({
            data: {
                dayId,
                driverProfileId,
                outstandingStartNaira: 1000
            }
        });
        driverDayId = dd.id;

        // 2. Add Trips
        await prisma.trip.create({
            data: { driverDayId, loadedBags: 100, gatePassNumber: 'TEST-GP-1' }
        });
        await prisma.trip.create({
            data: { driverDayId, loadedBags: 50, gatePassNumber: 'TEST-GP-2' }
        });

        // 3. Recompute
        await DriverService.recomputeDay(driverDayId);

        let updated = await prisma.driverDay.findUnique({ where: { id: driverDayId } });
        expect(updated?.totalLoadedBags).toBe(150);
        expect(updated?.totalSoldBags).toBe(150); // No returns/supplier yet
        expect(updated?.expectedNaira).toBe(150 * 350); // 52,500
        expect(updated?.driverCommissionNaira).toBe(150 * 5); // 750
        expect(updated?.outstandingEndNaira).toBe(1000 + 52500 - 0 - 0 - 750 - (150 * 3));
        // 53,500 - 0 - 0 - 750 - 450 = 52,300

        // 4. Add Return & Cash
        await prisma.driverDay.update({
            where: { id: driverDayId },
            data: { finalReturnBags: 10, cashReceivedNaira: 40000 }
        });
        await DriverService.recomputeDay(driverDayId);

        updated = await prisma.driverDay.findUnique({ where: { id: driverDayId } });
        expect(updated?.finalReturnBags).toBe(10);
        expect(updated?.totalSoldBags).toBe(140);
        expect(updated?.expectedNaira).toBe(140 * 350); // 49,000
        expect(updated?.receivedLoggedNaira).toBe(40000);

        // Outstanding: 1000 + 49000 - 40000 - (140*5) - (140*3) 
        // = 50,000 - 40,000 - 700 - 420 = 8,880
        const expEnd = 1000 + (140 * 350) - 40000 - (140 * 5) - (140 * 3);
        expect(updated?.outstandingEndNaira).toBe(expEnd);
    });

    it('should handle supplier deliveries correctly', async () => {
        // Add supplier delivery
        await prisma.supplierDelivery.create({
            data: {
                driverDayId,
                supplierName: 'Mama Supplier',
                bags: 20,
                pricePerBag: 340,
                amountNaira: 6800 // 20 * 340
            }
        });

        await DriverService.recomputeDay(driverDayId);

        const updated = await prisma.driverDay.findUnique({ where: { id: driverDayId } });

        // loaded 150 (from prev test), return 10.
        // Supplier 20.
        // Normal = 150 - 10 - 20 = 120.
        // Sold = 120 + 20 = 140.
        expect(updated?.supplierBags).toBe(20);
        expect(updated?.normalBags).toBe(120);
        expect(updated?.totalSoldBags).toBe(140); // Total delivered to customers

        // Expected: (120 * 350) + (20 * 340) = 42000 + 6800 = 48800
        expect(updated?.expectedNaira).toBe(48800);
    });
});
