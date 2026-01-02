
"use client";

import { TransferLog } from "@prisma/client";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Money } from "@/lib/format";

interface MoneyReceivedPanelProps {
    cashReceived: number;
    transfers: TransferLog[];
    onCashChange: (val: number) => void;
    onAddTransfer: () => void;
    isEditable: boolean;
}

export function MoneyReceivedPanel({
    cashReceived,
    transfers,
    onCashChange,
    onAddTransfer,
    isEditable
}: MoneyReceivedPanelProps) {
    return (
        <div className="space-y-4 rounded-md border p-4">
            <h4 className="text-sm font-medium text-muted-foreground">Money Received</h4>

            <div className="grid gap-4 sm:grid-cols-2">
                {/* Cash Input */}
                <div className="space-y-2">
                    <Label htmlFor="cash-input" className="text-xs">Cash Handed Over</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                        <Input
                            id="cash-input"
                            type="number"
                            min="0"
                            className="pl-7"
                            value={cashReceived || ""}
                            onChange={(e) => onCashChange(parseFloat(e.target.value) || 0)}
                            disabled={!isEditable}
                        />
                    </div>
                </div>

                {/* Transfers List */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Bank Transfers</Label>
                        {isEditable && (
                            <Button variant="outline" size="sm" onClick={onAddTransfer} className="h-6 text-[10px]">
                                <Plus className="mr-1 h-3 w-3" /> Log Transfer
                            </Button>
                        )}
                    </div>

                    <div className="min-h-[40px] space-y-2 rounded-md bg-muted/20 p-2">
                        {transfers.length === 0 ? (
                            <p className="text-[10px] text-muted-foreground italic">No transfers logged</p>
                        ) : (
                            transfers.map(t => (
                                <div key={t.id} className="flex items-center justify-between rounded-sm border bg-background px-2 py-1 text-xs">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-3 w-3 text-blue-500" />
                                        <span className="font-medium">{t.bankAccountLabel}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Money amount={t.amountNaira} />
                                        <Badge variant={t.status === "MATCHED_AUTO" || t.status === "MATCHED_MANUAL" ? "default" : "secondary"} className="text-[10px] h-4 px-1">
                                            {t.status === "MATCHED_AUTO" ? "Matched" : "Pending"}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
