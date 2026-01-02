import Link from "next/link";
import { CircleUser, Menu, Package2 } from "lucide-react";
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
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-4 lg:h-[60px] lg:px-6 dark:bg-gray-800/40">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    {/* Accessibility for Sheet */}
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>
                        Main navigation for Kool Joo Business Ledger.
                    </SheetDescription>
                    <nav className="grid gap-2 text-lg font-medium">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Kool Joo</span>
                        </Link>
                        <NavLinks role={role} />
                    </nav>
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
