import { requireRole } from "@/lib/auth-checks";
import { getLicenses } from "@/lib/actions/license-actions";
import { LicenseList } from "@/components/licenses/license-list";
import { AddLicenseDialog } from "@/components/licenses/add-license-dialog";

export default async function LicensesPage() {
    await requireRole(["STAFF", "OWNER"]);
    const licenses = await getLicenses();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Licenses & Permits</h1>
                    <p className="text-muted-foreground">Track government permits and expiration dates.</p>
                </div>
                <div>
                    <AddLicenseDialog />
                </div>
            </div>

            <LicenseList licenses={licenses} />
        </div>
    );
}
