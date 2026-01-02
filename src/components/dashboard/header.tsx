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
        <header className="flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-4 lg:h-20 lg:px-8 sticky top-0 z-30 justify-between md:justify-end">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden border-slate-200">
                        <Menu className="h-5 w-5 text-blue-900" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 border-r-0">
                    <div className="p-6 border-b border-slate-50">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Droplets className="h-6 w-6 text-white fill-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-blue-950 font-black text-lg tracking-tighter leading-tight uppercase">Kool Joo</span>
                                <span className="text-blue-600 font-bold text-[8px] tracking-[0.3em] uppercase leading-none">Management</span>
                            </div>
                        </Link>
                    </div>
                    <div className="p-4 flex-1">
                        <nav className="grid gap-1 font-bold">
                            <NavLinks role={role} />
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
                <GlobalSearch />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <form action={signOutAction}>
                        <button className="w-full text-left"><DropdownMenuItem>Logout</DropdownMenuItem></button>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

