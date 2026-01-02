
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
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-blue-950 uppercase tracking-[0.2em] opacity-60">Trips Logistics</h4>
                {isEditable && (
                    <Button variant="ghost" size="sm" onClick={onAddTrip} className="h-8 gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-4 rounded-xl transition-all active:scale-95">
                        <Plus className="h-4 w-4" /> New Sequence
                    </Button>
                )}
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-6 pb-6 pt-2 px-1">
                    {trips.length === 0 ? (
                        <div className="flex h-[140px] w-[280px] flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-100 bg-slate-50/50 text-slate-300">
                            <Plus className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-[10px] font-black uppercase tracking-widest">No Sequences Dispatched</span>
                        </div>
                    ) : (
                        trips.map((trip) => (
                            <Card
                                key={trip.id}
                                className={cn(
                                    "relative flex h-[140px] w-[220px] flex-col justify-between overflow-hidden p-6 transition-all border-0 ring-1 ring-slate-100 shadow-sm rounded-[32px] bg-white group hover:shadow-xl hover:ring-blue-100 hover:-translate-y-1",
                                    isEditable ? "cursor-pointer" : ""
                                )}
                                onClick={() => isEditable && onEditTrip(trip)}
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pass #{trip.gatePassNumber}</span>
                                    <span className="text-2xl font-black text-blue-950 tracking-tighter">
                                        {trip.loadedBags} <span className="text-xs font-bold text-slate-400">Bags</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Out</p>
                                        <p className="text-[10px] font-black text-blue-900 tabular-nums">
                                            {trip.departTime ? format(trip.departTime, "h:mm a") : "--:--"}
                                        </p>
                                    </div>
                                    <div className="w-[1px] h-6 bg-slate-50" />
                                    <div className="space-y-0.5 text-right flex-1">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">In</p>
                                        <p className="text-[10px] font-black text-blue-900 tabular-nums">
                                            {trip.returnTime ? format(trip.returnTime, "h:mm a") : "--:--"}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
                <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
        </div>
    );
}
