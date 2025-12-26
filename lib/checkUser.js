import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

// Returns the application user record for the currently logged-in Clerk user.
// If the user does not exist in the DB, create it.
export async function checkUser() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    // If no DATABASE_URL is configured (or if SKIP_DB is set), skip DB access.
    // This prevents server-side renders from failing when the DB is unreachable
    // (e.g., during local development or when the remote DB is down).
    if (process.env.SKIP_DB === "true" || !process.env.DATABASE_URL) {
        console.warn("checkUser: skipping database access (SKIP_DB or missing DATABASE_URL)");
        return null;
    }
    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });

        if (loggedInUser) {
            return loggedInUser;
        }

        const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl ?? null,
                email: user.emailAddresses?.[0]?.emailAddress ?? null,
            },
        });

        return newUser;
    } catch (error) {
        console.error("checkUser error:", error?.message ?? error);
        return null;
    }
}