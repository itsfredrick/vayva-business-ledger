import { requireRole } from "@/lib/auth-checks";

export default async function AuditLogPage() {
    await requireRole(["OWNER"]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Audit Log</h1>
            <p>Track system activities.</p>
        </div>
    );
}
