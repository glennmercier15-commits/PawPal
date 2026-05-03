import React from 'react';
import { useTheme } from '../theme/ThemeContext';

const STAT_META: Record<string, { emoji: string; label: string; color: string }> = {
  hunger:      { emoji: '🍓', label: 'Hunger',    color: '#FF9ECA' },
  happiness:   { emoji: '⭐', label: 'Happiness', color: '#B388FF' },
  energy:      { emoji: '💤', label: 'Energy',    color: '#80DEEA' },
  cleanliness: { emoji: '🛁', label: 'Clean',     color: '#69F0AE' },
};

export default function NeumorphicStatCard({ statKey, value }: { statKey: string; value: number }) {
  const { theme, isDark } = useTheme();
  const meta     = STAT_META[statKey];
  
  if (!meta) return null;
  
  const barColor = value > 60 ? meta.color : value > 30 ? '#FFD54F' : '#FF6B6B';

  return (
    <div 
      className="flex flex-row items-center rounded-[18px] p-[14px] mb-[10px] transition-colors duration-300"
      style={{
        backgroundColor: theme.background, // Match original background but themable
        boxShadow: isDark 
          ? '-3px -3px 6px rgba(255, 255, 255, 0.03), 3px 3px 6px rgba(0, 0, 0, 0.4)'
          : '-3px -3px 6px rgba(255, 255, 255, 0.8), 3px 3px 6px rgba(208, 128, 144, 0.3)',
      }}
    >
      <div className="flex flex-row items-center w-[110px] gap-2">
        <span className="text-[22px] leading-none">{meta.emoji}</span>
        <span className="text-[14px] font-bold" style={{ color: theme.text }}>{meta.label}</span>
      </div>
      <div className="flex-1 flex flex-row items-center gap-[10px]">
        <div 
          className="flex-1 h-[14px] rounded-[8px] overflow-hidden transition-colors duration-300"
          style={{ backgroundColor: theme.border }}
        >
          <div 
            className="h-full rounded-[8px] transition-all duration-500 ease-out" 
            style={{ width: `${value}%`, backgroundColor: barColor }} 
          />
        </div>
        <span className="w-[28px] text-[13px] font-bold text-right" style={{ color: barColor }}>
          {Math.round(value)}
        </span>
      </div>
    </div>
  );
}
