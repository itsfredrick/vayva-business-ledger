"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type Expense = {
    id: string;
    time: Date;
    whoTookMoney: string;
    category: string;
    amountNaira: number;
    reason: string;
    recordedBy: { name: string };
    ownerReviewedStatus: string;
};

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
    const columns = [
        {
            header: "Time",
            className: "w-[80px]",
            cell: (e: Expense) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(e.time), "HH:mm")}</span>
        },
        {
            header: "Category",
            className: "hidden sm:table-cell",
            cell: (e: Expense) => <Badge variant="outline">{e.category}</Badge>
        },
        {
            header: "Receiver",
            cell: (e: Expense) => (
                <div className="flex flex-col">
                    <span className="font-medium">{e.whoTookMoney}</span>
                    <span className="text-xs text-muted-foreground sm:hidden">{e.category}</span>
                </div>
            )
        },
        {
            header: "Reason",
            className: "hidden md:table-cell max-w-[200px]",
            cell: (e: Expense) => <span className="truncate block text-muted-foreground">{e.reason}</span>
        },
        {
            header: "Amount",
            className: "text-right",
            cell: (e: Expense) => <span className="font-medium text-red-600">-{formatCurrency(e.amountNaira)}</span>
        },
        {
            header: "Proof",
            className: "text-center",
            cell: (e: any) => e.receiptUrl ? (
                <a
                    href={e.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 px-3 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                >
                    Receipt
                </a>
            ) : <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Missing</span>
        },
        {
            header: "Status",
            className: "text-right w-[100px]",
            cell: (e: Expense) => {
                if (e.ownerReviewedStatus === "PENDING") return <Badge variant="secondary" className="text-[10px]">Pending</Badge>;
                if (e.ownerReviewedStatus === "APPROVED") return <Badge className="bg-green-600 text-[10px]">Approved</Badge>;
                if (e.ownerReviewedStatus === "QUERIED") return <Badge variant="destructive" className="text-[10px]">Queried</Badge>;
                return null;
            }
        }
    ];

    return (
        <DataTable
            data={expenses}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="No expenses recorded today."
        />
    );
}
