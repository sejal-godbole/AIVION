"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateLinkedinPost(userInput) {
  if (!userInput || userInput.length < 5) {
    throw new Error("Please input something substantial.");
  }

  try {
    // 1. Generate Text (Gemini)
    const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const textPrompt = `
      Act as a viral LinkedIn "Thought Leader".
      Rewrite this simple thought into a long, cringey, multi-paragraph post about "hustle," "mindset," and B2B success.
      INPUT: "${userInput}"
      GUIDELINES: Use short sentences, lots of line breaks, 5+ emojis, and end with a question like "Agree?". Add 3 hashtags. No bold markdown. Use English language, good for Indian users
    `;
    
    const textResponse = await textModel.generateContent(textPrompt);
    const textContent = textResponse.response.text();

    // 2. Generate Image URL (Pollinations.ai)
    // FIX: Sanitize input (remove newlines) and limit length to avoid URL errors
    const sanitizedInput = userInput.replace(/\n/g, " ").slice(0, 100); 
    const cleanPrompt = encodeURIComponent(`${sanitizedInput} corporate professional photography 4k linkedin style`);
    const randomSeed = Math.floor(Math.random() * 10000); 
    
    // Using 'turbo' model for faster loading, or remove model param to use default
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&seed=${randomSeed}&nologo=true&model=flux`;

    return { content: textContent, imageUrl: imageUrl };

  } catch (error) {
    console.error("Post Generation Error:", error);
    return { error: "Failed to generate post. Please try again." };
  }
}