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
import { useOfflineMutation } from "@/hooks/use-offline-mutation";
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
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

const formSchema = z.object({
    time: z.string().optional(),
    customerName: z.string().min(2, "Customer name is required"),
    bags: z.coerce.number().min(5, "Minimum 5 bags required for office sales"),
    paymentType: z.enum(["CASH", "TRANSFER"]),
    gatePass: z.string().optional(),
    notes: z.string().optional(),
});

export function AddSaleDialog({ pricePerBag, isEditable }: { pricePerBag: number, isEditable: boolean }) {
    const [open, setOpen] = useState(false);
    const { submit, isSubmitting } = useOfflineMutation("ADD_SALE");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            time: "",
            customerName: "",
            bags: 5,
            paymentType: "CASH",
            gatePass: "",
            notes: "",
        },
    });

    const watchedBags = form.watch("bags");
    const amount = (watchedBags || 0) * pricePerBag;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            let saleDate = undefined;
            if (values.time) {
                const [hours, minutes] = values.time.split(':');
                saleDate = new Date();
                saleDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            }

            await submit({
                customerName: values.customerName,
                bags: values.bags,
                paymentType: values.paymentType,
                gatePass: values.gatePass,
                notes: values.notes,
                time: saleDate
            });

            toast.success("Sale saved successfully");
            setOpen(false);
            form.reset();
        } catch (e: any) {
            toast.error("Failed to save sale", { description: e.message });
        }
    };

    if (!isEditable) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-10 px-4 py-2"> {/* Touch target */}
                    <Plus className="w-5 h-5 mr-2" />
                    Add Sale
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Office Sale</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} className="h-12 text-lg" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Customer Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="bags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bags (Min 5)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={5}
                                                {...field}
                                                className="h-12 text-lg font-bold"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <div className="h-12 flex items-center px-3 border rounded-md bg-muted font-mono font-bold text-lg">
                                    {formatCurrency(amount)}
                                </div>
                            </FormItem>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="paymentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="CASH">Cash</SelectItem>
                                                <SelectItem value="TRANSFER">Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gatePass"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gate Pass (Opt)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="GP-123" {...field} className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Optional notes..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-12 text-lg">
                                {isSubmitting ? "Saving..." : "Save Sale"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}
