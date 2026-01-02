"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, SerializedMutation } from "@/lib/db";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trash2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface SyncQueueDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SyncQueueDrawer({ open, onOpenChange }: SyncQueueDrawerProps) {
    const queue = useLiveQuery(() => db.offlineQueue.orderBy('createdAt').reverse().toArray());

    const handleRetry = async (id: number) => {
        await db.offlineQueue.update(id, { status: "PENDING", error: undefined });
    };

    const handleDelete = async (id: number) => {
        await db.offlineQueue.delete(id);
    };

    const handleClearSuccess = async () => {
        const successes = await db.offlineQueue.where('status').equals('SUCCESS').toArray();
        await db.offlineQueue.bulkDelete(successes.map(s => s.id));
    };

    const pending = queue?.filter(i => i.status === "PENDING" || i.status === "SYNCING") || [];
    const failed = queue?.filter(i => i.status === "FAILED") || [];
    const success = queue?.filter(i => i.status === "SUCCESS") || [];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle>Sync Operations</SheetTitle>
                    <SheetDescription>
                        Manage your offline data and synchronization status.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-auto py-4">
                    <div className="space-y-6">
                        {/* Pending Items */}
                        <section>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                                <span>Pending / Syncing</span>
                                <Badge variant="secondary">{pending.length}</Badge>
                            </h3>
                            <div className="space-y-2">
                                {pending.length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic p-4 text-center border-2 border-dashed rounded-lg">No pending items.</p>
                                ) : (
                                    pending.map(item => (
                                        <QueueItem key={item.id} item={item} onRetry={handleRetry} onDelete={handleDelete} />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Failed Items */}
                        <section>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                                <span className="text-red-600">Failed Records</span>
                                <Badge variant="destructive">{failed.length}</Badge>
                            </h3>
                            <div className="space-y-2">
                                {failed.length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic p-4 text-center border-2 border-dashed rounded-lg">No failures found.</p>
                                ) : (
                                    failed.map(item => (
                                        <QueueItem key={item.id} item={item} onRetry={handleRetry} onDelete={handleDelete} />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Success Items */}
                        <section>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Successfully Synced</h3>
                                <Button variant="ghost" size="sm" onClick={handleClearSuccess} className="h-6 text-[10px]">Clear</Button>
                            </div>
                            <div className="space-y-2">
                                {success.map(item => (
                                    <QueueItem key={item.id} item={item} onRetry={handleRetry} onDelete={handleDelete} />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="p-4 border-t bg-muted/20 -mx-6 mb-[-24px]">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground leading-tight">
                        <AlertCircle className="w-3 h-3" />
                        <p>Changes are saved locally first. If sync fails, you can retry here once you have a stable connection.</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function QueueItem({
    item,
    onRetry,
    onDelete
}: {
    item: SerializedMutation,
    onRetry: (id: number) => void,
    onDelete: (id: number) => void
}) {
    const isSyncing = item.status === "SYNCING";
    const isFailed = item.status === "FAILED";
    const isSuccess = item.status === "SUCCESS";

    return (
        <div className={cn(
            "p-3 rounded-lg border text-sm flex flex-col gap-2 transition-all",
            isSyncing && "border-blue-200 bg-blue-50/30 animate-pulse",
            isFailed && "border-red-200 bg-red-50/50",
            isSuccess && "border-green-100 opacity-60 bg-green-50/20"
        )}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    {isSyncing && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />}
                    {isFailed && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {isSuccess && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {!isSyncing && !isFailed && !isSuccess && <Clock className="w-4 h-4 text-muted-foreground" />}
                    <span className="font-bold tracking-tight">{item.type.replace('_', ' ')}</span>
                </div>
                <div className="flex gap-1">
                    {isFailed && (
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onRetry(item.id)}>
                            <RefreshCw className="w-3.5 h-3.5" />
                        </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-red-500" onClick={() => onDelete(item.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[200px]">
                    ID: {item.id} • {formatDistanceToNow(item.createdAt)} ago
                </p>
                <div className="flex items-center gap-1.5 overflow-hidden">
                    {Object.keys(item.payload).slice(0, 2).map(k => (
                        <span key={k} className="text-[9px] px-1 bg-muted rounded uppercase font-bold text-muted-foreground/60 whitespace-nowrap">
                            {k}
                        </span>
                    ))}
                </div>
            </div>

            {isFailed && item.error && (
                <p className="text-[10px] text-red-600 font-medium italic mt-1 border-t pt-1 border-red-100">
                    Error: {item.error}
                </p>
            )}
        </div>
    );
}
