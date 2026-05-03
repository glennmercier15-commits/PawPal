export const BLOCKED_TOPICS = [
  'kill', 'die', 'dead', 'blood', 'hurt yourself', 'suicide',
  'address', 'phone number', 'school name', 'where do you live',
  'secret', "don't tell", 'stranger', 'alone',
  'scary', 'horror', 'nightmare',
];

export const SAFE_FALLBACKS = [
  "Ooh let's talk about something fun! What's your favourite game? 🎮",
  "I'd rather talk about happy things! What made you smile today? 😊",
  "Let's play! Can you name 3 animals you love? 🐾",
  "Tell me something amazing about yourself! ✨",
];

export function filterUserInput(text: string) {
  const lower = text.toLowerCase();
  const blocked = BLOCKED_TOPICS.some(t => lower.includes(t));
  return { safe: !blocked, flagged: blocked };
}

export function filterAIResponse(text: string) {
  const lower = text.toLowerCase();
  const hasIssue = BLOCKED_TOPICS.slice(0, 6).some(t => lower.includes(t));
  if (hasIssue) {
    return SAFE_FALLBACKS[Math.floor(Math.random() * SAFE_FALLBACKS.length)];
  }
  return text;
}

// Special handler for emotional distress signals
export function detectDistress(text: string) {
  const distressWords = ['sad', 'cry', 'crying', 'lonely', 'nobody likes', 'hate myself',
                         'scared', 'afraid', 'hurt', 'angry', 'nobody cares'];
  const lower = text.toLowerCase();
  return distressWords.some(w => lower.includes(w));
}

export const DISTRESS_RESPONSE =
  "I'm so glad you told me that 🥺 You're so important and loved. " +
  "Please give a big hug to a grown-up you trust and tell them how you feel. " +
  "I'll always be here for you too 💖";
