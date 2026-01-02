"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
    Home,
    ShoppingCart,
    List,
    Settings,
    FileText,
    Users,
    Truck,
    Droplets,
    CreditCard,
    ClipboardList,
    History,
    Lock,
    Menu
} from "lucide-react";

export interface NavItem {
    name: string;
    href: string;
    icon: any;
    roles: string[];
}

// Staff navigation: Today, Drivers, Pure Water Office Sales, Dispenser, Expenses, Transfers, Inventory, Licenses, History.
// Owner navigation: Dashboard, Today Overview, Drivers Review, Expenses Review, Transfers Matching, Dispenser Billing, Inventory Review, Licenses, Reports, Audit Log, Unlock Requests.

const navItems: NavItem[] = [
    // Owner Routes
    { name: "Dashboard", href: "/app/dashboard", icon: Home, roles: ["OWNER"] },
    { name: "Today Overview", href: "/app/today", icon: ClipboardList, roles: ["OWNER"] },

    // Staff Routes
    { name: "Today", href: "/app/today", icon: ClipboardList, roles: ["STAFF"] },

    // Shared / Similar Logic Routes
    { name: "Drivers", href: "/app/drivers", icon: Truck, roles: ["STAFF"] },
    { name: "Drivers Review", href: "/app/drivers/review", icon: Truck, roles: ["OWNER"] },

    { name: "Pure Water Sales", href: "/app/sales", icon: ShoppingCart, roles: ["STAFF"] },

    { name: "Dispenser Water", href: "/app/dispenser", icon: Droplets, roles: ["STAFF"] },
    { name: "Dispenser Billing", href: "/app/dispenser/billing", icon: Droplets, roles: ["OWNER"] },

    { name: "Expenses", href: "/app/expenses", icon: CreditCard, roles: ["STAFF"] },
    { name: "Expenses Review", href: "/app/expenses/review", icon: CreditCard, roles: ["OWNER"] },

    { name: "Transfers", href: "/app/transfers", icon: List, roles: ["STAFF"] },
    { name: "Transfers Matching", href: "/app/transfers/matching", icon: List, roles: ["OWNER"] },

    { name: "Inventory", href: "/app/inventory", icon: Box, roles: ["STAFF"] },
    { name: "Inventory Review", href: "/app/inventory/review", icon: Box, roles: ["OWNER"] },

    { name: "Licenses", href: "/app/licenses", icon: FileText, roles: ["OWNER", "STAFF"] },

    { name: "History", href: "/app/history", icon: History, roles: ["OWNER", "STAFF"] },

    // Owner Only Extras
    { name: "Reports", href: "/app/reports", icon: FileText, roles: ["OWNER"] },
    { name: "Audit Log", href: "/app/owner/audit-logs", icon: ClipboardList, roles: ["OWNER"] },
    { name: "Unlock Requests", href: "/app/unlock-requests", icon: Lock, roles: ["OWNER"] },
];

import { Box } from "lucide-react"; // Forgot import

export function NavLinks({ role }: { role: string }) {
    const pathname = usePathname();

    return (

        <>
            {navItems.map((link) => {
                if (!link.roles.includes(role)) return null;
                const LinkIcon = link.icon;
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all group relative overflow-hidden",
                            {
                                "bg-blue-600 text-white shadow-lg shadow-blue-900/20": isActive,
                                "text-blue-200 hover:text-white hover:bg-white/10": !isActive,
                            }
                        )}
                    >
                        {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                        )}
                        <LinkIcon className={clsx("h-5 w-5 transition-colors shrink-0", {
                            "text-white": isActive,
                            "text-blue-400 group-hover:text-white": !isActive
                        })} />
                        <span className={clsx("uppercase tracking-wide text-[11px] font-black", {
                            "text-white": isActive,
                            "text-blue-100 group-hover:text-white": !isActive
                        })}>{link.name}</span>
                    </Link>
                );
            })}
        </>
    );
}
