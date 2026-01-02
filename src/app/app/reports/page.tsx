"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { getExportData } from "@/lib/actions/report-actions";
import { format } from "date-fns";

export default function ReportsPage() {
    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Intelligence Archive</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Historical Export & Business Logic Extraction</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                <ExportCard title="Revenue Stream Audit" type="SALES" description="Comprehensive CSV containing All Driver Movements and Direct Office Settlements." />
                <ExportCard title="Operational Cost Ledger" type="EXPENSES" description="Detailed list of all approved factory expenses and petty cash movements." />
            </div>
        </div>
    );
}

function ExportCard({ title, type, description }: { title: string, type: "SALES" | "EXPENSES", description: string }) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!from || !to) return;
        setLoading(true);
        try {
            const data = await getExportData(type, new Date(from), new Date(to));
            if (!data) return;

            // Simple CSV conversion
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += `KOOL JOO BUSINESS LEDGER - ${type} REPORT\n`;
            csvContent += `Company: Kool Joo\n`;
            csvContent += `Period: ${from} to ${to}\n\n`;

            if (type === "SALES") {
                // Driver Sales
                csvContent += "Type,Date,Name,Sold_Bags,Expected_Naira,Received_Naira,Outstanding_Naira\n";
                // @ts-ignore
                data.driverDays.forEach((d) => {
                    const row = `Driver,${format(new Date(d.day.date), "yyyy-MM-dd")},${d.driverProfile.name},${d.totalSoldBags},${d.expectedNaira},${d.cashReceivedNaira},${d.outstandingEndNaira}`;
                    csvContent += row + "\n";
                });
                // Office Sales
                // @ts-ignore
                data.officeSales.forEach((s) => {
                    const row = `Office,${format(new Date(s.day.date), "yyyy-MM-dd")},${s.customerName},${s.bags},${s.amountNaira},${s.amountNaira},0`;
                    csvContent += row + "\n";
                });
            } else {
                csvContent += "Date,Category,Who,Amount,Reason,Status\n";
                // @ts-ignore
                data.forEach((e) => {
                    const row = `${format(new Date(e.day.date), "yyyy-MM-dd")},${e.category},${e.whoTookMoney},${e.amountNaira},"${e.reason}",${e.ownerReviewedStatus}`;
                    csvContent += row + "\n";
                });
            }

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${type}_REPORT_${from}_to_${to}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (e) {
            alert("Export failed: " + e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[40px] p-10 ring-1 ring-slate-100 shadow-sm flex flex-col justify-between group hover:ring-blue-200 transition-all duration-500">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <Download className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter text-blue-950 uppercase">{title}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Sequence Module</p>
                    </div>
                </div>

                <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">{description}</p>

                <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Sequence Start</Label>
                        <Input
                            type="date"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            className="h-12 bg-slate-50 border-none rounded-2xl font-black text-xs px-4 focus-visible:ring-blue-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Sequence End</Label>
                        <Input
                            type="date"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            className="h-12 bg-slate-50 border-none rounded-2xl font-black text-xs px-4 focus-visible:ring-blue-600"
                        />
                    </div>
                </div>
            </div>

            <Button
                onClick={handleDownload}
                disabled={loading || !from || !to}
                className="mt-10 h-14 w-full rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
            >
                {loading ? "Synthesizing Archive..." : "Extract Data Stream"}
            </Button>
        </div>
    );
}
