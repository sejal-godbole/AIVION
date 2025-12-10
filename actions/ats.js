"use server";

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function checkATSScore(data) {
  // 1. Auth Check
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  // Data is now a simple object, not FormData
  const { resumeText, jobDescription } = data;

  if (!resumeText || !jobDescription) {
    return { success: false, error: "Missing resume text or JD" };
  }

  try {
    // 2. Initialize AI (No PDF parsing here anymore!)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

   const prompt = `
      You are an expert ATS scanner.
      Job Description: "${jobDescription}"
      Resume Content: "${resumeText}"
      
      Analyze the match and return a JSON object with this EXACT structure:
      {
        "atsScore": number, // Total score 0-100
        "matchStatus": "string", // "High", "Medium", "Low"
        "breakdown": {
            "technicalSkills": number, // 0-100
            "softSkills": number, // 0-100
            "experience": number, // 0-100
            "education": number, // 0-100
            "communication": number // 0-100
        },
        "missingKeywords": [],
        "summary": "string",
        "strengths": [],
        "weaknesses": [],
        "improvementPlan": "string"
      }
      IMPORTANT: Return ONLY raw JSON. Do not use Markdown blocks.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
      
    const analysis = JSON.parse(responseText);

    return { success: true, data: analysis };

  } catch (error) {
    console.error("AI Error:", error);
    return { success: false, error: "Failed to analyze resume. Please try again." };
  }
}