import { requireRole } from "@/lib/auth-checks";
import { prisma } from "@/lib/prisma";
import { ApproveUnlockButton } from "@/components/days/approve-unlock-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function UnlockRequestsPage() {
    await requireRole(["OWNER"]);

    // Fetch Closed days with pending requests (unlockRequestReason set, but unlockWindowUntil not set or expired)
    // Actually, if unlockWindowUntil is set and future, it's approved. 
    // If it is NOT set, or past, and reason is present, it's pending (or expired/re-locked).
    // Let's simpler logic: Find days where unlockRequestReason IS NOT NULL and (unlockWindowUntil IS NULL OR unlockWindowUntil < NOW)

    const pendingRequests = await prisma.dayRecord.findMany({
        where: {
            status: "CLOSED",
            unlockRequestReason: { not: null },
            OR: [
                { unlockWindowUntil: null },
                { unlockWindowUntil: { lte: new Date() } }
            ]
        },
        include: {
            unlockRequestedBy: true
        },
        orderBy: { date: 'desc' }
    });

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Access Governance</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Data Sovereignty & Ledger Integrity Overrides</p>
                </div>
            </div>

            {pendingRequests.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">No active signals found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingRequests.map((day) => (
                        <div key={day.id} className="bg-white rounded-[40px] p-8 ring-1 ring-slate-100 shadow-sm flex flex-col justify-between group hover:ring-blue-200 transition-all duration-500">
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Locked Period</p>
                                        <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight italic">{day.date.toDateString()}</h3>
                                    </div>
                                    <Badge variant="outline" className="h-6 rounded-lg px-2 font-black text-[10px] uppercase tracking-widest border-slate-200 text-slate-400">
                                        SECURE_LOCK
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Solicitor</p>
                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{day.unlockRequestedBy?.name}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Justification</p>
                                    <p className="text-xs font-bold text-slate-500 italic bg-slate-50 p-4 rounded-2xl leading-relaxed ring-1 ring-slate-100/50">
                                        "{day.unlockRequestReason}"
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <ApproveUnlockButton dayId={day.id} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
