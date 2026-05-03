export const MEMORY_KEY = 'pawpal_pet_memory';

export interface PetMemory {
  childName:       string;
  favoriteColor:   string;
  favoriteAnimal:  string;
  favoriteFood:    string;
  age:             number | null;
  hobbies:         string[];          // ['drawing', 'dancing', 'reading']
  moodHistory:     string[];          // last 7 moods ['happy','sad','excited']
  lastMood:        string;
  totalChats:      number;
  topicsDiscussed: string[];          // ['school', 'family', 'games']
  questionsAsked:  string[];          // track what child asks about most
  lessonProgress:  Record<string, number>;          // { letters: 3, numbers: 5, colors: 2 }
  vocabularyLevel: string;  // beginner | intermediate | advanced
  bondLevel:       number;           // 1–10, increases with interaction
  nicknames:       string[];          // names the child calls the pet
  sharedMemories:  string[];          // ['we played fetch on Monday', ...]
  lastChatDate:    number | null;
}

export const DEFAULT_MEMORY: PetMemory = {
  childName:       '',
  favoriteColor:   '',
  favoriteAnimal:  '',
  favoriteFood:    '',
  age:             null,
  hobbies:         [],          
  moodHistory:     [],          
  lastMood:        'happy',
  totalChats:      0,
  topicsDiscussed: [],          
  questionsAsked:  [],          
  lessonProgress:  {},          
  vocabularyLevel: 'beginner',  
  bondLevel:       1,           
  nicknames:       [],          
  sharedMemories:  [],          
  lastChatDate:    null,
};

export function loadMemory(): PetMemory {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    return raw ? { ...DEFAULT_MEMORY, ...JSON.parse(raw) } : { ...DEFAULT_MEMORY };
  } catch {
    return { ...DEFAULT_MEMORY };
  }
}

export function saveMemory(memory: PetMemory): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch (err) {
    console.error('Failed to save memory', err);
  }
}

export function updateMemory(updates: Partial<PetMemory>): PetMemory {
  const current = loadMemory();
  const updated = { ...current, ...updates };
  saveMemory(updated);
  return updated;
}

export function extractFacts(userText: string, memory: PetMemory): Partial<PetMemory> {
  const text  = userText.toLowerCase();
  const updates: Partial<PetMemory> = {};

  // Learn favorite color
  const colorMatch = text.match(/my fav(?:ou?rite)? colou?r is (\w+)/);
  if (colorMatch) updates.favoriteColor = colorMatch[1];

  // Learn child's name
  const nameMatch = text.match(/my name is (\w+)|i(?:'m| am) (\w+)/);
  if (nameMatch) {
    const name = nameMatch[1] || nameMatch[2];
    if (name !== memory.childName) updates.childName = name;
  }

  // Learn age
  const ageMatch = text.match(/i(?:'m| am) (\d+)(?: years old)?/);
  if (ageMatch) {
    const age = parseInt(ageMatch[1], 10);
    if (age >= 4 && age <= 14 && age !== memory.age) {
      updates.age = age;
      updates.vocabularyLevel = age <= 6 ? 'beginner' : age <= 9 ? 'intermediate' : 'advanced';
    }
  }

  // Learn hobbies
  const hobbyWords = ['drawing', 'dancing', 'singing', 'reading', 'swimming',
                      'painting', 'cooking', 'running', 'playing', 'crafts'];
  hobbyWords.forEach(h => {
    if (text.includes(h) && !memory.hobbies.includes(h)) {
      updates.hobbies = [...(memory.hobbies || []), h].slice(0, 10);
    }
  });

  // Track topics
  const topics = ['school', 'family', 'friends', 'games', 'animals', 'food', 'music'];
  topics.forEach(t => {
    if (text.includes(t) && !memory.topicsDiscussed.includes(t)) {
      updates.topicsDiscussed = [...(memory.topicsDiscussed || []), t];
    }
  });

  return updates;
}
