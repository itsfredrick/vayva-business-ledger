"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addSupplierDelivery } from "@/lib/actions/driver-detail-actions";
import { formatCurrency } from "@/lib/format";
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

type SupplierDelivery = {
    id: string;
    supplierName: string;
    addressText: string | null;
    bags: number;
    pricePerBag: number;
    amountNaira: number;
};

const formSchema = z.object({
    name: z.string().min(2, "Name required"),
    address: z.string().optional(),
    bags: z.coerce.number().min(1, "Bags required"),
    price: z.coerce.number().min(1, "Price required"),
});

export function SupplierTable({ driverDayId, deliveries, isEditable }: { driverDayId: string, deliveries: SupplierDelivery[], isEditable: boolean }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            address: "",
            bags: 20,
            price: 340,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        startTransition(async () => {
            try {
                await addSupplierDelivery({
                    driverDayId,
                    supplierName: values.name,
                    address: values.address || "",
                    bags: values.bags,
                    price: values.price
                });
                toast.success("Delivery added");
                setOpen(false);
                form.reset({ name: "", address: "", bags: 20, price: 340 });
            } catch (e: any) {
                toast.error("Error adding delivery", { description: e.message });
            }
        });
    };

    const columns = [
        {
            header: "Supplier",
            cell: (d: SupplierDelivery) => (
                <div>
                    <div className="font-medium">{d.supplierName}</div>
                    <div className="text-xs text-muted-foreground">{d.addressText}</div>
                </div>
            )
        },
        {
            header: "Bags",
            accessorKey: "bags" as keyof SupplierDelivery,
            className: "text-right"
        },
        {
            header: "Rate",
            accessorKey: "pricePerBag" as keyof SupplierDelivery,
            className: "text-right"
        },
        {
            header: "Total",
            className: "text-right font-medium",
            cell: (d: SupplierDelivery) => formatCurrency(d.amountNaira)
        }
    ];

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Supplier Deliveries</h3>
                {isEditable && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Supplier</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Supplier Delivery</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Supplier Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12" placeholder="e.g. Mama Chinedu" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12" placeholder="Optional" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="bags"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bags</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} className="h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="price"
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
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isPending} className="w-full sm:w-auto h-12">
                                            {isPending ? "Adding..." : "Save"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <DataTable
                data={deliveries}
                columns={columns}
                keyExtractor={(d) => d.id}
                emptyMessage="No supplier deliveries"
            />
        </div>
    );
}
