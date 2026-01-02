"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOnline) return null; // Only show when offline? Or show simple dot.

    return (
        <div className="flex items-center gap-2 px-4 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 text-xs font-semibold">
            <WifiOff className="h-3 w-3" />
            <span>OFFLINE MODE</span>
        </div>
    );
}
