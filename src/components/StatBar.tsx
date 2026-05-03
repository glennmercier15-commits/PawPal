import React from 'react';
import { motion } from 'motion/react';

interface StatBarProps {
  label: string;
  value: number;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value }) => {
  const barColor = value > 60 ? 'var(--color-pal-success)' : value > 30 ? 'var(--color-pal-gold)' : 'var(--color-pal-danger)';

  return (
    <div className="flex flex-row items-center gap-2 w-full">
      <div className="w-[110px] text-[14px] font-semibold text-pal-text">
        {label}
      </div>
      <div className="flex-1 bg-[#F0D4E8] rounded-[10px] h-4 overflow-hidden">
        <motion.div 
          className="h-full rounded-[10px]"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
      <div className="w-[30px] text-[13px] text-pal-text text-right">
        {Math.round(value)}
      </div>
    </div>
  );
};
