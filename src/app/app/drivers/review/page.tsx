import { requireRole } from "@/lib/auth-checks";

export default async function DriversReviewPage() {
    await requireRole(["OWNER"]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Drivers Review</h1>
            <p>Owner view to review driver performance.</p>
        </div>
    );
}
