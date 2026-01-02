
import { requireRole } from "@/lib/auth-checks";
import { DayService } from "@/lib/services/day-service";
import { prisma } from "@/lib/prisma";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TodayClient from "@/components/today/today-client";

export const dynamic = 'force-dynamic';

export default async function TodayPage() {
    await requireRole(["OWNER", "STAFF"]);

    const day = await DayService.getOrCreateToday();

    if (!day) {
        return (
            <div className="flex flex-col gap-4 p-8">
                <h1 className="text-2xl font-bold">Today's Overview</h1>
                <Alert>
                    <AlertTitle>No Active Day</AlertTitle>
                    <AlertDescription>Today is likely a Sunday or a holiday. No automatic day record was created.</AlertDescription>
                </Alert>
            </div>
        )
    }

    // Fetch deep data for the day
    const [drivers, officeSales, expenses, allDriverProfiles] = await Promise.all([
        prisma.driverDay.findMany({
            where: { dayId: day.id },
            include: {
                driverProfile: true,
                trips: { orderBy: { departTime: 'asc' } },
                supplierDeliveries: true,
                transferLogs: { orderBy: { claimedAt: 'desc' } }
            },
            orderBy: { driverProfile: { name: 'asc' } }
        }),
        prisma.koolJooOfficeSale.findMany({
            where: { dayId: day.id },
            orderBy: { time: 'desc' }
        }),
        prisma.expense.findMany({
            where: { dayId: day.id },
            orderBy: { time: 'desc' }
        }),
        prisma.driverProfile.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        })
    ]);

    const isEditable = DayService.isEditable(day);

    return (
        <TodayClient
            day={day}
            drivers={drivers}
            officeSales={officeSales}
            expenses={expenses}
            isEditable={isEditable}
            allDriverProfiles={allDriverProfiles}
        />
    );
}
