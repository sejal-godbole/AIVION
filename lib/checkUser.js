import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

// Returns the application user record for the currently logged-in Clerk user.
// If the user does not exist in the DB, create it.
export async function checkUser() {
    const user = await currentUser();

    if (!user) {
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