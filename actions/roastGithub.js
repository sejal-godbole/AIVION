"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function roastGithubProfile(username) {
  // 1. Auth Check
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // 2. Fetch GitHub Data
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`),
    ]);

    if (!profileRes.ok) throw new Error("GitHub user not found");

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    const summary = {
      name: profile.name || username,
      bio: profile.bio || "No bio",
      followers: profile.followers,
      public_repos: profile.public_repos,
      repos: repos.map(r => ({ name: r.name, stars: r.stargazers_count })),
    };

    // 3. Generate Roast
    const prompt = `
      Roast this GitHub profile based on their stats: ${JSON.stringify(summary)}.
      Be sarcastic, funny, and short (max 200 words). Use markdown.
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    // 4. Save to Database
    // We check if a roast for this username already exists to update it (optional)
    const roast = await db.githubRoast.create({
      data: {
        userId: user.id,
        username: username,
        content: content,
      },
    });

    return { content };

  } catch (error) {
    console.error("Roast Error:", error);
    return { error: error.message };
  }
}

// Function to get the last roast (Persistence)
export async function getLastRoast() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return null;

  return await db.githubRoast.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}