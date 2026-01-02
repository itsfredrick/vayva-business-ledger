
"use client";

import { Trip } from "@prisma/client";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TripStripProps {
    trips: Trip[];
    onAddTrip: () => void;
    onEditTrip: (trip: Trip) => void;
    isEditable: boolean;
}

export function TripStrip({ trips, onAddTrip, onEditTrip, isEditable }: TripStripProps) {
    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Trips Log</h4>
                {isEditable && (
                    <Button variant="ghost" size="sm" onClick={onAddTrip} className="h-6 gap-1 text-xs text-primary">
                        <Plus className="h-3 w-3" /> Add Trip
                    </Button>
                )}
            </div>

            <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-muted/20">
                <div className="flex w-max space-x-4 p-4">
                    {trips.length === 0 ? (
                        <div className="flex h-[100px] w-[200px] items-center justify-center rounded-lg border border-dashed bg-background text-xs text-muted-foreground">
                            No trips recorded
                        </div>
                    ) : (
                        trips.map((trip) => (
                            <Card
                                key={trip.id}
                                className={cn(
                                    "relative flex h-[100px] w-[160px] flex-col justify-between overflow-hidden p-3 transition-all hover:border-primary/50",
                                    isEditable ? "cursor-pointer hover:shadow-md" : ""
                                )}
                                onClick={() => isEditable && onEditTrip(trip)}
                            >
                                <div className="flex items-start justify-between">
                                    <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                                        {trip.gatePassNumber}
                                    </span>
                                    <span className="text-xs font-bold text-primary">
                                        {trip.loadedBags} bags
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                        <span>Out:</span>
                                        <span className="font-mono text-foreground">
                                            {trip.departTime ? format(trip.departTime, "h:mm a") : "-"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                        <span>In:</span>
                                        <span className="font-mono text-foreground">
                                            {trip.returnTime ? format(trip.returnTime, "h:mm a") : "-"}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
