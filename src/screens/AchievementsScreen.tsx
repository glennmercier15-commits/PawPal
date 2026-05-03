import React from 'react';
import { ACHIEVEMENTS } from '../constants/achievements';
import { usePetStore } from '../store/usePetStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTheme } from '../theme/ThemeContext';

export const AchievementsScreen: React.FC = () => {
  const stats = usePetStore(s => s.achievementStats);
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();

  // Handle initialization of achievementStats
  if (!stats) {
    return <div className="p-6">Loading...</div>;
  }

  const earnedIds = ACHIEVEMENTS.filter(a => a.condition(stats)).map(a => a.id);

  return (
    <div className="min-h-screen w-full flex flex-col p-6 pt-12 safe-top transition-colors duration-300 pb-32" style={{ backgroundColor: theme.background }}>
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
          style={{ backgroundColor: theme.card }}
        >
          <span className="text-xl">🔙</span>
        </button>
        <h1 className="text-2xl font-black text-center" style={{ color: theme.text }}>
          Badges ({earnedIds.length}/{ACHIEVEMENTS.length})
        </h1>
        <div className="w-10" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((item, index) => {
          const earned = earnedIds.includes(item.id);
          const [emoji, ...nameParts] = item.label.split(' ');
          const name = nameParts.join(' ');
          
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center p-4 rounded-3xl text-center relative overflow-hidden"
              style={{ 
                backgroundColor: theme.card,
                opacity: earned ? 1 : 0.6,
                boxShadow: isDark ? '0px 4px 12px rgba(0,0,0,0.3)' : '0px 4px 12px rgba(192, 96, 144, 0.1)',
                border: earned ? `2px solid ${theme.text}` : `2px solid transparent`
              }}
            >
              <div className="text-4xl mb-2 drop-shadow-md">
                {earned ? emoji : '🔒'}
              </div>
              <h3 className="font-bold mb-1 text-sm leading-tight" style={{ color: theme.text }}>
                {name}
              </h3>
              <p className="text-[10px] opacity-70" style={{ color: theme.textLight }}>
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
