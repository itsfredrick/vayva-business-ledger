"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { saveDispenserCustomer } from "@/lib/actions/dispenser-actions";
import { BillingMode } from "@prisma/client";

interface CustomerDialogProps {
    customer?: {
        id: string;
        name: string;
        phone: string | null;
        defaultAddress: string | null;
        billingMode: BillingMode;
        defaultRatePerBottle: number;
    };
    trigger?: React.ReactNode;
}

export function CustomerDialog({ customer, trigger }: CustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [name, setName] = useState(customer?.name || "");
    const [phone, setPhone] = useState(customer?.phone || "");
    const [address, setAddress] = useState(customer?.defaultAddress || "");
    const [billingMode, setBillingMode] = useState<BillingMode>(customer?.billingMode || "PER_DELIVERY");
    const [rate, setRate] = useState(customer?.defaultRatePerBottle?.toString() || "0");

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                await saveDispenserCustomer({
                    id: customer?.id,
                    name,
                    phone: phone || undefined,
                    address: address || undefined,
                    billingMode,
                    rate: parseInt(rate) || 0
                });
                setOpen(false);
                if (!customer) {
                    // Reset form if creating new
                    setName("");
                    setPhone("");
                    setAddress("");
                    setBillingMode("PER_DELIVERY");
                    setRate("0");
                }
            } catch (e) {
                alert("Error: " + e);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size={customer ? "icon" : "default"} variant={customer ? "ghost" : "default"}>
                        {customer ? <Pencil className="w-4 h-4" /> : <><Plus className="w-4 h-4 mr-2" /> Add Customer</>}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{customer ? "Edit Customer" : "New Customer"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Phone</Label>
                        <Input value={phone} onChange={e => setPhone(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Address</Label>
                        <Input value={address} onChange={e => setAddress(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Payment</Label>
                        <Select value={billingMode} onValueChange={(v: any) => setBillingMode(v)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PER_DELIVERY">Pay Per Delivery</SelectItem>
                                <SelectItem value="MONTHLY">Monthly Invoice</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Rate</Label>
                        <Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="col-span-3" placeholder="Price per bottle" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isPending || !name}>
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
