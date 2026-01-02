import { requireRole } from "@/lib/auth-checks";
import { getUnmatchedItems } from "@/lib/actions/transfer-actions";
import { StatementUploader } from "@/components/transfers/statement-uploader";
import { MatchingWorkspace } from "@/components/transfers/matching-workspace";

export default async function MatchingPage() {
    await requireRole(["OWNER"]);
    const { transfers, statementRows, suggestions } = await getUnmatchedItems();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Reconciliation</h1>
                <p className="text-muted-foreground">Upload bank statements and match transfers.</p>
            </div>

            <StatementUploader />

            <div className="border-t pt-6">
                <MatchingWorkspace
                    transfers={transfers}
                    statementRows={statementRows}
                    suggestions={suggestions}
                />
            </div>
        </div>
    );
}
