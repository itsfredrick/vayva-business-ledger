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
        <div className="flex flex-col min-h-screen">
            {/* Header / Date Nav Overlay */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 px-6 pt-12 md:px-12 pb-6 border-b border-blue-50">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter text-blue-950 uppercase leading-none">Sequence Archive</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">{dateObj.toDateString()}</p>
                </div>

                <form action={async (formData) => {
                    "use server";
                    const d = formData.get("date") as string;
                    redirect(`/app/drivers?date=${d}`);
                }} className="flex items-center gap-3 bg-white p-2 rounded-2xl ring-1 ring-slate-100 shadow-sm self-start md:self-auto">
                    <Input
                        type="date"
                        name="date"
                        defaultValue={dateObj.toISOString().split('T')[0]}
                        className="w-[160px] h-10 border-none bg-slate-50 font-black text-xs rounded-xl focus-visible:ring-blue-500"
                    />
                    <Button variant="ghost" className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-all">
                        Locate Ledger
                    </Button>
                </form>
            </div>

            {/* Reuse the Notebook Layout */}
            <div className="px-6 md:px-12 py-10 bg-slate-50/30 flex-1">
                <TodayClient
                    day={day}
                    drivers={drivers}
                    officeSales={officeSales}
                    expenses={expenses}
                    isEditable={isEditable}
                    allDriverProfiles={allDriverProfiles}
                />
            </div>
        </div>
    );
}
