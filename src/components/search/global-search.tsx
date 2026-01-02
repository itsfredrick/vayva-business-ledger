"use client"

import * as React from "react"
import {
    Calculator,
    Calendar,
    CreditCard,
    User,
    Truck,
    Plus,
    ShoppingBag,
    Box,
    Search
} from "lucide-react"
import { useRouter } from "next/navigation"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { getGlobalSearchItems, SearchResult } from "@/lib/actions/search-actions"
import { toast } from "sonner"

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    // Simple local cache for session
    const cache = React.useRef<Record<string, SearchResult[]>>({});

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }
        if (cache.current[query]) {
            setResults(cache.current[query]);
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const items = await getGlobalSearchItems(query);
                cache.current[query] = items;
                setResults(items);
            } catch (e) {
                console.error("Search failed", e);
                toast.error("Search failed");
            } finally {
                setLoading(false);
            }
        }, 150); // Reduced debounce for feel
        return () => clearTimeout(timer);
    }, [query]);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Search...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type to search drivers, customers..."
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>{loading ? "Searching..." : "No results found."}</CommandEmpty>

                    {results.length > 0 && (
                        <CommandGroup heading="Results">
                            {results.map(item => (
                                <CommandItem
                                    key={`${item.type}-${item.id}`}
                                    onSelect={() => runCommand(() => router.push(item.url || '#'))}
                                >
                                    {item.type === 'DRIVER' ? <Truck className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                                    <span>{item.title}</span>
                                    {item.description && <span className="ml-2 text-xs text-muted-foreground truncate">{item.description}</span>}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    <CommandSeparator />

                    <CommandGroup heading="Quick Actions">
                        <CommandItem onSelect={() => runCommand(() => router.push('/app/sales?action=new'))}>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Add New Sale</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/app/drivers'))}>
                            <Truck className="mr-2 h-4 w-4" />
                            <span>Go to Drivers</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/app/sales'))}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>Go to Office Sales</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/app/dispenser'))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Go to Dispenser</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/app/inventory'))}>
                            <Box className="mr-2 h-4 w-4" />
                            <span>Go to Inventory</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/app/expenses'))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Go to Expenses</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
