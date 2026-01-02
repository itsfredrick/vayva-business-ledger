"use client";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type Delivery = {
    id: string;
    time: Date;
    customer: { name: string, defaultAddress: string | null };
    bottlesDelivered: number;
    bottlesReturned: number;
    amountExpectedNaira: number;
    owingBottles: number;
    paymentType: string;
    notes: string | null;
};

export function DeliveryTable({ deliveries }: { deliveries: Delivery[] }) {
    const columns = [
        {
            header: "Time",
            className: "w-[80px]",
            cell: (d: Delivery) => <span className="font-mono text-xs">{format(new Date(d.time), "HH:mm")}</span>
        },
        {
            header: "Customer",
            cell: (d: Delivery) => (
                <div className="flex flex-col">
                    <span className="font-medium">{d.customer.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{d.customer.defaultAddress}</span>
                </div>
            )
        },
        {
            header: "In / Out",
            className: "text-right font-mono",
            cell: (d: Delivery) => (
                <span>
                    <span className="text-green-600">+{d.bottlesDelivered}</span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className="text-orange-600">-{d.bottlesReturned}</span>
                </span>
            )
        },
        {
            header: "Amount",
            className: "text-right font-medium",
            cell: (d: Delivery) => `₦${d.amountExpectedNaira.toLocaleString()}`
        },
        {
            header: "Pay Type",
            className: "text-right",
            cell: (d: Delivery) => (
                <Badge variant={d.paymentType === "MONTHLY" ? "outline" : "secondary"}>
                    {d.paymentType}
                </Badge>
            )
        },
        {
            header: "Owing Snapshot",
            className: "text-right text-xs text-muted-foreground",
            cell: (d: Delivery) => d.owingBottles > 0 ? `+${d.owingBottles}` : d.owingBottles
        }
    ];

    return (
        <DataTable
            data={deliveries}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="No deliveries recorded today."
        />
    );
}
