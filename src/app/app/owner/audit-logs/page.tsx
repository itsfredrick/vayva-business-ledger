import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAuditLogs, getAuditMetadata } from "@/lib/actions/audit-actions";
import { format } from "date-fns";
import AuditLogsClient from "./audit-logs-client";

export default async function AuditLogsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth();
    if (session?.user?.role !== "OWNER") redirect("/login");

    const params = await searchParams;
    const entityType = params.entityType as string | undefined;
    const action = params.action as string | undefined;
    const userId = params.userId as string | undefined;
    const page = parseInt(params.page as string || "1");
    const limit = 50;
    const offset = (page - 1) * limit;

    const [logsData, metadata] = await Promise.all([
        getAuditLogs({ entityType, action, userId, limit, offset }),
        getAuditMetadata()
    ]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit Log Explorer</h1>
                    <p className="text-muted-foreground">Monitor all critical actions and changes across the system.</p>
                </div>
            </div>

            <AuditLogsClient
                initialLogs={logsData.logs}
                total={logsData.total}
                metadata={metadata}
                filters={{ entityType, action, userId, page }}
            />
        </div>
    );
}
