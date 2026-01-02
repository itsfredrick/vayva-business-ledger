import { requireRole } from "@/lib/auth-checks";
import { getDailyExpenses, getPettyCashStats } from "@/lib/actions/expense-actions";
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { PettyCashPanel } from "@/components/expenses/petty-cash-panel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ExpensesPage() {
    await requireRole(["STAFF", "OWNER"]);

    const { expenses, isEditable } = await getDailyExpenses();
    const stats = await getPettyCashStats();

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Expenses</h1>
                    <p className="text-muted-foreground">Daily operational costs & petty cash</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/app/expenses/review">
                        <Button variant="outline">Owner Review</Button>
                    </Link>
                    <AddExpenseDialog isEditable={isEditable} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <ExpenseTable expenses={expenses} />
                </div>
                <div className="h-fit sticky top-6">
                    <PettyCashPanel stats={stats} isEditable={isEditable} />
                </div>
            </div>
        </div>
    );
}
