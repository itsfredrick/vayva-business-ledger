import { requireRole } from "@/lib/auth-checks";
import { getDispenserCustomers } from "@/lib/actions/dispenser-actions";
import { CustomerList } from "@/components/dispenser/customer-list";
import { CustomerDialog } from "@/components/dispenser/customer-dialog";

export default async function DispenserCustomersPage() {
    await requireRole(["STAFF", "OWNER"]);

    const customers = await getDispenserCustomers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Dispenser Customers</h1>
                    <p className="text-muted-foreground">Manage customer profiles and rates</p>
                </div>
                <div>
                    <CustomerDialog />
                </div>
            </div>

            <CustomerList customers={customers} />
        </div>
    );
}
