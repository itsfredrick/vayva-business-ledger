
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
        <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                {/* Cash Input */}
                <div className="space-y-3">
                    <Label htmlFor="cash-input" className="text-[10px] font-black text-blue-950 uppercase tracking-widest opacity-60">Cash Remittance</Label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 font-bold text-lg select-none">₦</div>
                        <Input
                            id="cash-input"
                            type="number"
                            min="0"
                            className="h-14 pl-12 text-2xl font-black text-green-600 border-none bg-emerald-50/30 rounded-2xl shadow-inner focus-visible:ring-emerald-500 ring-1 ring-emerald-100/50"
                            value={cashReceived || ""}
                            placeholder="0.00"
                            onChange={(e) => onCashChange(parseFloat(e.target.value) || 0)}
                            disabled={!isEditable}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg ring-1 ring-slate-100 shadow-sm opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Live Entry</span>
                        </div>
                    </div>
                </div>

                {/* Transfers List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black text-blue-950 uppercase tracking-widest opacity-60">Bank Transfers</Label>
                        {isEditable && (
                            <Button variant="ghost" size="sm" onClick={onAddTransfer} className="h-6 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50">
                                + Log Transfer
                            </Button>
                        )}
                    </div>

                    <div className="min-h-[56px] space-y-2">
                        {transfers.length === 0 ? (
                            <div className="p-5 rounded-2xl bg-slate-50 border border-dashed text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">No Transfers Logged</div>
                        ) : (
                            transfers.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-4 bg-white ring-1 ring-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <CreditCard className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-blue-950 uppercase tracking-tighter">{t.bankAccountLabel}</span>
                                            <Badge variant={t.status === "MATCHED_AUTO" || t.status === "MATCHED_MANUAL" ? "default" : "secondary"} className="text-[8px] font-black uppercase h-4 px-1.5 mt-0.5 rounded-md w-fit">
                                                {t.status === "MATCHED_AUTO" ? "Verified" : "Pending"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-lg font-black text-blue-900 tabular-nums tracking-tighter">
                                        <Money amount={t.amountNaira} />
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
