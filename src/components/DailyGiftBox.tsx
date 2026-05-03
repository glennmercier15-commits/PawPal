import React, { useState, useEffect } from 'react';
import { usePetStore } from '../store/usePetStore';
import { useTheme } from '../theme/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

const GIFTS = [
  { label: '🪙 10 Paw Coins',   type: 'coins',  value: 10  },
  { label: '🪙 20 Paw Coins',   type: 'coins',  value: 20  },
  { label: '🎀 Pink Bow',       type: 'item',   value: '1' },
  { label: '🌟 50 Paw Coins',   type: 'coins',  value: 50  },
  { label: '🌟 100 Paw Coins',  type: 'coins',  value: 100 },
];

export default function DailyGiftBox() {
  const [available, setAvailable] = useState(false);
  const [opened, setOpened] = useState(false);
  const [gift, setGift] = useState<{ label: string; type: string; value: string | number } | null>(null);
  const { addCoins, addOwnedItem } = usePetStore();
  const { theme, isDark } = useTheme();

  useEffect(() => {
    const last = localStorage.getItem('pawpal_last_gift');
    const now = Date.now();
    // 86400000 = 24 hours
    if (!last || now - parseInt(last, 10) > 86400000) {
      setAvailable(true);
    }
  }, []);

  const openGift = () => {
    const picked = GIFTS[Math.floor(Math.random() * GIFTS.length)];
    setGift(picked);
    setOpened(true);
    localStorage.setItem('pawpal_last_gift', Date.now().toString());
    
    if (picked.type === 'coins') {
      addCoins(picked.value as number);
    } else if (picked.type === 'item') {
      addOwnedItem(picked.value as string);
    }
    
    // Fade out after a few seconds
    setTimeout(() => {
      setAvailable(false);
    }, 4000);
  };

  if (!available) return null;

  return (
    <AnimatePresence>
      <motion.button 
        onClick={!opened ? openGift : undefined}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, height: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
        className="p-5 rounded-3xl mt-4 w-full flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={{ 
          backgroundColor: theme.card,
          boxShadow: isDark ? '0px 4px 12px rgba(0,0,0,0.3)' : '0px 4px 12px rgba(0,0,0,0.05)',
          border: opened ? `2px solid ${theme.border}` : `2px dashed ${theme.text}`,
          cursor: !opened ? 'pointer' : 'default'
        }}
      >
        {!opened ? (
          <>
            <motion.div 
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="text-5xl mb-2 drop-shadow-md"
            >
              🎁
            </motion.div>
            <span className="font-bold tracking-tight text-lg" style={{ color: theme.text }}>
              Daily Gift! Tap to open!
            </span>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="text-5xl mb-2 drop-shadow-md pb-2">🎉</div>
            <span className="font-bold tracking-tight text-lg" style={{ color: theme.text }}>
              You got: {gift?.label}
            </span>
          </motion.div>
        )}
      </motion.button>
    </AnimatePresence>
  );
}
