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
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Unlock Requests</h1>

            {pendingRequests.length === 0 ? (
                <p className="text-muted-foreground">No pending unlock requests.</p>
            ) : (
                <div className="grid gap-4">
                    {pendingRequests.map((day) => (
                        <Card key={day.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>Day: {day.date.toDateString()}</CardTitle>
                                    <Badge variant="outline">Closed</Badge>
                                </div>
                                <CardDescription>Requested by {day.unlockRequestedBy?.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm font-medium">Reason:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 bg-muted p-2 rounded mt-1">
                                    "{day.unlockRequestReason}"
                                </p>
                            </CardContent>
                            <CardFooter>
                                <ApproveUnlockButton dayId={day.id} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
