import { requireRole } from "@/lib/auth-checks";
import { getExpensesForReview } from "@/lib/actions/expense-actions";
import { OwnerReviewTable } from "@/components/expenses/owner-review-table";

export default async function ExpensesReviewPage() {
    await requireRole(["OWNER"]);

    const pendingExpenses = await getExpensesForReview();

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Governance Review</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Staff Expenditure Authorization & Auditing</p>
                </div>
            </div>

            <div className="pt-2">
                <OwnerReviewTable expenses={pendingExpenses} />
            </div>
        </div>
    );
}
