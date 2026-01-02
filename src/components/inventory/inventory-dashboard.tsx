"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateInventory } from "@/lib/actions/inventory-actions";
import { AlertTriangle, Package, Truck, ShoppingBag, Trash2, Save, RotateCcw, AlertCircle, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";
import { cn } from "@/lib/utils";

type InventoryData = {
    openingBags: number;
    producedBags: number;
    spoilageBags: number;
    outgoingDriverLoadsBags: number;
    outgoingOfficeSalesBags: number;
    closingBagsComputed: number;
    closingBagsConfirmed: number | null;
    varianceBags: number;
    notes: string | null;
};

export function InventoryDashboard({ data, isEditable }: { data: InventoryData, isEditable: boolean }) {
    const [isPending, startTransition] = useTransition();

    // Local state for inputs
    const [produced, setProduced] = useState(data.producedBags.toString());
    const [spoilage, setSpoilage] = useState(data.spoilageBags.toString());
    const [confirmed, setConfirmed] = useState(data.closingBagsConfirmed?.toString() || "");
    const [notes, setNotes] = useState(data.notes || "");

    // Draft handling
    const draft = useLiveQuery(() => db.drafts.get('inventory-today'));

    useEffect(() => {
        if (draft) {
            toast("Found a saved draft for inventory.", {
                action: {
                    label: "Restore",
                    onClick: () => {
                        setProduced(draft.data.produced || produced);
                        setSpoilage(draft.data.spoilage || spoilage);
                        setConfirmed(draft.data.confirmed || confirmed);
                        setNotes(draft.data.notes || notes);
                        toast.success("Draft restored.");
                    }
                }
            });
        }
    }, [!!draft]);

    // Auto-save draft
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!isEditable) return;
            await db.drafts.put({
                id: 'inventory-today',
                type: 'inventory',
                data: { produced, spoilage, confirmed, notes },
                updatedAt: Date.now()
            });
        }, 2000);
        return () => clearTimeout(timer);
    }, [produced, spoilage, confirmed, notes, isEditable]);

    // Derived strictly from local state + prop constants for immediate feedback
    const p = parseInt(produced) || 0;
    const s = parseInt(spoilage) || 0;
    const computed = data.openingBags + p - s - data.outgoingDriverLoadsBags - data.outgoingOfficeSalesBags;
    const c = confirmed === "" ? null : parseInt(confirmed);
    const variance = c !== null ? c - computed : 0;

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateInventory({
                    producedBags: p,
                    spoilageBags: s,
                    closingBagsConfirmed: c === null ? undefined : c,
                    notes
                });
                // Clear draft on successful save
                await db.drafts.delete('inventory-today');
                toast.success("Inventory updated & live.");
            } catch (e) {
                toast.error("Error: " + e);
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Input Panel */}
            <Card className="border-blue-100 bg-white/50 backdrop-blur-md shadow-sm">
                <CardHeader className="pb-4 border-b border-blue-50">
                    <CardTitle className="uppercase tracking-widest text-[11px] font-black text-slate-400">Inventory Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="uppercase text-[10px] font-bold text-blue-900 tracking-wider">Produced (Gross)</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-3.5 flex items-center justify-center p-1 rounded-md bg-blue-100 group-focus-within:bg-blue-600 transition-colors">
                                    <Package className="h-4 w-4 text-blue-600 group-focus-within:text-white transition-colors" />
                                </div>
                                <Input
                                    type="number"
                                    className="pl-12 h-14 text-2xl font-black text-blue-950 bg-white border-blue-100 focus-visible:ring-blue-500 rounded-xl shadow-sm"
                                    value={produced}
                                    onChange={e => setProduced(e.target.value)}
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="uppercase text-[10px] font-bold text-red-900 tracking-wider">Spoilage (Damage)</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-3.5 flex items-center justify-center p-1 rounded-md bg-red-100 group-focus-within:bg-red-600 transition-colors">
                                    <Trash2 className="h-4 w-4 text-red-600 group-focus-within:text-white transition-colors" />
                                </div>
                                <Input
                                    type="number"
                                    className="pl-12 h-14 text-2xl font-black text-red-950 bg-white border-red-100 focus-visible:ring-red-500 rounded-xl shadow-sm"
                                    value={spoilage}
                                    onChange={e => setSpoilage(e.target.value)}
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100 border-dashed">
                        <Label className="uppercase text-[10px] font-bold text-slate-500 tracking-wider flex justify-between">
                            <span>Physical Closing Count</span>
                            <span className="text-xs normal-case italic font-medium opacity-70">Verify actual stock on floor</span>
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                className="h-16 text-3xl font-black text-center tracking-tight bg-slate-50 border-slate-200 focus-visible:ring-slate-400 rounded-2xl"
                                placeholder="0"
                                value={confirmed}
                                onChange={e => setConfirmed(e.target.value)}
                                disabled={!isEditable}
                            />
                            {c !== null && (
                                <div className={cn("absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest",
                                    variance === 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                )}>
                                    {variance === 0 ? "Matched" : "Variance"}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="uppercase text-[10px] font-bold text-slate-400 tracking-wider">Operational Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Record justification for variance or production issues..."
                            disabled={!isEditable}
                            className="bg-white border-slate-100 resize-none h-24 rounded-xl focus-visible:ring-slate-400"
                        />
                    </div>

                    <Button
                        className="w-full h-12 text-sm uppercase font-black tracking-widest bg-blue-950 hover:bg-blue-900 shadow-lg shadow-blue-900/20 rounded-xl transition-all hover:scale-[1.01]"
                        onClick={handleSave}
                        disabled={isPending || !isEditable}
                    >
                        {isPending ? "Syncing Logic..." : "Commit Inventory State"}
                    </Button>
                </CardContent>
            </Card>

            {/* Right: Stats Panel */}
            <div className="space-y-6">
                {/* Stock Flow Card */}
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white ring-1 ring-slate-100 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <CardTitle className="uppercase tracking-widest text-[11px] font-black text-slate-400 flex items-center gap-2">
                            Stock Flow Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            <FlowRow label="Opening Stock" value={data.openingBags} type="neutral" />
                            <FlowRow label="Production" value={p} type="positive" icon={Package} />
                            <FlowRow label="Spoilage" value={s} type="negative" icon={Trash2} />
                            <FlowRow label="Drivers Out" value={data.outgoingDriverLoadsBags} type="warning" icon={Truck} sublabel="To Field" />
                            <FlowRow label="Office Sales" value={data.outgoingOfficeSalesBags} type="warning" icon={ShoppingBag} sublabel="Direct Sales" />
                        </div>
                        <div className="p-6 bg-slate-900 text-white">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">System Computed Closing</span>
                                <span className="text-4xl font-black tracking-tighter tabular-nums">{computed}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Variance Card */}
                {c !== null && variance !== 0 && (
                    <Card className="border-red-200 bg-red-50/50 shadow-none">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="p-3 bg-red-100 rounded-full shrink-0">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-black text-red-900 uppercase text-xs tracking-widest mb-1">Variance Detected</h4>
                                <div className="text-2xl font-black text-red-600 mb-2 tabular-nums">
                                    {variance > 0 ? "+" : ""}{variance} Bags
                                </div>
                                <p className="text-xs text-red-800/80 font-medium leading-relaxed">
                                    Physical count does not match system logs. Please investigate production logs or unrecorded sales.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {c !== null && variance === 0 && (
                    <Card className="border-green-200 bg-green-50/50 shadow-none">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full shrink-0">
                                <Save className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-black text-green-900 uppercase text-xs tracking-widest mb-1">Perfect Match</h4>
                                <p className="text-xs text-green-800/80 font-medium">
                                    Physical count aligns perfectly with system logic.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

function FlowRow({ label, value, type, icon: Icon, sublabel }: { label: string, value: number, type: "neutral" | "positive" | "negative" | "warning", icon?: any, sublabel?: string }) {
    const colorClass = {
        neutral: "text-slate-600",
        positive: "text-green-600",
        negative: "text-red-600",
        warning: "text-amber-600"
    }[type];

    const bgClass = {
        neutral: "bg-slate-50",
        positive: "bg-green-50",
        negative: "bg-red-50",
        warning: "bg-amber-50"
    }[type];

    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors">
            <div className="flex items-center gap-3">
                {Icon ? (
                    <div className={`w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${colorClass}`} />
                    </div>
                ) : (
                    <div className="w-8 h-8" />
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">{label}</span>
                    {sublabel && <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{sublabel}</span>}
                </div>
            </div>
            <span className={`font-mono font-bold text-lg ${colorClass}`}>
                {type === "positive" ? "+" : type === "neutral" ? "" : "-"}{value}
            </span>
        </div>
    );
}
