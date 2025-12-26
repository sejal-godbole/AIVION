"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function negotiateSalary(history, currentOffer) {
  try {
    const prompt = `
      You are a stingy, tough HR Manager named "Karen" at a tech startup. 
      The user is negotiating their salary. 
      
      Current Offer: $${currentOffer}
      Goal: $100,000
      
      CONTEXT:
      The user just said: "${history[history.length - 1].content}"
      
      INSTRUCTIONS:
      1. Analyze their argument. 
      2. If their argument is strong (market data, specific skills, value add), increase the offer slightly (by $1k-$5k).
      3. If their argument is weak (begging, "I need money"), aggressive, or unprofessional, DECREASE the offer or keep it same.
      4. If they are rude, rescind the offer (set to 0).
      5. Use corporate speak ("budget is tight", "we offer equity", "great culture").
      6. Be brief (max 2 sentences).
      
      RETURN ONLY JSON:
      {
        "text": "Your response here...",
        "newOffer": 55000
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up markdown if Gemini adds it (e.g. ```json ... ```)
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Negotiation Error:", error);
    return { 
      text: "Let's circle back on this. (System Error)", 
      newOffer: currentOffer 
    };
  }
}