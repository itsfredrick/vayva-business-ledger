import Link from "next/link";
import { CircleUser, Menu, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { NavLinks } from "./nav-links";
import { GlobalSearch } from "@/components/search/global-search";

import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions";

export async function Header() {
    const session = await auth();
    const role = session?.user?.role || "STAFF";

    return (
        <header className="flex h-20 items-center gap-4 bg-white/80 backdrop-blur-xl px-6 lg:px-10 sticky top-0 z-30 justify-between md:justify-end border-b border-blue-100/50 shadow-sm transition-all">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 md:hidden text-blue-900 hover:bg-blue-50">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 border-r-0 bg-blue-950 text-white">
                    {/* Mobile Sidebar Content */}
                    <div className="p-6 border-b border-blue-900/50">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Droplets className="h-6 w-6 text-white fill-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-lg tracking-tighter leading-tight uppercase">Kool Joo</span>
                                <span className="text-blue-400 font-bold text-[8px] tracking-[0.3em] uppercase leading-none">Management</span>
                            </div>
                        </Link>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto">
                        <nav className="grid gap-2 font-bold">
                            <NavLinks role={role} />
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>

            <div className="hidden md:flex flex-1 items-center gap-4">
                {/* Placeholder for Breadcrumbs or Page Title */}
                <div className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    System Operational
                </div>
            </div>

            <div className="w-full md:w-auto md:min-w-[300px]">
                <GlobalSearch />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 border border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-700">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-blue-100">
                    <DropdownMenuLabel className="font-bold text-blue-950">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer focus:bg-blue-50 focus:text-blue-700">Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <form action={signOutAction}>
                        <button className="w-full text-left"><DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">Logout</DropdownMenuItem></button>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

