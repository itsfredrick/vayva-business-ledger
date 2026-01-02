
"use client";

import { TransferLog } from "@prisma/client";
import { Plus, CreditCard, Banknote, ArrowUpRight } from "lucide-react";
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
        <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Cash Input */}
                <div className="space-y-4">
                    <Label htmlFor="cash-input" className="text-[10px] font-black text-blue-950 uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Banknote className="w-3 h-3" /> Cash Collections
                    </Label>
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-2xl select-none">₦</div>
                        <Input
                            id="cash-input"
                            type="number"
                            min="0"
                            className="h-20 pl-14 text-4xl font-black text-emerald-600 border-none bg-emerald-50/50 hover:bg-emerald-50 focus-visible:bg-white transition-all rounded-[24px] shadow-sm focus-visible:ring-emerald-500 ring-1 ring-emerald-100/50"
                            value={cashReceived || ""}
                            placeholder="0"
                            onChange={(e) => onCashChange(parseFloat(e.target.value) || 0)}
                            disabled={!isEditable}
                        />
                        {isEditable && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-xl ring-1 ring-slate-100/50 shadow-sm opacity-60 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Live Sync</span>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium pl-2">Enter total cash remitted by driver.</p>
                </div>

                {/* Transfers List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black text-blue-950 uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <CreditCard className="w-3 h-3" /> Bank Transfers
                        </Label>
                        {isEditable && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onAddTransfer}
                                className="h-7 gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 hover:text-blue-700 px-3 rounded-lg transition-all"
                            >
                                <Plus className="w-3 h-3" /> Log Transfer
                            </Button>
                        )}
                    </div>

                    <div className="min-h-[56px] space-y-3">
                        {transfers.length === 0 ? (
                            <div className="h-20 flex items-center justify-center rounded-[24px] bg-slate-50 border border-dashed border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                No Transfers Logged
                            </div>
                        ) : (
                            transfers.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-4 bg-white ring-1 ring-slate-100 rounded-[20px] shadow-sm hover:shadow-md transition-all hover:translate-x-1 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                            <ArrowUpRight className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[11px] font-black text-blue-950 uppercase tracking-tight">{t.bankAccountLabel}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={t.status === "MATCHED_AUTO" || t.status === "MATCHED_MANUAL" ? "default" : "secondary"} className="text-[8px] font-black uppercase h-4 px-1.5 rounded-md w-fit border-0">
                                                    {t.status === "MATCHED_AUTO" ? "Verified" : "Pending"}
                                                </Badge>
                                                {t.proofImageUrl && <span className="text-[8px] text-blue-400 font-bold underline cursor-pointer">View Proof</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xl font-black text-blue-900 tabular-nums tracking-tighter">
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
