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
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1600px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Operational Costs</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Daily Expenses & Petty Cash Governance</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/app/expenses/review">
                        <Button variant="ghost" className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 shadow-sm bg-white">
                            Governance Review
                        </Button>
                    </Link>
                    <AddExpenseDialog isEditable={isEditable} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <ExpenseTable expenses={expenses} />
                </div>
                <div className="h-fit lg:sticky lg:top-8">
                    <PettyCashPanel stats={stats} isEditable={isEditable} />
                </div>
            </div>
        </div>
    );
}
