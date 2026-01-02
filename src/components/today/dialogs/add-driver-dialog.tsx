
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDriverToDay } from "@/lib/actions/driver-actions";
import { toast } from "sonner";
import { DriverProfile } from "@prisma/client";

interface AddDriverDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dayId: string;
    profiles: DriverProfile[];
}

export function AddDriverDialog({ open, onOpenChange, dayId, profiles }: AddDriverDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    // State
    const [selectedProfileId, setSelectedProfileId] = useState<string>("new");
    const [newProfileName, setNewProfileName] = useState("");
    const [motorBoy, setMotorBoy] = useState("");
    const [outstandingStart, setOutstandingStart] = useState<number | "">("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await addDriverToDay({
                dayId,
                profileId: selectedProfileId === "new" ? undefined : selectedProfileId,
                newProfileName: selectedProfileId === "new" ? newProfileName : undefined,
                motorBoyName: motorBoy,
                outstandingStartNaira: Number(outstandingStart || 0)
            });
            toast.success("Driver added");
            onOpenChange(false);

            // Cleanup
            setNewProfileName("");
            setMotorBoy("");
            setOutstandingStart("");
            setSelectedProfileId("new");

        } catch (error) {
            toast.error("Failed", { description: String(error) });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Driver/Team</DialogTitle>
                    <DialogDescription>Assign a driver for today.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Driver</Label>
                        <div className="col-span-3">
                            <Select value={selectedProfileId} onValueChange={setSelectedProfileId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select driver" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">+ New Driver</SelectItem>
                                    {profiles.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {selectedProfileId === "new" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                value={newProfileName}
                                onChange={e => setNewProfileName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="moto" className="text-right">Motor Boy</Label>
                        <Input
                            id="moto"
                            value={motorBoy}
                            onChange={e => setMotorBoy(e.target.value)}
                            className="col-span-3"
                            placeholder="Optional"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ostart" className="text-right">Outst. Start</Label>
                        <Input
                            id="ostart"
                            type="number"
                            value={outstandingStart}
                            onChange={e => setOutstandingStart(parseFloat(e.target.value) || "")}
                            className="col-span-3"
                            placeholder="0"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={submitting}>Add Driver</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
