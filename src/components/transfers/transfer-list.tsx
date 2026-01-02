import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

type Transfer = {
    id: string;
    claimedAt: Date;
    senderName: string;
    amountNaira: number;
    bankAccountLabel: string;
    status: string;
    // ... relations
};

export function TransferList({ transfers }: { transfers: Transfer[] }) {
    return (
        <div className="border rounded-md bg-white dark:bg-black">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Sender</TableHead>
                        <TableHead>Bank</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transfers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                No pending transfers.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transfers.map(t => (
                            <TableRow key={t.id}>
                                <TableCell className="font-mono text-xs">
                                    {format(new Date(t.claimedAt), "MMM d HH:mm")}
                                </TableCell>
                                <TableCell className="font-medium">{t.senderName}</TableCell>
                                <TableCell className="text-muted-foreground">{t.bankAccountLabel}</TableCell>
                                <TableCell className="text-right font-bold">₦{t.amountNaira.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={t.status === "PENDING" ? "secondary" : "outline"}>
                                        {t.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
