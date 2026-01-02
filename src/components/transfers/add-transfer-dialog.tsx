"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { logTransfer } from "@/lib/actions/transfer-actions";

export function AddTransferDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [sender, setSender] = useState("");
    const [amount, setAmount] = useState("");
    const [bank, setBank] = useState("");

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                await logTransfer({
                    senderName: sender,
                    amount: parseInt(amount) || 0,
                    bankLabel: bank
                });
                setOpen(false);
                setSender("");
                setAmount("");
                setBank("");
            } catch (e) {
                alert("Error: " + e);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Log Transfer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Log New Transfer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Sender Name</Label>
                        <Input value={sender} onChange={e => setSender(e.target.value)} className="col-span-3" placeholder="Name on bank alert" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Amount</Label>
                        <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Bank</Label>
                        <Input value={bank} onChange={e => setBank(e.target.value)} className="col-span-3" placeholder="e.g. GTBank" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!sender || !amount || isPending}>
                        {isPending ? "Saving..." : "Log Transfer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
