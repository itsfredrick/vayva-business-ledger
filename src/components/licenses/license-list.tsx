import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, AlertTriangle, FileText } from "lucide-react";

type License = {
    id: string;
    name: string;
    licenseNumber: string;
    expiryDate: Date;
    daysRemaining: number;
    status: "OK" | "WARNING" | "CRITICAL" | "EXPIRED";
    notes?: string | null;
    documentUrl?: string | null;
};

export function LicenseList({ licenses }: { licenses: License[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {licenses.map(l => (
                <div key={l.id} className="bg-white rounded-[40px] p-8 ring-1 ring-slate-100 shadow-sm flex flex-col justify-between group hover:ring-blue-200 transition-all duration-500">
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity / Permit</p>
                                <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight italic">{l.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tight uppercase bg-slate-50 px-2 py-0.5 rounded-md inline-block">№ {l.licenseNumber}</p>
                            </div>
                            <Badge variant="outline" className={cn(
                                "h-6 rounded-lg px-2 font-black text-[10px] uppercase tracking-widest",
                                l.status === "OK" ? "border-emerald-100 text-emerald-600 bg-emerald-50/50" :
                                    l.status === "EXPIRED" ? "border-red-100 text-red-600 bg-red-50/50" :
                                        "border-orange-100 text-orange-600 bg-orange-50/50"
                            )}>
                                {l.status}
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <CalendarDays className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiration Sequence</p>
                                    <p className="text-xs font-bold text-slate-900">{format(new Date(l.expiryDate), "MMMM d, yyyy").toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center",
                                    l.daysRemaining <= 7 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                                )}>
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validity Threshold</p>
                                    <p className={cn(
                                        "text-xs font-black uppercase tracking-tight",
                                        l.daysRemaining <= 7 ? "text-red-600" : "text-blue-600"
                                    )}>
                                        {l.daysRemaining < 0 ? Math.abs(l.daysRemaining) + " DAYS OVERDUE" : l.daysRemaining + " DAYS TO EXPIRY"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {l.notes && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Signals</p>
                                <p className="text-[10px] font-bold text-slate-500 italic bg-slate-50 p-4 rounded-2xl leading-relaxed ring-1 ring-slate-100/50">
                                    "{l.notes}"
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex gap-3">
                        {l.documentUrl ? (
                            <a
                                href={l.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 h-12 rounded-2xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all group/btn"
                            >
                                <FileText className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                View Permit Scan
                            </a>
                        ) : (
                            <div className="flex-1 h-12 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center gap-2 text-slate-300 font-black text-[10px] uppercase tracking-widest">
                                No Scan Archived
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {licenses.length === 0 && (
                <div className="col-span-full p-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 mt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">No regulatory signals found</p>
                </div>
            )}
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
