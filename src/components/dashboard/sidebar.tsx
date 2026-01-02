import Link from "next/link";
import { Package2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./nav-links";
import { auth } from "@/auth";
import { DayStatusBadge } from "./day-status-badge";
import { NetworkStatus } from "./network-status"; // Assuming we want this in sidebar or header

export async function Sidebar() {
    const session = await auth();
    const role = session?.user?.role || "STAFF";

    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">Vayva</span>
                    </Link>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </div>

                <DayStatusBadge />
                <NetworkStatus />

                <div className="flex-1 overflow-y-auto">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <NavLinks role={role} />
                    </nav>
                </div>

                {/* User Info Footer in Sidebar */}
                <div className="p-4 border-t mt-auto">
                    <div className="text-sm font-medium">{session?.user?.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{role.toLowerCase()}</div>
                </div>
            </div>
        </div>
    );
}
