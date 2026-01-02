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
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Reports & Exports</h1>
                <p className="text-muted-foreground">Download detailed data for external analysis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExportCard title="Sales Report" type="SALES" description="Includes Driver Daily totals and Office Sales records." />
                <ExportCard title="Expenses Report" type="EXPENSES" description="Detailed list of all recorded expenses." />
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{description}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>From</Label>
                        <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>To</Label>
                        <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
                    </div>
                </div>
                <Button className="w-full" onClick={handleDownload} disabled={loading || !from || !to}>
                    {loading ? "Generating..." : "Download CSV"}
                </Button>
            </CardContent>
        </Card>
    );
}
