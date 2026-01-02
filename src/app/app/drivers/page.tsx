import { requireRole } from "@/lib/auth-checks";
import { prisma } from "@/lib/prisma";
import { DayService } from "@/lib/services/day-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import TodayClient from "@/components/today/today-client";

export default async function DriversPage(props: { searchParams: Promise<{ date?: string }> }) {
    const searchParams = await props.searchParams;
    await requireRole(["STAFF", "OWNER"]);

    // Parse date
    let dateObj = new Date();
    if (searchParams.date) {
        dateObj = new Date(searchParams.date);
    } else {
        dateObj.setHours(0, 0, 0, 0);
    }

    // Find Day Record (Don't auto-create for history)
    let day = await prisma.dayRecord.findUnique({
        where: { date: dateObj }
    });

    // If today and missing, trigger getOrCreate (convenience)
    const isToday = dateObj.toDateString() === new Date().toDateString();
    if (!day && isToday) {
        day = await DayService.getOrCreateToday();
    }

    if (!day) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Daily Logs ({dateObj.toLocaleDateString()})</h1>
                    <form action={async (formData) => {
                        "use server";
                        const d = formData.get("date") as string;
                        redirect(`/app/drivers?date=${d}`);
                    }} className="flex gap-2">
                        <Input type="date" name="date" defaultValue={dateObj.toISOString().split('T')[0]} className="w-[160px]" />
                        <Button variant="ghost" size="sm">Go</Button>
                    </form>
                </div>
                <div className="text-center p-20 text-muted-foreground border-2 border-dashed rounded-lg">
                    No records found for this date.
                </div>
            </div>
        );
    }

    // Fetch Deep Data matching TodayPage
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
        prisma.purewaterOfficeSale.findMany({
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
        <div className="flex flex-col">
            {/* Header / Date Nav Overlay */}
            <div className="flex justify-between items-center px-4 pt-4 md:px-8">
                <h1 className="text-xl font-bold opacity-70">Archive: {dateObj.toDateString()}</h1>
                <form action={async (formData) => {
                    "use server";
                    const d = formData.get("date") as string;
                    redirect(`/app/drivers?date=${d}`);
                }} className="flex gap-2">
                    <Input type="date" name="date" defaultValue={dateObj.toISOString().split('T')[0]} className="w-[140px] h-8" />
                    <Button variant="outline" size="sm" className="h-8">Load</Button>
                </form>
            </div>

            {/* Reuse the Notebook Layout */}
            <TodayClient
                day={day}
                drivers={drivers}
                officeSales={officeSales}
                expenses={expenses}
                isEditable={isEditable}
                allDriverProfiles={allDriverProfiles}
            />
        </div>
    );
}
