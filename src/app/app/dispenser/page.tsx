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
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1600px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Fleet Logistics</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Daily Dispenser Water Distributions</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Link href="/app/dispenser/customers">
                        <Button variant="ghost" className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 shadow-sm bg-white">
                            CRM Console
                        </Button>
                    </Link>
                    <Link href="/app/dispenser/billing">
                        <Button variant="ghost" className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 shadow-sm bg-white">
                            Financial Yields
                        </Button>
                    </Link>
                    <AddDeliveryDialog customers={customers} isEditable={isEditable} />
                </div>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-8 rounded-[32px] bg-blue-50/50 ring-1 ring-blue-200 flex flex-col justify-between h-40">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Bottles Dispatched</p>
                    <div className="text-4xl font-black text-blue-950 tracking-tighter">{totalDelivered} <span className="text-xs font-bold opacity-40 italic">Dispensed</span></div>
                </div>

                <div className="p-8 rounded-[32px] bg-orange-50/50 ring-1 ring-orange-200 flex flex-col justify-between h-40">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Returns Logged</p>
                    <div className="text-4xl font-black text-orange-900 tracking-tighter">{totalReturned} <span className="text-xs font-bold opacity-40 italic">Empty</span></div>
                </div>

                <div className="p-8 rounded-[32px] bg-emerald-50/50 ring-1 ring-emerald-200 flex flex-col justify-between h-40">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Settlement Value</p>
                    <div className="text-4xl font-black text-emerald-900 tracking-tighter tabular-nums">₦{totalAmount.toLocaleString()}</div>
                </div>
            </div>

            <div className="pt-2">
                <DeliveryTable deliveries={deliveries} />
            </div>
        </div>
    );
}
