import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DayService } from "@/lib/services/day-service";
import { ZodSchema, z } from "zod";

type ValidationContext = {
    userId: string;
    role: "OWNER" | "STAFF";
};

/**
 * Validates inputs against schema, checks authentication, and ensures role access.
 * Optionally allows extra guards like 'requireDayOpen'.
 */
export async function validateAction<T, R>(
    schema: ZodSchema<T>,
    data: T,
    handler: (data: T, context: ValidationContext) => Promise<R>
): Promise<R> {
    // 1. Auth Guard
    const session = await auth();
    if (!session?.user?.id || !["OWNER", "STAFF"].includes(session.user.role || "")) {
        throw new Error("Unauthorized: Insufficient permissions");
    }

    // 2. Schema Validation
    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
        // Flatten errors to a string or custom object
        const errorMsg = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(", ");
        throw new Error(`Validation Error: ${errorMsg}`);
    }

    const context: ValidationContext = {
        userId: session.user.id,
        role: session.user.role as "OWNER" | "STAFF"
    };

    return handler(parseResult.data, context);
}

/**
 * Throws if the Day is not open/editable.
 */
export async function requireDayEditable(dayId: string) {
    const day = await prisma.dayRecord.findUnique({ where: { id: dayId } });
    if (!day) throw new Error("Day record not found");
    if (!DayService.isEditable(day)) {
        throw new Error("Action blocked: Day is closed and locked.");
    }
    return day;
}
