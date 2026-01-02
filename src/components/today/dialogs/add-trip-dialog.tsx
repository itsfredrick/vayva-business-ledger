
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTrip } from "@/lib/actions/driver-detail-actions";
import { toast } from "sonner";

interface AddTripDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    driverDayId: string | null;
}

export function AddTripDialog({ open, onOpenChange, driverDayId }: AddTripDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [gatePass, setGatePass] = useState("");
    const [bags, setBags] = useState<number | "">("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!driverDayId) return;

        try {
            setSubmitting(true);
            await addTrip({
                driverDayId,
                gatePass,
                bags: Number(bags),
                notes
            });
            toast.success("Trip added successfully");

            // Reset and close
            setGatePass("");
            setBags("");
            setNotes("");
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to add trip", { description: String(error) });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Trip</DialogTitle>
                    <DialogDescription>
                        Enter gate pass and loaded bags details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gatePass" className="text-right">
                            Gate Pass
                        </Label>
                        <Input
                            id="gatePass"
                            value={gatePass}
                            onChange={(e) => setGatePass(e.target.value)}
                            className="col-span-3"
                            placeholder="GP-XXXX"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bags" className="text-right">
                            Bags
                        </Label>
                        <Input
                            id="bags"
                            type="number"
                            min="1"
                            value={bags}
                            onChange={(e) => setBags(parseFloat(e.target.value) || "")}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Saving..." : "Save Trip"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
