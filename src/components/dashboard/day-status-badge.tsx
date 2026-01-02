"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { clsx } from "clsx";

export function DayStatusBadge({
    status,
    isOnline = true
}: {
    status?: string | null,
    isOnline?: boolean
}) {
    const displayStatus = status || "CLOSED";
    const isOpen = displayStatus === "OPEN";

    return (
        <div className="flex items-center gap-2 px-4 py-2">
            <span className="text-sm font-medium text-muted-foreground">Status:</span>
            <Badge variant={isOpen ? "default" : "destructive"} className={clsx("uppercase")}>
                {displayStatus}
            </Badge>
        </div>
    );
}
