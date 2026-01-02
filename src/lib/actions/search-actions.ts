"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
    id: string;
    type: "DRIVER" | "CUSTOMER" | "PAGE" | "ACTION";
    title: string;
    description?: string;
    url?: string;
    icon?: string;
};

export async function getGlobalSearchItems(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    const results: SearchResult[] = [];

    // Search Drivers
    const drivers = await prisma.driverProfile.findMany({
        where: {
            name: { contains: query }
        },
        take: 5
    });

    drivers.forEach((d) => {
        results.push({
            id: d.id,
            type: "DRIVER",
            title: d.name,
            description: "Driver",
            url: `/app/drivers/${d.id}`,
            icon: "Truck"
        });
    });

    // Search Customers (Dispenser)
    const customers = await prisma.dispenserCustomer.findMany({
        where: {
            OR: [
                { name: { contains: query } },
                { phone: { contains: query } },
                { defaultAddress: { contains: query } }
            ]
        },
        take: 5
    });

    customers.forEach(c => {
        results.push({
            id: c.id,
            type: "CUSTOMER",
            title: c.name,
            description: c.defaultAddress || c.phone || "Customer",
            url: `/app/dispenser/customers?search=${encodeURIComponent(c.name)}`, // Improve this later
            icon: "User"
        });
    });

    return results;
}
