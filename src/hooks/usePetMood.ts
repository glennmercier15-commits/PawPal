import { usePetStore } from '../store/usePetStore';

export function usePetMood() {
  const { hunger, happy, energy, clean } = usePetStore();
  const avg = (hunger + happy + energy + clean) / 4;

  if (avg >= 80) return { mood: 'ecstatic',  message: "I'm so happy! 🥰",           emoji: '🌟' };
  if (avg >= 60) return { mood: 'happy',     message: "I feel great today! 💖",      emoji: '😊' };
  if (avg >= 40) return { mood: 'okay',      message: "I'm okay... pay attention 🐾", emoji: '😐' };
  if (avg >= 20) return { mood: 'sad',       message: "I need your help 😢",         emoji: '😢' };
  return              { mood: 'critical',  message: "Please take care of me! 💔",   emoji: '😰' };
}
