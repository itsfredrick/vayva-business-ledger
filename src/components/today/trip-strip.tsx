
"use client";

import { Trip } from "@prisma/client";
import { format } from "date-fns";
import { Plus, Clock, ArrowRight } from "lucide-react";
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
        <div className="w-full space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h4 className="text-[10px] font-black text-blue-950 uppercase tracking-[0.2em] opacity-60">Logistics Sequences</h4>
                    <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md">{trips.length}</span>
                </div>
                {isEditable && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onAddTrip}
                        className="h-8 gap-2 text-[10px] font-black text-blue-700 uppercase tracking-widest border-blue-200 hover:bg-blue-50 hover:text-blue-800 rounded-xl transition-all"
                    >
                        <Plus className="h-3 w-3" /> New Sequence
                    </Button>
                )}
            </div>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex w-max space-x-5 px-1">
                    {trips.length === 0 ? (
                        <div className="flex h-[150px] w-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                <Clock className="w-5 h-5 opacity-50" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">No Sequences Logged</span>
                            <span className="text-[9px] text-slate-400 mt-1">Dispense stock to initiate tracking</span>
                        </div>
                    ) : (
                        trips.map((trip, idx) => (
                            <Card
                                key={trip.id}
                                className={cn(
                                    "relative flex h-[150px] w-[240px] flex-col justify-between overflow-hidden p-0 transition-all border-0 shadow-lg shadow-slate-200/50 rounded-[28px] bg-white group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10",
                                    isEditable ? "cursor-pointer active:scale-95" : ""
                                )}
                                onClick={() => isEditable && onEditTrip(trip)}
                            >
                                {/* Header */}
                                <div className="px-5 pt-5 pb-0 flex justify-between items-start">
                                    <div className="space-y-0.5">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sequence #{idx + 1}</span>
                                        <div className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md w-fit">
                                            PASS: {trip.gatePassNumber || "N/A"}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs ring-1 ring-blue-100">
                                        {idx + 1}
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="px-5">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-blue-950 tracking-tighter">{trip.loadedBags}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bags</span>
                                    </div>
                                </div>

                                {/* Footer Time */}
                                <div className="bg-slate-50/80 border-t border-slate-100 p-3 px-5 flex items-center justify-between text-[10px] font-bold text-slate-600">
                                    <span>{trip.departTime ? format(trip.departTime, "h:mm a") : "--:--"}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-300" />
                                    <span>{trip.returnTime ? format(trip.returnTime, "h:mm a") : "--:--"}</span>
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
