
import { GoogleGenAI } from "@google/genai";
import { CollegeEvent } from "./types";

export const getGeminiResponse = async (userPrompt: string, events: CollegeEvent[]) => {
  // Initialize right before call to ensure we have the latest API key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      System: You are UniEvent Bot, an AI assistant for a college event portal.
      Context: Here is the current list of events: ${JSON.stringify(events)}.
      User Request: ${userPrompt}
      Instruction: Answer questions accurately based on the provided event data. If the event is not in the list, state that you don't have information about it. Keep responses helpful and concise. Use markdown for lists or bold text.
    `,
  });

  return response.text || "I'm sorry, I couldn't process that request.";
};
