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
};

export function LicenseList({ licenses }: { licenses: License[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {licenses.map(l => (
                <Card key={l.id} className={`border-l-4 ${l.status === "EXPIRED" ? "border-l-red-600 bg-red-50 dark:bg-red-950/20" :
                        l.status === "CRITICAL" ? "border-l-red-500" :
                            l.status === "WARNING" ? "border-l-yellow-400" :
                                "border-l-green-500"
                    }`}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">{l.name}</CardTitle>
                                <p className="text-sm text-muted-foreground font-mono">{l.licenseNumber}</p>
                            </div>
                            <Badge variant={l.status === "OK" ? "outline" : "destructive"}>
                                {l.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                            <span>Expires: <strong>{format(new Date(l.expiryDate), "PPP")}</strong></span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-bold ${l.daysRemaining < 0 ? "text-red-700" : "text-muted-foreground"
                            }`}>
                            <span>{l.daysRemaining} days remaining</span>
                        </div>
                        {l.notes && (
                            <div className="pt-2 border-t text-xs text-muted-foreground">
                                {l.notes}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
            {licenses.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12 border rounded-lg bg-muted/10">
                    No licenses tracked yet.
                </div>
            )}
        </div>
    );
}
