"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { addLicense } from "@/lib/actions/license-actions";

export function AddLicenseDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                if (!expiry) throw new Error("Expiry date required");
                await addLicense({
                    name,
                    licenseNumber: number,
                    expiryDate: new Date(expiry),
                    notes
                });
                setOpen(false);
                setName("");
                setNumber("");
                setExpiry("");
                setNotes("");
            } catch (e) {
                alert("Error: " + e);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add License
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New License</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="e.g. Navsa Permit" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Number</Label>
                        <Input value={number} onChange={e => setNumber(e.target.value)} className="col-span-3" placeholder="License #" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Expiry Date</Label>
                        <Input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Notes</Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!name || !expiry || isPending}>
                        {isPending ? "Saving..." : "Save License"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
