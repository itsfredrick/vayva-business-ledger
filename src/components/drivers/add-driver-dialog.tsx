"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useTransition } from "react";
import { getDriverProfiles, getDriverStats, addDriverToDay } from "@/lib/actions/driver-actions";

type DriverProfile = {
    id: string;
    name: string;
};

export function AddDriverDialog({ dayId, isEditable }: { dayId: string; isEditable: boolean }) {
    const [open, setOpen] = useState(false);
    const [profiles, setProfiles] = useState<DriverProfile[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    // Form State
    const [newProfileName, setNewProfileName] = useState("");
    const [motorBoyName, setMotorBoyName] = useState("");
    const [outstandingStart, setOutstandingStart] = useState("0");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        if (open) {
            getDriverProfiles().then(setProfiles);
        }
    }, [open]);

    useEffect(() => {
        if (selectedProfileId && selectedProfileId !== "new") {
            getDriverStats(selectedProfileId).then((stats) => {
                setOutstandingStart(stats.lastOutstanding.toString());
            });
            setNewProfileName("");
        } else {
            setOutstandingStart("0");
        }
    }, [selectedProfileId]);

    const handleSubmit = () => {
        if (!selectedProfileId && !newProfileName) return;

        startTransition(async () => {
            try {
                await addDriverToDay({
                    dayId,
                    profileId: selectedProfileId === "new" ? undefined : selectedProfileId,
                    newProfileName: selectedProfileId === "new" ? newProfileName : undefined,
                    motorBoyName,
                    outstandingStartNaira: parseFloat(outstandingStart),
                    phoneNumber: selectedProfileId === "new" ? phoneNumber : undefined,
                });
                setOpen(false);
                // Reset form
                setSelectedProfileId("");
                setNewProfileName("");
                setMotorBoyName("");
                setOutstandingStart("0");
                setPhoneNumber("");
            } catch (error) {
                alert("Failed to add driver: " + error);
            }
        });
    };

    if (!isEditable) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Driver
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Driver to Day</DialogTitle>
                    <DialogDescription>
                        Select an existing driver or create a new one.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                    {/* Driver Selection */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="driver" className="text-right">
                            Driver
                        </Label>
                        <div className="col-span-3">
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={popoverOpen}
                                        className="w-full justify-between"
                                    >
                                        {selectedProfileId
                                            ? (selectedProfileId === "new" ? "Create New Driver" : profiles.find((p) => p.id === selectedProfileId)?.name)
                                            : "Select driver..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search driver..." />
                                        <CommandList>
                                            <CommandEmpty>No driver found.</CommandEmpty>
                                            <CommandGroup>
                                                {profiles.map((profile) => (
                                                    <CommandItem
                                                        key={profile.id}
                                                        value={profile.name}
                                                        onSelect={() => {
                                                            setSelectedProfileId(profile.id);
                                                            setPopoverOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedProfileId === profile.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {profile.name}
                                                    </CommandItem>
                                                ))}
                                                <CommandItem
                                                    value="creates-new-driver-option"
                                                    onSelect={() => {
                                                        setSelectedProfileId("new");
                                                        setPopoverOpen(false);
                                                    }}
                                                    className="text-blue-600 font-medium"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Create New Driver
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* New Driver Fields */}
                    {selectedProfileId === "new" && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="newName" className="text-right">Full Name</Label>
                                <Input id="newName" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="col-span-3" />
                            </div>
                        </>
                    )}

                    {/* Common Fields */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="motorBoy" className="text-right">
                            Motor Boy
                        </Label>
                        <Input
                            id="motorBoy"
                            value={motorBoyName}
                            onChange={(e) => setMotorBoyName(e.target.value)}
                            className="col-span-3"
                            placeholder="Optional"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="outstanding" className="text-right">
                            Start Outstanding (₦)
                        </Label>
                        <Input
                            id="outstanding"
                            type="number"
                            value={outstandingStart}
                            onChange={(e) => setOutstandingStart(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isPending || (!selectedProfileId && !newProfileName)}>
                        {isPending ? "Adding..." : "Add Driver"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
