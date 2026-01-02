"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addDispenserDelivery } from "@/lib/actions/dispenser-actions";
import { BillingMode } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { useEffect } from "react";

// Minimal type needed for selection
type SelectableCustomer = {
    id: string;
    name: string;
    billingMode: BillingMode;
    defaultRatePerBottle: number;
    defaultAddress: string | null;
};

const formSchema = z.object({
    customerId: z.string().min(1, "Customer required"),
    delBags: z.coerce.number().min(0, "Invalid amount"),
    retBags: z.coerce.number().min(0, "Invalid amount"),
    rate: z.coerce.number().min(0, "Invalid rate"),
    paymentType: z.enum(["CASH", "TRANSFER", "MONTHLY"]),
    notes: z.string().optional(),
});

export function AddDeliveryDialog({ customers, isEditable }: { customers: SelectableCustomer[], isEditable: boolean }) {
    const [open, setOpen] = useState(false);
    const { startTransition, isPending } = { startTransition: (cb: any) => cb(), isPending: false }; // Temporary fix as addDispenserDelivery might not be an offline mutation wrapper yet or we can just use normal server action call pattern.
    // Actually, let's use standard try/catch wrapper since addDispenserDelivery is likely a server action. 
    // Wait, previous code used useTransition. I will assume it's a server action.

    // Correction: The previous code used useTransition. I will replicate that but with cleaner loading state management if needed. 
    // Actually, I can just use a local submitting state if I want to skip useTransition for simplicity, OR use useTransition solely for the Pending state.
    // Let's stick to simple async/await for now, assuming addDispenserDelivery is a direct server action.

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            customerId: "",
            delBags: 0,
            retBags: 0,
            rate: 0,
            paymentType: "CASH",
            notes: "",
        },
    });

    const watchedCustomerId = form.watch("customerId");
    const watchedDelBags = form.watch("delBags");
    const watchedRate = form.watch("rate");

    // Auto-fill defaults when customer changes
    useEffect(() => {
        if (watchedCustomerId) {
            const c = customers.find(x => x.id === watchedCustomerId);
            if (c) {
                // Only update if not already set or if user switched customer ? 
                // Better to just update defaults to ensure consistency.
                form.setValue("rate", c.defaultRatePerBottle);
                form.setValue("paymentType", c.billingMode === "MONTHLY" ? "MONTHLY" : "CASH");
            }
        }
    }, [watchedCustomerId, customers, form]);

    const amount = (watchedDelBags || 0) * (watchedRate || 0);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            await addDispenserDelivery({
                customerId: values.customerId,
                bottlesDelivered: values.delBags,
                bottlesReturned: values.retBags,
                rate: values.rate,
                paymentType: values.paymentType,
                notes: values.notes || ""
            });
            toast.success("Dispenser delivery added");
            setOpen(false);
            form.reset({
                customerId: "",
                delBags: 0,
                retBags: 0,
                rate: 0,
                paymentType: "CASH",
                notes: ""
            });
        } catch (e: any) {
            toast.error("Failed to add delivery", { description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isEditable) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Delivery
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Dispenser Delivery</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="customerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Select customer" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {customers.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="delBags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Delivered (Bottles)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="h-12 font-bold text-lg" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="retBags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Returned (Bottles)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <FormField
                                control={form.control}
                                name="rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rate (₦)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="h-12 flex items-center justify-end px-4 bg-muted rounded-md border font-mono font-bold text-lg">
                                {formatCurrency(amount)}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="paymentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Method</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="CASH">Cash</SelectItem>
                                            <SelectItem value="TRANSFER">Transfer</SelectItem>
                                            <SelectItem value="MONTHLY">Monthly (Deferred)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Optional notes" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-12">
                                {isSubmitting ? "Saving..." : "Save Delivery"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
