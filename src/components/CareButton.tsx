import React from 'react';
import { motion } from 'motion/react';

interface CareButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
  disabled?: boolean;
}

export const CareButton: React.FC<CareButtonProps> = ({ label, icon, onClick, colorClass, disabled = false }) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={disabled ? undefined : onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-3xl shadow-sm border-2 border-white/50 w-24 h-24 ${disabled ? 'opacity-50 cursor-not-allowed bg-pal-text/10 text-pal-text/50' : colorClass}`}
    >
      <div className="mb-2 w-10 h-10 flex items-center justify-center bg-white/50 rounded-full">
        {icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </motion.button>
  );
};
