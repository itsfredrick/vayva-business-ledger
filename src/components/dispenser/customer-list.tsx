"use client";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { CustomerDialog } from "./customer-dialog";

type Customer = {
    id: string;
    name: string;
    phone: string | null;
    defaultAddress: string | null;
    billingMode: "PER_DELIVERY" | "MONTHLY";
    defaultRatePerBottle: number;
    owingBottles: number;
    isActive: boolean;
};

export function CustomerList({ customers }: { customers: Customer[] }) {
    const columns = [
        {
            header: "Name",
            cell: (c: Customer) => (
                <div className="flex flex-col">
                    <span className="font-medium">{c.name}</span>
                    {c.phone && <span className="text-xs text-muted-foreground">{c.phone}</span>}
                </div>
            )
        },
        {
            header: "Address",
            cell: (c: Customer) => <span className="text-sm">{c.defaultAddress || "-"}</span>
        },
        {
            header: "Billing",
            cell: (c: Customer) => <Badge variant="outline">{c.billingMode}</Badge>
        },
        {
            header: "Rate",
            cell: (c: Customer) => `₦${c.defaultRatePerBottle}`
        },
        {
            header: "Bottles Owed",
            className: "text-right font-bold",
            cell: (c: Customer) => <span className={c.owingBottles > 0 ? "text-red-500" : ""}>{c.owingBottles}</span>
        },
        {
            header: "",
            className: "w-[50px]",
            cell: (c: Customer) => <CustomerDialog customer={c} />
        }
    ];

    return (
        <DataTable
            data={customers}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="No customers found."
        />
    );
}
