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
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1600px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">System Sovereignty</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Historical Audit Trail & Critical Integrity Logs</p>
                </div>
            </div>

            <div className="pt-2">
                <AuditLogsClient
                    initialLogs={logsData.logs}
                    total={logsData.total}
                    metadata={metadata}
                    filters={{ entityType, action, userId, page }}
                />
            </div>
        </div>
    );
}
