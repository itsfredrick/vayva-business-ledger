import { requireRole } from "@/lib/auth-checks";
import { getDispenserDay, getDispenserCustomers } from "@/lib/actions/dispenser-actions";
import { AddDeliveryDialog } from "@/components/dispenser/add-delivery-dialog";
import { DeliveryTable } from "@/components/dispenser/daily-ledger-table";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DispenserPage() {
    await requireRole(["STAFF", "OWNER"]);

    const { deliveries, isEditable } = await getDispenserDay();
    const customers = await getDispenserCustomers();

    // Simple stats for the day
    const totalDelivered = deliveries.reduce((acc, d) => acc + d.bottlesDelivered, 0);
    const totalReturned = deliveries.reduce((acc, d) => acc + d.bottlesReturned, 0);
    const totalAmount = deliveries.reduce((acc, d) => acc + d.amountExpectedNaira, 0);

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
                <div>
                    <h1 className="text-2xl font-bold">Dispenser Delivery</h1>
                    <p className="text-muted-foreground">Daily delivery ledger</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/app/dispenser/customers">
                        <Button variant="outline">Manage Customers</Button>
                    </Link>
                    <Link href="/app/dispenser/billing">
                        <Button variant="outline">Billing & Invoices</Button>
                    </Link>
                    <AddDeliveryDialog customers={customers} isEditable={isEditable} />
                </div>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-100">
                    <div className="text-xs text-muted-foreground uppercase font-bold">Delivered</div>
                    <div className="text-2xl font-bold">{totalDelivered}</div>
                </Card>
                <Card className="p-4 bg-orange-50 dark:bg-orange-900/20 border-orange-100">
                    <div className="text-xs text-muted-foreground uppercase font-bold">Returned</div>
                    <div className="text-2xl font-bold">{totalReturned}</div>
                </Card>

                <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-100">
                    <div className="text-xs text-muted-foreground uppercase font-bold text-green-700">Total Value</div>
                    <div className="text-2xl font-bold text-green-700">₦{totalAmount.toLocaleString()}</div>
                </Card>
            </div>

            <DeliveryTable deliveries={deliveries} />
        </div>
    );
}
