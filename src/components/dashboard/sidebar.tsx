import Link from "next/link";
import { Droplets, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./nav-links";
import { auth } from "@/auth";
import { DayStatusBadge } from "./day-status-badge";
import { NetworkStatus } from "./network-status"; // Assuming we want this in sidebar or header

export async function Sidebar() {
    const session = await auth();
    const role = session?.user?.role || "STAFF";

    return (
        <div className="hidden border-r bg-white lg:block shadow-sm">
            <div className="flex h-full max-h-screen flex-col gap-4">
                <div className="flex h-20 items-center px-6 border-b border-slate-50">
                    <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Droplets className="h-6 w-6 text-white fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-950 font-black text-lg tracking-tighter leading-tight uppercase">Kool Joo</span>
                            <span className="text-blue-600 font-bold text-[8px] tracking-[0.3em] uppercase leading-none">Management</span>
                        </div>
                    </Link>
                </div>

                <div className="px-4">
                    <DayStatusBadge />
                </div>

                <div className="flex-1 overflow-y-auto pt-2">
                    <nav className="grid items-start px-2 lg:px-4 space-y-1">
                        <NavLinks role={role} />
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {session?.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden text-ellipsis">
                            <div className="text-sm font-bold text-blue-950 truncate">{session?.user?.name}</div>
                            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{role}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
