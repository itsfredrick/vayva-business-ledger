import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export async function requireRole(allowedRoles: Role[]) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    if (!allowedRoles.includes(session.user.role as Role)) {
        // Redirect to their default home based on role, or a 403 page
        if (session.user.role === "OWNER") {
            redirect("/app/dashboard");
        } else {
            redirect("/app/today");
        }
    }
}

export async function checkRole(allowedRoles: Role[]) {
    const session = await auth();
    if (!session?.user) return false;
    return allowedRoles.includes(session.user.role as Role);
}
