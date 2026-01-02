"use client";

import { useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Check } from "lucide-react";
import { confirmMatch } from "@/lib/actions/transfer-actions";
import { format } from "date-fns";

type Props = {
    transfers: any[];
    statementRows: any[];
    suggestions: any[];
};

export function MatchingWorkspace({ transfers, statementRows, suggestions }: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
            {/* Left: Unmatched Transfers */}
            <div className="flex flex-col gap-4 border rounded-md p-4 bg-white dark:bg-zinc-900 overflow-y-auto">
                <h3 className="font-bold text-sm uppercase text-muted-foreground sticky top-0 bg-white dark:bg-zinc-900 py-2">
                    Pending Transfers ({transfers.length})
                </h3>
                {transfers.map(t => (
                    <Card key={t.id} className="p-3 bg-red-50 dark:bg-red-950/20 border-red-100 cursor-pointer hover:bg-red-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-bold">{t.senderName}</div>
                                <div className="text-xs text-muted-foreground">{format(new Date(t.claimedAt), "MMM d HH:mm")}</div>
                            </div>
                            <div className="font-bold font-mono">₦{t.amountNaira.toLocaleString()}</div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Center: Suggestions */}
            <div className="flex flex-col gap-4 border rounded-md p-4 bg-slate-50 dark:bg-zinc-800 overflow-y-auto">
                <h3 className="font-bold text-sm uppercase text-muted-foreground text-center sticky top-0 bg-slate-50 dark:bg-zinc-800 py-2">
                    Suggested Matches
                </h3>
                {suggestions.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10">No matches found.</div>
                ) : (
                    suggestions.map((pair, idx) => (
                        <MatchCard key={idx} pair={pair} />
                    ))
                )}
            </div>

            {/* Right: Unmatched Statement Rows */}
            <div className="flex flex-col gap-4 border rounded-md p-4 bg-white dark:bg-zinc-900 overflow-y-auto">
                <h3 className="font-bold text-sm uppercase text-muted-foreground sticky top-0 bg-white dark:bg-zinc-900 py-2">
                    Statement Rows ({statementRows.length})
                </h3>
                {statementRows.map(r => (
                    <Card key={r.id} className="p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-100 cursor-pointer hover:bg-blue-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-bold">{r.senderName}</div>
                                <div className="text-xs text-muted-foreground">{format(new Date(r.postedAt), "MMM d")}</div>
                                <div className="text-[10px] text-muted-foreground truncate max-w-[100px]">{r.reference}</div>
                            </div>
                            <div className="font-bold font-mono">₦{r.amountNaira.toLocaleString()}</div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function MatchCard({ pair }: { pair: any }) {
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        startTransition(async () => {
            try {
                await confirmMatch(pair.transfer.id, pair.statementRow.id);
            } catch (e) {
                alert(e);
            }
        });
    };

    return (
        <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-white text-green-700 border-green-200">
                        {Math.round(pair.confidence * 100)}% Confidence
                    </Badge>
                    {isPending ? (
                        <span className="text-xs text-muted-foreground">Linking...</span>
                    ) : (
                        <Button size="sm" className="h-7 bg-green-600 hover:bg-green-700" onClick={handleConfirm}>
                            <Check className="w-3 h-3 mr-1" /> Confirm
                        </Button>
                    )}
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="text-right flex-1 pr-2 border-r border-green-200">
                        <div className="font-bold">{pair.transfer.senderName}</div>
                        <div className="font-mono">₦{pair.transfer.amountNaira.toLocaleString()}</div>
                    </div>
                    <div className="px-2 text-green-400">
                        <ArrowLeftRight className="w-4 h-4" />
                    </div>
                    <div className="text-left flex-1 pl-2">
                        <div className="font-bold">{pair.statementRow.senderName}</div>
                        <div className="font-mono">₦{pair.statementRow.amountNaira.toLocaleString()}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
