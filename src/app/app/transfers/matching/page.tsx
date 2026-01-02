import { requireRole } from "@/lib/auth-checks";
import { getUnmatchedItems } from "@/lib/actions/transfer-actions";
import { StatementUploader } from "@/components/transfers/statement-uploader";
import { MatchingWorkspace } from "@/components/transfers/matching-workspace";

export default async function MatchingPage() {
    await requireRole(["OWNER"]);
    const { transfers, statementRows, suggestions } = await getUnmatchedItems();

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1600px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Matching Logic</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Bank Reconciliation & Signal Synthesis Workspace</p>
                </div>
            </div>

            <div className="pt-4 space-y-12">
                <StatementUploader />

                <div className="pt-10 border-t border-slate-100">
                    <MatchingWorkspace
                        transfers={transfers}
                        statementRows={statementRows}
                        suggestions={suggestions}
                    />
                </div>
            </div>
        </div>
    );
}
