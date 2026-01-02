import { requireRole } from "@/lib/auth-checks";

export default async function HistoryPage() {
    await requireRole(["OWNER", "STAFF"]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">History</h1>
            <p>View past records.</p>
        </div>
    );
}
