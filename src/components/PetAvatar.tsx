import React from 'react';
import { motion } from 'motion/react';
import { usePetStore } from '../store/usePetStore';
import { SHOP_ITEMS } from '../constants/shop';
import { getPetStage } from '../utils/petAge';

const PETS = [
  { id: 'bunny',   emoji: '🐰' },
  { id: 'puppy',   emoji: '🐶' },
  { id: 'cat',     emoji: '🐱' },
  { id: 'unicorn', emoji: '🦄' },
  { id: 'hamster', emoji: '🐹' },
  { id: 'fox',     emoji: '🦊' },
];

export const PetAvatar: React.FC = () => {
  const { petType, isSleeping, happy, energy, equippedItems, createdAt } = usePetStore();

  const getPetEmoji = () => {
    const pet = PETS.find(p => p.id === petType);
    return pet ? pet.emoji : '🐱';
  };

  const totalDaysPlayed = Math.floor((Date.now() - (createdAt || Date.now())) / 86400000);
  const { scale } = getPetStage(totalDaysPlayed);

  const getAnimation = () => {
    if (isSleeping) {
      return {
        y: [0, 5, 0],
        scale,
        transition: { y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 0.5 } }
      };
    }
    if (happy > 70 && energy > 50) {
      return {
        y: [0, -20, 0],
        scale,
        transition: { y: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 0.5 } }
      };
    }
    if (energy < 30) {
      return {
        x: [-2, 2, -2],
        scale,
        transition: { x: { duration: 2, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 0.5 } }
      };
    }
    return {
      y: [0, -5, 0],
      scale,
      transition: { y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 0.5 } }
    };
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'accessory': return 'absolute top-[-5px] left-[50%] -translate-x-1/2 text-[50px] z-20';
      case 'outfit': return 'absolute bottom-[10px] left-[50%] -translate-x-1/2 text-[60px] z-10';
      case 'toy': return 'absolute bottom-[20px] right-[-20px] text-[40px] z-20';
      case 'furniture': return 'absolute bottom-[-15px] left-[50%] -translate-x-1/2 text-[130px] z-0';
      default: return 'absolute text-[40px]';
    }
  };

  const equippedItemList = Object.values(equippedItems || {})
    .map(id => SHOP_ITEMS.find(item => item.id === id))
    .filter(Boolean) as typeof SHOP_ITEMS;

  return (
    <div className="relative flex justify-center items-center h-[220px] w-[220px]">
      <motion.div 
        animate={getAnimation() as any}
        className={`relative text-[120px] leading-none ${isSleeping ? 'opacity-70' : 'opacity-100'} filter drop-shadow-xl z-10 flex items-center justify-center`}
      >
        <span className="relative z-10">{getPetEmoji()}</span>
        
        {equippedItemList.map(item => (
          <span 
            key={item.id} 
            className={getCategoryStyle(item.category)}
            style={{ 
              zIndex: item.category === 'furniture' ? 0 : (item.category === 'accessory' || item.category === 'toy' ? 30 : 20) 
            }}
          >
            {item.emoji}
          </span>
        ))}

        {isSleeping && (
          <motion.div 
            animate={{ opacity: [0, 1, 0], y: [-10, -30] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            className="absolute top-0 right-0 text-3xl font-bold text-pal-secondary drop-shadow-md z-40"
          >
            Z
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
