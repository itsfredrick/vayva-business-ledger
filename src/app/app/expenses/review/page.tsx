import { requireRole } from "@/lib/auth-checks";
import { getExpensesForReview } from "@/lib/actions/expense-actions";
import { OwnerReviewTable } from "@/components/expenses/owner-review-table";

export default async function ExpensesReviewPage() {
    await requireRole(["OWNER"]);

    const pendingExpenses = await getExpensesForReview();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Expense Review</h1>
                <p className="text-muted-foreground">Approve or query staff expenses.</p>
            </div>

            <OwnerReviewTable expenses={pendingExpenses} />
        </div>
    );
}
