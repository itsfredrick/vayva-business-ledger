import { requireRole } from "@/lib/auth-checks";
import { getLicenses } from "@/lib/actions/license-actions";
import { LicenseList } from "@/components/licenses/license-list";
import { AddLicenseDialog } from "@/components/licenses/add-license-dialog";

export default async function LicensesPage() {
    await requireRole(["STAFF", "OWNER"]);
    const licenses = await getLicenses();

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Regulatory Compliance</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Government Permits & Statutory Validity</p>
                </div>
                <div>
                    <AddLicenseDialog />
                </div>
            </div>

            <div className="pt-2">
                <LicenseList licenses={licenses} />
            </div>
        </div>
    );
}
