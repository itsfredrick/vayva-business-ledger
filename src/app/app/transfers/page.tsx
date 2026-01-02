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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Transfers</h1>
                    <p className="text-muted-foreground">Log incoming transfers for verification.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/app/transfers/matching">
                        <Button variant="outline">Matching Dashboard</Button>
                    </Link>
                    <AddTransferDialog />
                </div>
            </div>

            <TransferList transfers={transfers} />
        </div>
    );
}
