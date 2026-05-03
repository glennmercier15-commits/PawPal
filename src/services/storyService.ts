import { GoogleGenAI } from "@google/genai";
import { PetMemory } from "../utils/memory";
import { getAiClient } from "./chatService";
import { filterAIResponse } from "../utils/safety";

export interface StoryPage {
  pageNumber?: number;
  title?: string;
  text: string;
  emoji: string;
}

export interface GeneratedStory {
  title: string;
  pages: StoryPage[];
}

export const STORY_THEMES = [
  { id: 'space', emoji: '🚀', label: 'In Space' },
  { id: 'ocean', emoji: '🌊', label: 'Under the Sea' },
  { id: 'forest', emoji: '🌲', label: 'Magic Forest' },
  { id: 'castle', emoji: '🏰', label: 'Fairy Castle' },
  { id: 'dreams', emoji: '☁️', label: 'Cloud Kingdom' },
];

export const STORY_MORALS = [
  { id: 'kind', label: 'Being Kind' },
  { id: 'brave', label: 'Being Brave' },
  { id: 'share', label: 'Sharing is Caring' },
  { id: 'try', label: 'Trying New Things' },
  { id: 'friends', label: 'Making Friends' },
];

export async function generatePersonalizedStory(
  memory: PetMemory,
  petName: string,
  petType: string,
  theme?: string,
  moral?: string
): Promise<GeneratedStory> {
  const client = getAiClient();

  const childInfo = [
    memory.childName && `The child's name is ${memory.childName}.`,
    memory.age && `They are ${memory.age} years old.`,
    memory.favoriteColor && `Their favorite color is ${memory.favoriteColor}.`,
    memory.hobbies?.length > 0 && `They love: ${memory.hobbies.join(', ')}.`,
    memory.favoriteAnimal && `Their favorite animal is ${memory.favoriteAnimal}.`,
    memory.favoriteFood && `Their favorite food is ${memory.favoriteFood}.`
  ].filter(Boolean).join(' ');

  const themeText = theme ? `The story should take place in the following setting: ${theme}.` : '';
  const moralText = moral ? `The story should teach the following moral lesson: ${moral}.` : '';

  const prompt = `
You are a creative children's book author. Write a short, personalized 5-page bedtime story about a magical adventure.
The story features the child and their virtual pet friend, ${petName} (a ${petType}).

Here are some details about the child to weave naturally into the story:
${childInfo || 'They love magical adventures and having fun.'}

${themeText}
${moralText}

Make it heartwarming, engaging, and suitable for a young child.

Return ONLY a valid JSON object with the following structure. Do not use markdown wrappers, just the raw JSON:
{
  "title": "A short, cute title for the story",
  "pages": [
    {
      "pageNumber": 1,
      "title": "Page 1 Title",
      "text": "The story text for page 1 (1-2 sentences).",
      "emoji": "🌟"
    },
    // ... 4 more pages
  ]
}
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.85,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text) as GeneratedStory;
      // Apply safety filter to text
      parsed.pages = parsed.pages.map(p => ({
        ...p,
        text: filterAIResponse(p.text)
      }));
      return parsed;
    }
    throw new Error("Empty response from AI");
  } catch (err) {
    console.warn("Failed to generate story", err);
    return {
      title: "The Star That Fell",
      pages: getFallbackStory(petName)
    };
  }
}

// Offline fallback story if API fails
function getFallbackStory(petName: string): StoryPage[] {
  return [
    { pageNumber: 1, title: 'A Quiet Night', emoji: '🌙', text: `Once upon a time, ${petName} looked up at the stars and smiled. The night sky was painted with a thousand tiny lights, each one a little dream waiting to happen.` },
    { pageNumber: 2, title: 'Soft Flowers', emoji: '🌸', text: `${petName} walked through a meadow filled with the softest flowers. Every petal glowed gently, and the sweet smell made everything feel safe and warm.` },
    { pageNumber: 3, title: 'Tiny Firefly', emoji: '✨', text: `A tiny firefly landed on ${petName}'s nose and giggled. "Follow me," it whispered, "I'll show you the most magical place in the world."` },
    { pageNumber: 4, title: 'Cozy Cloud', emoji: '🌈', text: `They found a cozy cloud shaped just like a bed, piled high with the fluffiest pillows. The moon sang a gentle lullaby just for them.` },
    { pageNumber: 5, title: 'Sweet Dreams', emoji: '💫', text: `${petName} curled up and closed their eyes, feeling loved and perfectly safe. And just like that, sweet dreams came floating in, one by one. Goodnight. 🌙` },
  ];
}
