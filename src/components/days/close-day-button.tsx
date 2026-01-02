"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { closeDayAction } from "@/lib/actions/day-actions";

export function CloseDayButton({ dayId }: { dayId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleClose = () => {
        if (!confirm("Are you sure you want to CLOSE this day? It will become read-only.")) return;
        startTransition(async () => {
            await closeDayAction(dayId);
        });
    };

    return (
        <Button variant="destructive" onClick={handleClose} disabled={isPending}>
            {isPending ? "Closing..." : "Close Day"}
        </Button>
    )
}
