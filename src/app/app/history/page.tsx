import { requireRole } from "@/lib/auth-checks";

export default async function HistoryPage() {
    await requireRole(["OWNER", "STAFF"]);

    return (
        <div className="flex flex-col gap-10 p-6 md:p-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-blue-950 uppercase leading-none">Chronological Archive</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Historical Records & Sequential Mapping</p>
                </div>
            </div>
            <div className="p-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 mt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Archive Exploration Module Under Deployment</p>
            </div>
        </div>
    );
}
