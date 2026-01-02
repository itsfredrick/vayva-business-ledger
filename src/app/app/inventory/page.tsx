import { requireRole } from "@/lib/auth-checks";
import { getInventoryDay } from "@/lib/actions/inventory-actions";
import { InventoryDashboard } from "@/components/inventory/inventory-dashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function InventoryPage() {
    await requireRole(["STAFF", "OWNER"]);

    const { inventory, isEditable } = await getInventoryDay();

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Inventory</h1>
                    <p className="text-muted-foreground">Daily stock production & reconciliation</p>
                </div>
                <div>
                    <Link href="/app/inventory/review">
                        <Button variant="outline">Owner Review</Button>
                    </Link>
                </div>
            </div>

            {inventory ? (
                <InventoryDashboard data={inventory} isEditable={isEditable} />
            ) : (
                <div className="p-12 text-center border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">Day is not open. Please open the day to manage inventory.</p>
                </div>
            )}
        </div>
    );
}
