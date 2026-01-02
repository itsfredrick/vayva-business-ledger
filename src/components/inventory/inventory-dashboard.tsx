"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateInventory } from "@/lib/actions/inventory-actions";
import { AlertTriangle, Package, Truck, ShoppingBag, Trash2, Save, RotateCcw } from "lucide-react";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Input Panel */}
            <Card>
                <CardHeader>
                    <CardTitle>Production & Closing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Produced Today</Label>
                        <div className="relative">
                            <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                className="pl-9 text-lg"
                                value={produced}
                                onChange={e => setProduced(e.target.value)}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Spoilage / Damaged</Label>
                        <div className="relative">
                            <Trash2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                className="pl-9 text-lg"
                                value={spoilage}
                                onChange={e => setSpoilage(e.target.value)}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                        <Label className="font-bold">Confirmed Closing Count (Physical)</Label>
                        <Input
                            type="number"
                            className="text-lg font-bold"
                            placeholder="Enter physical count..."
                            value={confirmed}
                            onChange={e => setConfirmed(e.target.value)}
                            disabled={!isEditable}
                        />
                    </div>

                    <div className="pt-2">
                        <Label>Notes</Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any discrepancies?" disabled={!isEditable} />
                    </div>

                    <Button className="w-full" onClick={handleSave} disabled={isPending || !isEditable}>
                        {isPending ? "Saving..." : "Update Inventory"}
                    </Button>
                </CardContent>
            </Card>

            {/* Right: Stats Panel */}
            <div className="space-y-6">
                {/* Computed Flow */}
                <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm uppercase text-muted-foreground">Stock Flow</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span>Opening Stock</span>
                            <span className="font-mono font-bold">{data.openingBags}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>+ Produced</span>
                            <span className="font-mono font-bold">+{p}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>- Spoilage</span>
                            <span className="font-mono font-bold">-{s}</span>
                        </div>
                        <div className="flex justify-between text-orange-600">
                            <span className="flex items-center gap-2"><Truck className="w-3 h-3" /> Out: Drivers</span>
                            <span className="font-mono font-bold">-{data.outgoingDriverLoadsBags}</span>
                        </div>
                        <div className="flex justify-between text-orange-600">
                            <span className="flex items-center gap-2"><ShoppingBag className="w-3 h-3" /> Out: Office</span>
                            <span className="font-mono font-bold">-{data.outgoingOfficeSalesBags}</span>
                        </div>

                        <div className="border-t my-2"></div>

                        <div className="flex justify-between font-bold text-lg">
                            <span>Computed Closing</span>
                            <span className="font-mono">{computed}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Variance Card */}
                {c !== null && (
                    <Card className={`${variance === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                {variance !== 0 && <AlertTriangle className="w-5 h-5 text-red-600" />}
                                Variance Check
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold font-mono">
                                {variance > 0 ? "+" : ""}{variance}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {variance === 0 ? "Perfect Match" : "Discrepancy detected"}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
