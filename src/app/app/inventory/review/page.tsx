import { requireRole } from "@/lib/auth-checks";
import { getInventoryHistory } from "@/lib/actions/inventory-actions";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function InventoryReviewPage() {
    await requireRole(["OWNER"]);
    const history = await getInventoryHistory();

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1600px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Security Audit</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Historical Production & Reconciliation</p>
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm ring-1 ring-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b-2 border-white">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="h-14 px-8 text-[10px] font-black text-blue-900 uppercase tracking-widest pl-12 underline decoration-blue-200 underline-offset-4">Sequence</TableHead>
                            <TableHead className="h-14 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Opening</TableHead>
                            <TableHead className="h-14 text-right text-[10px] font-black text-green-600 uppercase tracking-widest">+ Produced</TableHead>
                            <TableHead className="h-14 text-right text-[10px] font-black text-red-500 uppercase tracking-widest">- Spoilage</TableHead>
                            <TableHead className="h-14 text-right text-[10px] font-black text-orange-600 uppercase tracking-widest">- Dispatched</TableHead>
                            <TableHead className="h-14 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Computed</TableHead>
                            <TableHead className="h-14 text-right text-[10px] font-black text-blue-950 uppercase tracking-widest">Confirmed</TableHead>
                            <TableHead className="h-14 text-right text-[10px] font-black text-blue-950 uppercase tracking-widest">Variance</TableHead>
                            <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-12">Log Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center h-48 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                    Archive Empty
                                </TableCell>
                            </TableRow>
                        ) : (
                            history.map(record => {
                                const outTotal = record.outgoingDriverLoadsBags + record.outgoingOfficeSalesBags;
                                const hasHighVariance = Math.abs(record.varianceBags) > 50;

                                return (
                                    <TableRow key={record.id} className="hover:bg-blue-50/30 transition-colors border-blue-50/50">
                                        <TableCell className="h-20 pl-12">
                                            <div className="flex flex-col">
                                                <span className="font-black text-blue-950 text-sm tracking-tighter uppercase">{format(new Date(record.day.date), "MMMM d").toUpperCase()}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(record.day.date), "yyyy")}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-slate-400 font-mono text-xs">{record.openingBags}</TableCell>
                                        <TableCell className="text-right font-black text-green-600 text-sm">{record.producedBags}</TableCell>
                                        <TableCell className="text-right font-black text-red-500 text-sm">{record.spoilageBags}</TableCell>
                                        <TableCell className="text-right font-black text-orange-600 text-sm">-{outTotal}</TableCell>
                                        <TableCell className="text-right text-slate-400 font-mono text-xs">{record.closingBagsComputed}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="inline-flex h-10 px-4 items-center justify-center rounded-xl bg-slate-50 font-black text-blue-950 text-sm ring-1 ring-slate-100 italic">
                                                {record.closingBagsConfirmed ?? "--"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {record.closingBagsConfirmed !== null && (
                                                <Badge variant={hasHighVariance ? "destructive" : (record.varianceBags === 0 ? "outline" : "secondary")} className="font-black px-3 h-7 rounded-lg text-[10px]">
                                                    {record.varianceBags > 0 ? "+" : ""}{record.varianceBags}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="pr-12">
                                            <p className="text-[10px] font-bold text-slate-400 italic max-w-[180px] leading-relaxed">
                                                {record.notes || "System calculated sequence verified."}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
