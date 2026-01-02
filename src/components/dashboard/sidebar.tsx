import Link from "next/link";
import { Droplets } from "lucide-react";
import { NavLinks } from "./nav-links";
import { auth } from "@/auth";
import { DayStatusBadge } from "./day-status-badge";

export async function Sidebar() {
    const session = await auth();
    const role = session?.user?.role || "STAFF";

    return (
        <div className="hidden border-r border-blue-900/50 bg-blue-950 text-white lg:block shadow-xl relative overflow-hidden transition-all duration-300">
            {/* Ambient Background Effect */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[40%] bg-blue-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[100px]" />
            </div>

            <div className="flex h-full max-h-screen flex-col gap-2 relative z-10">
                {/* Header */}
                <div className="flex h-24 items-center px-6 border-b border-blue-900/50 hover:bg-white/5 transition-colors">
                    <Link href="/" className="flex items-center gap-4 group w-full">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300 ring-1 ring-blue-400/20">
                            <Droplets className="h-6 w-6 text-white fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-xl tracking-tighter leading-none uppercase italic group-hover:text-blue-200 transition-colors">Kool Joo</span>
                            <span className="text-blue-400 font-bold text-[9px] tracking-[0.3em] uppercase leading-none mt-1 opacity-80 group-hover:opacity-100 transition-opacity">Management</span>
                        </div>
                    </Link>
                </div>

                {/* Day Status */}
                <div className="px-6 py-6">
                    <DayStatusBadge />
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
                    <NavLinks role={role} />
                </div>

                {/* User Profile */}
                <div className="p-6 border-t border-blue-900/50 bg-blue-900/30 backdrop-blur-md">
                    <div className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-800 border border-blue-700 flex items-center justify-center text-blue-200 font-black text-sm shadow-sm ring-2 ring-blue-900/50 group-hover:ring-blue-500/50 transition-all">
                            {session?.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <div className="text-sm font-bold text-white truncate group-hover:text-blue-200 transition-colors">{session?.user?.name}</div>
                            <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest group-hover:text-blue-300 transition-colors">{role}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
