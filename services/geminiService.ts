import { GoogleGenAI } from "@google/genai";

// This check is for robustness, assuming process.env.API_KEY is provided.
if (!process.env.API_KEY) {
  // In a real app, you might want to handle this more gracefully than throwing an error.
  // For this context, it ensures the developer knows the key is missing.
  console.warn("API_KEY environment variable not set. The app will not work without it.");
}

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
