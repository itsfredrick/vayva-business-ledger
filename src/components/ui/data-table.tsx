"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Column<T> {
    header: string | React.ReactNode;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    isLoading?: boolean;
    stickyHeader?: boolean;
    headerClassName?: string;
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    onRowClick,
    emptyMessage = "No data found",
    isLoading = false,
    stickyHeader = true,
    headerClassName = "",
}: DataTableProps<T>) {
    return (
        <div className="rounded-xl border bg-background overflow-hidden flex flex-col h-full max-h-[600px] shadow-sm">
            <div className="overflow-auto relative">
                <Table>
                    <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm", headerClassName)}>
                        <TableRow className="hover:bg-transparent border-b">
                            {columns.map((col, idx) => (
                                <TableHead key={idx} className={cn("h-12 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/70", col.className)}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm font-medium italic">Loading records...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground italic">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow
                                    key={keyExtractor(item)}
                                    className={cn(
                                        "h-16 border-b last:border-0 transition-colors",
                                        onRowClick && "cursor-pointer hover:bg-muted/30 active:bg-muted/50"
                                    )}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {columns.map((col, idx) => (
                                        <TableCell key={idx} className={cn("px-4 py-3", col.className)}>
                                            {col.cell
                                                ? col.cell(item)
                                                : col.accessorKey
                                                    ? (item[col.accessorKey] as React.ReactNode)
                                                    : null}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
