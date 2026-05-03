import { GoogleGenAI } from "@google/genai";
import { loadMemory, updateMemory, extractFacts } from "../utils/memory";
import { buildSystemPrompt } from "../utils/personality";
import { detectDistress, DISTRESS_RESPONSE, filterUserInput, filterAIResponse, SAFE_FALLBACKS } from "../utils/safety";

let ai: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not set. Please add it to your environment variables or secrets.");
      // We still initialize it to avoid crashing the whole module, 
      // but it will fail on the actual call.
    }
    ai = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return ai;
}

export async function sendMessage(
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  petName: string,
  petType: string
): Promise<string> {
  // 1. Safety Filter - Check for distress
  if (detectDistress(message)) {
    return DISTRESS_RESPONSE;
  }

  // 2. Safety Filter - Check for blocked terms
  const userSafety = filterUserInput(message);
  if (!userSafety.safe) {
    return SAFE_FALLBACKS[Math.floor(Math.random() * SAFE_FALLBACKS.length)];
  }

  const client = getAiClient();
  
  const memory = loadMemory();
  const facts = extractFacts(message, memory);
  const updatedMemory = updateMemory({
    ...facts,
    totalChats: memory.totalChats + 1,
    lastChatDate: Date.now()
  });

  const systemInstruction = buildSystemPrompt(updatedMemory, petName, petType);

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.slice(-10), // Limit history to last 10 messages for context window
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    
    const replyText = response.text || "Woof? I'm not sure!";
    
    // 3. Safety Filter - AI Response Output
    return filterAIResponse(replyText);
  } catch (err) {
    console.error("Failed to generate content", err);
    return "*tilts head in confusion* I couldn't hear that!";
  }
}
