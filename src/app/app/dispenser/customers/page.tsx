import { requireRole } from "@/lib/auth-checks";
import { getDispenserCustomers } from "@/lib/actions/dispenser-actions";
import { CustomerList } from "@/components/dispenser/customer-list";
import { CustomerDialog } from "@/components/dispenser/customer-dialog";

export default async function DispenserCustomersPage() {
    await requireRole(["STAFF", "OWNER"]);

    const customers = await getDispenserCustomers();

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">CRM Console</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Dispenser Client Governance & Rate Management</p>
                </div>
                <div>
                    <CustomerDialog />
                </div>
            </div>

            <div className="pt-2">
                <CustomerList customers={customers} />
            </div>
        </div>
    );
}
