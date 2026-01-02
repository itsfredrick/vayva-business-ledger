import { requireRole } from "@/lib/auth-checks";
import { getPendingTransfers } from "@/lib/actions/transfer-actions";
import { TransferList } from "@/components/transfers/transfer-list";
import { AddTransferDialog } from "@/components/transfers/add-transfer-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TransfersPage() {
    await requireRole(["STAFF", "OWNER"]);
    const transfers = await getPendingTransfers();

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Bank Confirmation</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Incoming Signal Verification & Clearing</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/app/transfers/matching">
                        <Button variant="ghost" className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 shadow-sm bg-white">
                            Matching Logic
                        </Button>
                    </Link>
                    <AddTransferDialog />
                </div>
            </div>

            <div className="pt-2">
                <TransferList transfers={transfers} />
            </div>
        </div>
    );
}
