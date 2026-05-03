import React, { useEffect, useState } from 'react';
import { loadMemory, PetMemory } from '../utils/memory';
import { useTheme } from '../theme/ThemeContext';
import { motion } from 'motion/react';

export const MemoryCard: React.FC = () => {
  const [memory, setMemory] = useState<PetMemory | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setMemory(loadMemory());
    
    // Add event listener to refresh memory when returning from chat
    const handleFocus = () => {
      setMemory(loadMemory());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (!memory) return null;

  const facts = [
    memory.childName     && `👋 Name: ${memory.childName}`,
    memory.age           && `🎂 Age: ${memory.age}`,
    memory.favoriteColor && `🎨 Fav colour: ${memory.favoriteColor}`,
    memory.hobbies?.length > 0 && `🎯 Loves: ${memory.hobbies.slice(0, 3).join(', ')}`,
    memory.totalChats > 0 && `💬 Chats: ${memory.totalChats}`,
  ].filter(Boolean);

  const bondPercentage = Math.min(100, (memory.bondLevel / 10) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] p-5 shadow-sm mb-6 border-2 border-pal-primary/10"
      style={{ backgroundColor: theme.card }}
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
        <span>🧠</span> What I Remember About You
      </h3>
      
      {facts.length === 0 ? (
        <p className="text-[15px] italic opacity-70 mb-2" style={{ color: theme.text }}>
          Keep chatting so I can learn about you! 💖
        </p>
      ) : (
        <div className="space-y-2.5 mb-5">
          {facts.map((f, i) => (
            <p key={i} className="text-[15px] font-medium" style={{ color: theme.text }}>
              {f}
            </p>
          ))}
        </div>
      )}

      <div className="mt-2">
        <h4 className="text-[14px] font-bold mb-2 flex justify-between" style={{ color: theme.text }}>
          <span>💖 Bond Level</span>
          <span>{Math.floor(memory.bondLevel)}/10</span>
        </h4>
        <div className="h-3 w-full rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${bondPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-pal-primary"
          />
        </div>
      </div>
    </motion.div>
  );
};
