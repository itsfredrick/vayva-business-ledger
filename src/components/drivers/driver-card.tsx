"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define a type that matches the Prisma include structure we plan to use in the page
type DriverDayWithProfile = {
    id: string;
    driverProfile: { name: string };
    motorBoyName: string | null;
    totalTrips: number;
    totalLoadedBags: number;
    totalSoldBags: number;
    finalReturnBags: number;
    outstandingStartNaira: number;
    outstandingEndNaira: number;
    expectedNaira: number;
    receivedLoggedNaira: number;
    expensesNaira: number;
};

export function DriverCard({ driverDay }: { driverDay: DriverDayWithProfile }) {
    const isHighDebt = driverDay.outstandingEndNaira > 5000;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/40 p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-bold">{driverDay.driverProfile.name}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                            MB: {driverDay.motorBoyName || "N/A"}
                        </div>
                    </div>
                    {isHighDebt && <Badge variant="destructive">High Debt</Badge>}
                </div>
            </CardHeader>
            <CardContent className="p-4 grid gap-4 text-sm">

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        <div className="font-bold text-lg text-blue-700 dark:text-blue-300">{driverDay.totalTrips}</div>
                        <div className="text-xs text-muted-foreground uppercase">Trips</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        <div className="font-bold text-lg text-green-700 dark:text-green-300">{driverDay.totalSoldBags}</div>
                        <div className="text-xs text-muted-foreground uppercase">Sold</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <div className="font-bold text-lg">{driverDay.finalReturnBags}</div>
                        <div className="text-xs text-muted-foreground uppercase">Ret</div>
                    </div>
                </div>

                <Separator />

                {/* Financials */}
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Debt:</span>
                        <span className="font-medium">₦{driverDay.outstandingStartNaira.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span className="">Expected:</span>
                        <span className="font-medium">+₦{driverDay.expectedNaira.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                        <span className="">Received:</span>
                        <span className="font-medium">-₦{driverDay.receivedLoggedNaira.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                        <span className="">Expenses:</span>
                        <span className="font-medium">-₦{driverDay.expensesNaira.toLocaleString()}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>End Debt:</span>
                        <span className={isHighDebt ? "text-red-600" : ""}>₦{driverDay.outstandingEndNaira.toLocaleString()}</span>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
