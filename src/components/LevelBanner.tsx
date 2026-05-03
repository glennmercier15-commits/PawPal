import React from 'react';
import { usePetStore } from '../store/usePetStore';
import { useTheme } from '../theme/ThemeContext';
import { motion } from 'motion/react';

export default function LevelBanner() {
  const { coins } = usePetStore();
  const { theme, isDark } = useTheme();
  
  const level     = Math.floor(coins / 50) + 1;
  const xp        = coins % 50;
  const xpPercent = (xp / 50) * 100;

  return (
    <div 
      className="flex flex-row items-center rounded-2xl px-4 py-2.5 mx-4 mb-3 gap-3 transition-colors duration-300"
      style={{
        backgroundColor: theme.card,
        boxShadow: isDark 
          ? '0px 2px 6px rgba(0, 0, 0, 0.4)' 
          : '0px 2px 6px rgba(192, 96, 144, 0.15)',
      }}
    >
      <div className="flex flex-row items-center gap-1">
        <span className="text-base font-bold" style={{ color: theme.text }}>Lv.{level}</span>
        <span className="text-base leading-none">⭐</span>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div 
          className="h-2.5 rounded-md overflow-hidden transition-colors duration-300"
          style={{ backgroundColor: theme.border }}
        >
          <motion.div 
            className="h-full rounded-md"
            style={{ backgroundColor: '#FFD54F' }}
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ type: 'spring', bounce: 0.4, duration: 1 }}
          />
        </div>
        <span className="text-[11px] font-semibold" style={{ color: theme.textLight }}>
          {xp} / 50 XP
        </span>
      </div>
    </div>
  );
}
