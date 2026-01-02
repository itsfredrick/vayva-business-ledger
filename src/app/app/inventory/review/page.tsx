import { requireRole } from "@/lib/auth-checks";
import { getInventoryHistory } from "@/lib/actions/inventory-actions";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function InventoryReviewPage() {
    await requireRole(["OWNER"]);
    const history = await getInventoryHistory();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Inventory Review</h1>
                <p className="text-muted-foreground">Historical production and reconciliation logs.</p>
            </div>

            <div className="border rounded-md bg-white dark:bg-black">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Opening</TableHead>
                            <TableHead className="text-right text-green-600">+ Produced</TableHead>
                            <TableHead className="text-right text-red-600">- Spoilage</TableHead>
                            <TableHead className="text-right text-orange-600">- Out</TableHead>
                            <TableHead className="text-right">Computed</TableHead>
                            <TableHead className="text-right">Confirmed</TableHead>
                            <TableHead className="text-right">Variance</TableHead>
                            <TableHead>Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                    No inventory records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            history.map(record => {
                                const outTotal = record.outgoingDriverLoadsBags + record.outgoingOfficeSalesBags;
                                const hasHighVariance = Math.abs(record.varianceBags) > 50;

                                return (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-mono">
                                            {format(new Date(record.day.date), "MMM d")}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">{record.openingBags}</TableCell>
                                        <TableCell className="text-right font-medium">{record.producedBags}</TableCell>
                                        <TableCell className="text-right text-red-500">{record.spoilageBags}</TableCell>
                                        <TableCell className="text-right text-orange-600">-{outTotal}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{record.closingBagsComputed}</TableCell>
                                        <TableCell className="text-right font-bold">
                                            {record.closingBagsConfirmed ?? "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {record.closingBagsConfirmed !== null && (
                                                <Badge variant={hasHighVariance ? "destructive" : (record.varianceBags === 0 ? "outline" : "secondary")}>
                                                    {record.varianceBags > 0 ? "+" : ""}{record.varianceBags}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                                            {record.notes}
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
