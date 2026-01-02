"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { addLicense } from "@/lib/actions/license-actions";

import { FileUpload } from "@/components/ui/file-upload";

export function AddLicenseDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [notes, setNotes] = useState("");
    const [documentUrl, setDocumentUrl] = useState("");

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                if (!expiry) throw new Error("Expiry date required");
                await addLicense({
                    name,
                    licenseNumber: number,
                    expiryDate: new Date(expiry),
                    notes,
                    documentUrl
                });
                setOpen(false);
                setName("");
                setNumber("");
                setExpiry("");
                setNotes("");
                setDocumentUrl("");
            } catch (e) {
                alert("Error: " + e);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Archive New Permit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-[48px] border-none shadow-2xl p-0 overflow-hidden">
                <div className="bg-blue-950 p-8 text-white space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Permit Registration</h2>
                    <p className="text-blue-400/60 font-black uppercase tracking-[0.3em] text-[10px]">Regulatory Compliance Ingestion</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Entity Name</Label>
                            <Input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. NAVSA / NAFDAC"
                                className="h-14 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">License Number</Label>
                            <Input
                                value={number}
                                onChange={e => setNumber(e.target.value)}
                                placeholder="SEQ-XXXXX"
                                className="h-14 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Statutory Expiry Date</Label>
                        <Input
                            type="date"
                            value={expiry}
                            onChange={e => setExpiry(e.target.value)}
                            className="h-14 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Compliance Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Additional regulatory context..."
                            className="min-h-[100px] rounded-[32px] bg-slate-50 border-none ring-1 ring-slate-100 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none p-6"
                        />
                    </div>

                    <FileUpload
                        label="Physical Document Scan"
                        value={documentUrl}
                        onUploadComplete={setDocumentUrl}
                        onRemove={() => setDocumentUrl("")}
                        accept="image/*,application/pdf"
                    />

                    <div className="flex gap-4 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="h-14 rounded-2xl flex-1 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            Abort
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!name || !expiry || isPending}
                            className="h-14 rounded-2xl flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
                        >
                            {isPending ? "ARCHIVING..." : "COMMIT PERMIT"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
