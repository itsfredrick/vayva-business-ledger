"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { requestUnlockAction } from "@/lib/actions/day-actions";
import { useState } from "react";

export function RequestUnlockDialog({ dayId }: { dayId: string }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = () => {
        startTransition(async () => {
            await requestUnlockAction(dayId, reason);
            setOpen(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Request Unlock</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Day Unlock</DialogTitle>
                    <DialogDescription>
                        This day is closed. Provide a reason to request an unlock from the owner.
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    placeholder="Reason for correction (e.g., forgot to log driver expense)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isPending || !reason}>
                        {isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
