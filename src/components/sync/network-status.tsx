"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { SyncQueueDrawer } from "./sync-queue-drawer";

export function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const pendingCount = useLiveQuery(
        () => db.offlineQueue.where('status').equals('PENDING').count()
    );

    const syncingCount = useLiveQuery(
        () => db.offlineQueue.where('status').equals('SYNCING').count()
    );

    const failedCount = useLiveQuery(
        () => db.offlineQueue.where('status').equals('FAILED').count()
    );

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const hasMessages = !isOnline || (pendingCount && pendingCount > 0) || (failedCount && failedCount > 0) || (syncingCount && syncingCount > 0);

    if (!hasMessages) return null;

    return (
        <>
            <div
                className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setDrawerOpen(true)}
            >
                {!isOnline && (
                    <div className="bg-zinc-900 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10">
                        <WifiOff className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">OFFLINE MODE</span>
                    </div>
                )}

                {(pendingCount || syncingCount) ? (
                    <div className="bg-primary text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Syncing {((pendingCount || 0) + (syncingCount || 0))} records...
                        </span>
                    </div>
                ) : null}

                {failedCount && failedCount > 0 ? (
                    <div className="bg-red-600 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">{failedCount} ERRORS - CLICK TO FIX</span>
                    </div>
                ) : null}
            </div>

            <SyncQueueDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
        </>
    );
}
