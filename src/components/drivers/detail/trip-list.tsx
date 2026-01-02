"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";


type Trip = {
    id: string;
    gatePassNumber: string | null;
    departTime: Date | null;
    returnTime: Date | null;
    loadedBags: number;
    notes: string | null;
};

const formSchema = z.object({
    gatePass: z.string().optional(),
    bags: z.coerce.number().min(1, "Loaded bags must be at least 1"),
    time: z.string().optional(),
    notes: z.string().optional(),
});

export function TripList({ driverDayId, trips, isEditable }: { driverDayId: string, trips: Trip[], isEditable: boolean }) {
    const [open, setOpen] = useState(false);
    const { submit, isSubmitting } = useOfflineMutation("ADD_TRIP");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            gatePass: "",
            bags: 120,
            time: "",
            notes: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            let departDate = undefined;
            if (values.time) {
                const [hours, minutes] = values.time.split(':');
                departDate = new Date();
                departDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            }

            await submit({
                driverDayId,
                gatePass: values.gatePass,
                bags: values.bags,
                departTime: departDate,
                notes: values.notes
            });

            toast.success("Trip added successfully");
            setOpen(false);
            form.reset({ bags: 120, gatePass: "", time: "", notes: "" });
        } catch (e: any) {
            toast.error("Failed to add trip", { description: e.message });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Trips</h3>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                {trips.map((trip, idx) => (
                    <Card key={trip.id} className="min-w-[200px] w-[200px] flex-shrink-0 snap-start">
                        <CardHeader className="p-3 pb-0">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-lg">Trip {idx + 1}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 text-sm space-y-2">
                            <div>
                                <span className="text-xs text-muted-foreground block">Gate Pass</span>
                                <span className="font-mono bg-muted px-1 rounded">{trip.gatePassNumber || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <span className="text-xs text-muted-foreground block">Depart</span>
                                    {trip.departTime ? format(new Date(trip.departTime), "HH:mm") : "-"}
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Return</span>
                                    {trip.returnTime ? format(new Date(trip.returnTime), "HH:mm") : "-"}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">Loaded Bags</span>
                                <span className="font-bold text-lg">{trip.loadedBags}</span>
                            </div>
                            {trip.notes && (
                                <div className="text-xs italic text-muted-foreground border-t pt-1">
                                    {trip.notes}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {isEditable && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <div className="min-w-[200px] w-[200px] h-[200px] flex-shrink-0 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors snap-start">
                                <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="font-medium text-muted-foreground">Add Trip</span>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Trip</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="gatePass"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gate Pass</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="GP-..." {...field} className="h-12" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bags"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Loaded Bags</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} className="h-12 font-bold text-lg" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Depart Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} className="h-12" />
                                                </FormControl>
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
                                        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-12 text-lg">
                                            {isSubmitting ? "Adding..." : "Save Trip"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
