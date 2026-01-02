"use client";

import { useTransition, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { reviewExpense } from "@/lib/actions/expense-actions";
import { format } from "date-fns";

type PendingExpense = {
    id: string;
    time: Date;
    whoTookMoney: string;
    category: string;
    amountNaira: number;
    reason: string;
    recordedBy: { name: string };
    day: { date: Date };
};

export function OwnerReviewTable({ expenses }: { expenses: PendingExpense[] }) {
    return (
        <div className="border rounded-md bg-white dark:bg-black">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Receiver / Reason</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                No pending expenses to review.
                            </TableCell>
                        </TableRow>
                    ) : (
                        expenses.map(e => <ReviewRow key={e.id} expense={e} />)
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function ReviewRow({ expense }: { expense: PendingExpense }) {
    const [isPending, startTransition] = useTransition();
    const [queryNote, setQueryNote] = useState("");
    const [queryOpen, setQueryOpen] = useState(false);

    const handleApprove = () => {
        startTransition(async () => {
            try {
                await reviewExpense(expense.id, "APPROVED");
            } catch (e) {
                alert(e);
            }
        });
    };

    const handleQuery = () => {
        startTransition(async () => {
            try {
                await reviewExpense(expense.id, "QUERIED", queryNote);
                setQueryOpen(false);
            } catch (e) {
                alert(e);
            }
        });
    }

    return (
        <TableRow>
            <TableCell>{format(new Date(expense.day.date), "MMM d")}</TableCell>
            <TableCell><Badge variant="outline">{expense.category}</Badge></TableCell>
            <TableCell>
                <div className="font-bold">{expense.whoTookMoney}</div>
                <div className="text-sm text-muted-foreground">{expense.reason}</div>
            </TableCell>
            <TableCell className="text-right font-bold text-red-600">
                ₦{expense.amountNaira.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={handleApprove} disabled={isPending}>
                        <Check className="w-4 h-4" />
                    </Button>

                    <Dialog open={queryOpen} onOpenChange={setQueryOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" disabled={isPending}>
                                <X className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Query Expense</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Textarea
                                    placeholder="Reason for query..."
                                    value={queryNote}
                                    onChange={e => setQueryNote(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="destructive" onClick={handleQuery} disabled={!queryNote || isPending}>
                                    Submit Query
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </TableCell>
        </TableRow>
    )
}
