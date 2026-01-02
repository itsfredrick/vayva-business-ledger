"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    ChevronRight,
    FilterX,
    Download,
    Search,
    Eye
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function AuditLogsClient({
    initialLogs,
    total,
    metadata,
    filters
}: {
    initialLogs: any[],
    total: number,
    metadata: { entityTypes: string[], actions: string[], users: { id: string, name: string | null }[] },
    filters: { entityType?: string, action?: string, userId?: string, page: number }
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedLog, setSelectedLog] = useState<any>(null);

    function updateFilters(newFilters: Partial<typeof filters>) {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, value.toString());
            else params.delete(key);
        });
        if (newFilters.page === undefined) params.delete("page"); // Reset page on filter change
        router.push(`${pathname}?${params.toString()}`);
    }

    const totalPages = Math.ceil(total / 50);

    const exportToCSV = () => {
        // Simple CSV generation
        const headers = ["Timestamp", "User", "Entity", "Action", "ID", "Reason"];
        const rows = initialLogs.map(log => [
            format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
            log.user.name || "Unknown",
            log.entityType,
            log.action,
            log.entityId || "",
            log.reason || ""
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `audit_log_${format(new Date(), "yyyyMMdd")}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <Card>
                <CardContent className="pt-6 flex flex-wrap gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Entity Type</label>
                        <Select
                            value={filters.entityType || "ALL"}
                            onValueChange={(v) => updateFilters({ entityType: v === "ALL" ? undefined : v })}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Entities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Entities</SelectItem>
                                {metadata.entityTypes.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Action</label>
                        <Select
                            value={filters.action || "ALL"}
                            onValueChange={(v) => updateFilters({ action: v === "ALL" ? undefined : v })}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Actions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Actions</SelectItem>
                                {metadata.actions.map(a => (
                                    <SelectItem key={a} value={a}>{a}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">User</label>
                        <Select
                            value={filters.userId || "ALL"}
                            onValueChange={(v) => updateFilters({ userId: v === "ALL" ? undefined : v })}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Users" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Users</SelectItem>
                                {metadata.users.map(u => (
                                    <SelectItem key={u.id} value={u.id}>{u.name || "Unnamed"}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2 ml-auto">
                        <Button variant="outline" size="icon" onClick={() => router.push(pathname)}>
                            <FilterX className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={exportToCSV}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <div className="relative overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead className="text-right">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No audit logs found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                initialLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">
                                            {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{log.user.name}</span>
                                                <span className="text-xs text-muted-foreground uppercase">{log.user.role}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-mono text-[10px]">
                                                {log.entityType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-sm">{log.action}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Audit Log Details</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 pt-4">
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <p className="font-semibold text-muted-foreground uppercase text-[10px]">Entity Type</p>
                                                                <p>{log.entityType}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-muted-foreground uppercase text-[10px]">Entity ID</p>
                                                                <p className="font-mono text-xs">{log.entityId || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-muted-foreground uppercase text-[10px]">Action</p>
                                                                <p>{log.action}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-muted-foreground uppercase text-[10px]">Timestamp</p>
                                                                <p>{format(new Date(log.timestamp), "PPPPpp")}</p>
                                                            </div>
                                                        </div>

                                                        {log.reason && (
                                                            <div>
                                                                <p className="font-semibold text-muted-foreground uppercase text-[10px]">Reason</p>
                                                                <p className="text-sm bg-muted p-2 rounded">{log.reason}</p>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                                            <div>
                                                                <p className="font-semibold text-muted-foreground uppercase text-[10px] mb-2">Old State</p>
                                                                <pre className="text-xs bg-slate-100 p-2 rounded overflow-auto max-h-[300px]">
                                                                    {log.oldJson ? JSON.stringify(JSON.parse(log.oldJson), null, 2) : "None"}
                                                                </pre>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-muted-foreground uppercase text-[10px] mb-2">New State</p>
                                                                <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded overflow-auto max-h-[300px]">
                                                                    {log.newJson ? JSON.stringify(JSON.parse(log.newJson), null, 2) : "None"}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing page {filters.page} of {totalPages} ({total} logs)
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={filters.page === 1}
                            onClick={() => updateFilters({ page: filters.page - 1 })}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={filters.page === totalPages}
                            onClick={() => updateFilters({ page: filters.page + 1 })}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
