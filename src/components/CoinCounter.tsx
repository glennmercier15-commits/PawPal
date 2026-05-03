import React from 'react';
import { usePetStore } from '../store/usePetStore';
import { Coins } from 'lucide-react';
import { motion } from 'motion/react';

export const CoinCounter: React.FC = () => {
  const coins = usePetStore((state) => state.coins);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2 bg-pal-gold/20 px-4 py-2 rounded-full border-2 border-pal-gold shadow-sm"
    >
      <Coins className="text-pal-gold drop-shadow-sm" size={20} />
      <span className="font-bold text-pal-text font-mono text-lg">{coins}</span>
    </motion.div>
  );
};
