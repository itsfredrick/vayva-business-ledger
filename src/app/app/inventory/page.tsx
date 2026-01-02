import { requireRole } from "@/lib/auth-checks";
import { getInventoryDay } from "@/lib/actions/inventory-actions";
import { InventoryDashboard } from "@/components/inventory/inventory-dashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function InventoryPage() {
    await requireRole(["STAFF", "OWNER"]);

    const { inventory, isEditable } = await getInventoryDay();

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Stock Control</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Daily Production & Reconciliation</p>
                </div>
                <div>
                    <Link href="/app/inventory/review">
                        <Button variant="ghost" className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 shadow-sm bg-white">
                            Governance Review
                        </Button>
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
