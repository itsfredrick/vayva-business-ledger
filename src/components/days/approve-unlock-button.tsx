"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { approveUnlockAction } from "@/lib/actions/day-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ApproveUnlockButton({ dayId }: { dayId: string }) {
    const [minutes, setMinutes] = useState("30");
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            await approveUnlockAction(dayId, parseInt(minutes));
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Select value={minutes} onValueChange={setMinutes} disabled={isPending}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                    <SelectItem value="120">2 Hours</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleApprove} disabled={isPending}>
                {isPending ? "Approving..." : "Approve Unlock"}
            </Button>
        </div>
    )
}
