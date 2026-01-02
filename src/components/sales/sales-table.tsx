"use client";

import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";

type Sale = {
    id: string;
    time: Date;
    customerName: string;
    bags: number;
    pricePerBag: number;
    amountNaira: number;
    paymentType: "CASH" | "TRANSFER" | "MONTHLY";
    gatePassNumber: string | null;
    notes: string | null;
};

export function SalesTable({ sales }: { sales: Sale[] }) {
    const columns = [
        {
            header: "Time",
            className: "w-[100px]",
            cell: (sale: Sale) => <span className="font-mono text-xs">{format(new Date(sale.time), "HH:mm")}</span>
        },
        {
            header: "Customer",
            cell: (sale: Sale) => (
                <div className="flex flex-col">
                    <span className="font-medium">{sale.customerName}</span>
                    {sale.notes && <span className="text-xs text-muted-foreground truncate max-w-[150px]">{sale.notes}</span>}
                </div>
            )
        },
        {
            header: "Gate Pass",
            cell: (sale: Sale) => sale.gatePassNumber ? <Badge variant="outline" className="font-mono text-xs">{sale.gatePassNumber}</Badge> : "-"
        },
        {
            header: "Bags",
            accessorKey: "bags" as keyof Sale,
            className: "text-right"
        },
        {
            header: "Amount",
            className: "text-right",
            cell: (sale: Sale) => <span className="font-medium">{formatCurrency(sale.amountNaira)}</span>
        },
        {
            header: "Payment",
            className: "text-right",
            cell: (sale: Sale) => (
                <Badge variant={sale.paymentType === "CASH" ? "secondary" : "default"}>
                    {sale.paymentType}
                </Badge>
            )
        }
    ];

    return (
        <DataTable
            data={sales}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="No sales recorded today."
        />
    );
}
