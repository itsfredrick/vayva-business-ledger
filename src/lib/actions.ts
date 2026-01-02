"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    const redirectTo = formData.get("redirectTo") as string | undefined;
    try {
        await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirectTo: redirectTo || "/app/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid username or password.";
                default:
                    console.error("Auth Error:", error.type, error);
                    return "Authentication failed. Please try again.";
            }
        }
        console.error("Unexpected Auth Error:", error);
        throw error;
    }
}

export async function signOutAction() {
    await import("@/auth").then((mod) => mod.signOut());
}
