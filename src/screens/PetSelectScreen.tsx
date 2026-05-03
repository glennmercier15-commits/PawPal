import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { usePetStore } from '../store/usePetStore';

const PETS = [
  { id: 'bunny',   name: 'Bunny',   emoji: '🐰', desc: 'Fluffy & gentle'   },
  { id: 'puppy',   name: 'Puppy',   emoji: '🐶', desc: 'Playful & loyal'   },
  { id: 'cat',     name: 'Kitty',   emoji: '🐱', desc: 'Curious & clever'  },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', desc: 'Magical & rare ✨'  },
  { id: 'hamster', name: 'Hamster', emoji: '🐹', desc: 'Tiny & adorable'   },
  { id: 'fox',     name: 'Fox',     emoji: '🦊', desc: 'Smart & spirited'  },
];

export const PetSelectScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setPetType, setName } = usePetStore();
  const [selected, setSelected] = useState<typeof PETS[0] | null>(null);
  const [petName, setPetName] = useState('');

  const handleConfirm = () => {
    if (!selected) return alert('Please pick a pet first! 🐾');
    if (!petName.trim()) return alert('Give your pet a name! 💖');
    setPetType(selected.id);
    setName(petName.trim());
    navigate('/home');
  };

  return (
    <div className="min-h-[100dvh] w-full bg-pal-background flex flex-col pt-12 px-6 pb-20 justify-center">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h1 className="text-[28px] font-bold text-pal-text text-center">Choose Your Pet! 🐾</h1>
        <p className="text-[14px] text-[#B39DDB] text-center mt-1 mb-5">Pick the one that speaks to your heart 💖</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {PETS.map((pet, index) => {
          const isSelected = selected?.id === pet.id;
          return (
            <motion.button
              key={pet.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(pet)}
              className={`flex flex-col items-center justify-center p-4 rounded-[20px] transition-all shadow-[0_3px_5px_rgba(0,0,0,0.05)] ${
                isSelected 
                  ? 'bg-[#FFD6EC] border-[2.5px] border-pal-primary' 
                  : 'bg-pal-card border-2 border-transparent'
              }`}
            >
              <div className="text-[50px] mb-2 leading-tight">{pet.emoji}</div>
              <span className="text-[17px] font-bold text-pal-text">{pet.name}</span>
              <span className="text-[12px] text-[#9E7BB5] mt-1 text-center">{pet.desc}</span>
              {isSelected && <span className="mt-2 text-[12px] text-pal-success font-bold">✅ Selected</span>}
            </motion.button>
          );
        })}
      </div>

      {selected && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-pal-card rounded-[20px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)]"
        >
          <label className="text-[15px] font-semibold text-pal-text mb-2.5 block">
            Name your {selected.emoji} {selected.name}:
          </label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="e.g. Sprinkles, Luna, Bubbles..."
            maxLength={16}
            className="w-full px-4 py-3 rounded-[14px] bg-white text-[16px] text-pal-text border-[1.5px] border-pal-primary focus:outline-none placeholder:text-[#C9A7D8]"
          />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className="mt-3 w-full bg-pal-primary text-white font-bold text-[17px] py-4 rounded-[20px] flex justify-center items-center gap-2 transition-all shadow-sm"
          >
            Let's Go! 🚀
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
