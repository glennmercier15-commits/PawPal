import { usePetStore } from '../store/usePetStore';

const PET_RESPONSES: Record<string, (arg?: any) => string[]> = {
  greeting:   (name: string) => [`Hi ${name}! I missed you! 🥰`, `You're back! I was waiting! 💖`],
  hungry:     ()     => [`My tummy is grumbling... 🍓`, `Feed me please! I'm starving!`],
  happy:      ()     => [`I feel amazing today! ✨`, `You take such good care of me!`],
  bored:      ()     => [`Can we play? I'm bored... 🎾`, `Let's do something fun!`],
  sleepy:     ()     => [`I'm so tired... 💤`, `Can I take a nap please?`],
  levelUp:    (lvl: number)  => [`I levelled up to ${lvl}! I'm growing! 🌟`],
};

export function getPetDialogue(context: keyof typeof PET_RESPONSES, arg?: any) {
  const { name } = usePetStore.getState();
  const args = arg !== undefined ? arg : name;
  const lines = PET_RESPONSES[context]?.(args) ?? ['...'];
  return lines[Math.floor(Math.random() * lines.length)];
}
