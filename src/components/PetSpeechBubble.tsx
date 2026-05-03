import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PetSpeechBubbleProps {
  message?: string | null;
}

export const PetSpeechBubble: React.FC<PetSpeechBubbleProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-pal-card px-5 py-3 rounded-3xl shadow-lg border-2 border-pal-primary/20 min-w-[160px] text-center z-10"
        >
          <p className="text-sm font-bold text-pal-text">{message}</p>
          <div className="absolute w-4 h-4 bg-pal-card border-b-2 border-r-2 border-pal-primary/20 transform rotate-45 -bottom-2.5 left-1/2 -translate-x-1/2 rounded-sm"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
