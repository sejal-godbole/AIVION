"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { companyName, jobTitle, jobDescription, userSkills } = data;

  try {
    // 1. Get the User from DB to retrieve Name, Email, and DB ID
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const userName = user.name || "Candidate";
    const userEmail = user.email || "";

    // 2. Generate Content with AI
    const prompt = `
      Write a professional cover letter for the position of ${jobTitle} at ${companyName}.
      
      CANDIDATE DETAILS:
      Name: ${userName}
      Email: ${userEmail}
      Skills/Experience: ${userSkills}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      GUIDELINES:
      - Format it as a formal letter.
      - Use a professional, persuasive tone.
      - Return ONLY the markdown content, no extra chat text.
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    // 3. Save to Database (Using existing schema)
    // We check if a draft already exists to update it, or create a new one
    // (This prevents creating 100s of letters if the user keeps clicking generate)
    const existingLetter = await db.coverLetter.findFirst({
        where: { 
            userId: user.id,
            // Optional: You could filter by specific job title if you want multiple drafts
        }
    });

    let coverLetter;

    if (existingLetter) {
        // Update existing
        coverLetter = await db.coverLetter.update({
            where: { id: existingLetter.id },
            data: {
                content,
                jobDescription,
                companyName,
                jobTitle,
                status: "completed"
            }
        });
    } else {
        // Create new
        coverLetter = await db.coverLetter.create({
            data: {
                content,
                jobDescription,
                companyName,
                jobTitle,
                status: "completed",
                userId: user.id, // Linking via the DB UUID
            },
        });
    }

    return { content, id: coverLetter.id }; 

  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error(error.message);
  }
}

// Function to load the saved letter on page refresh
export async function getCoverLetter() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return null;

  return await db.coverLetter.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}