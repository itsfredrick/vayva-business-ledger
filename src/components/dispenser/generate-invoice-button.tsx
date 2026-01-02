"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { generateInvoice } from "@/lib/actions/dispenser-actions";
import { FileText } from "lucide-react";

export function GenerateInvoiceButton({ customerId, deliveryIds, disabled }: { customerId: string, deliveryIds: string[], disabled: boolean }) {
    const [isPending, startTransition] = useTransition();

    return (
        <Button
            disabled={disabled || isPending}
            onClick={() => {
                startTransition(async () => {
                    try {
                        await generateInvoice(customerId, deliveryIds);
                        alert("Invoice generated!");
                    } catch (e) {
                        alert("Error: " + e);
                    }
                })
            }}
        >
            <FileText className="w-4 h-4 mr-2" />
            {isPending ? "Generating..." : "Generate Invoice"}
        </Button>
    )
}
