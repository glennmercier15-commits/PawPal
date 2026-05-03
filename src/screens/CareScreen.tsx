import React, { useRef } from 'react';
import { usePetStore } from '../store/usePetStore';
import { CareButton } from '../components/CareButton';
import { CoinCounter } from '../components/CoinCounter';
import { Utensils, HeartPulse, Moon, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import RewardConfetti from '../components/RewardConfetti';

export const CareScreen: React.FC = () => {
  const { name, isSleeping, feed, sleep, cleanPet } = usePetStore();
  const navigate = useNavigate();
  const confettiTrigger = useRef<{ shoot: () => void }>(null);

  const handleFeed = () => {
    feed();
    confettiTrigger.current?.shoot();
  };

  const handleClean = () => {
    cleanPet();
    confettiTrigger.current?.shoot();
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col pt-12 px-6 safe-top bg-pal-background overflow-y-auto pb-32">
      <div className="flex justify-between items-center w-full mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-pal-text">Care</h1>
          <p className="text-pal-text/70 font-medium">Take care of {name}</p>
        </div>
        <CoinCounter />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-pal-card p-6 rounded-[32px] shadow-sm border border-pal-primary/20 mb-6 relative overflow-hidden"
      >
        <RewardConfetti trigger={confettiTrigger} />
        <div className="text-center mb-6">
          <p className="text-lg font-bold text-pal-text/90">What does {name} need?</p>
        </div>

        <div className="grid grid-cols-2 gap-6 place-items-center relative z-10">
          <CareButton 
            label="Feed" 
            icon={<Utensils className="text-emerald-600" size={24} />} 
            onClick={handleFeed} 
            colorClass="bg-emerald-100 text-emerald-700 border-emerald-200"
            disabled={isSleeping}
          />
          <CareButton 
            label="Games" 
            icon={<HeartPulse className="text-rose-600" size={24} />} 
            onClick={() => navigate('/games')} 
            colorClass="bg-rose-100 text-rose-700 border-rose-200"
            disabled={isSleeping}
          />
          <CareButton 
            label="Clean" 
            icon={<Droplets className="text-blue-600" size={24} />} 
            onClick={handleClean} 
            colorClass="bg-blue-100 text-blue-700 border-blue-200"
            disabled={isSleeping}
          />
          <CareButton 
            label={isSleeping ? "Wake Up" : "Sleep"} 
            icon={<Moon className="text-indigo-600" size={24} />} 
            onClick={sleep} 
            colorClass="bg-indigo-100 text-indigo-700 border-indigo-200"
          />
        </div>
      </motion.div>
      
      {isSleeping && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pal-secondary/20 border border-pal-secondary/40 p-4 rounded-2xl text-center shadow-sm flex flex-col items-center gap-3"
        >
          <div>
            <p className="text-pal-text font-bold">💤 Shhh... {name} is sleeping.</p>
            <p className="text-pal-text/70 text-sm mt-1">Energy is recovering!</p>
          </div>
          <button 
            onClick={() => navigate('/story')}
            className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-xl shadow-[0_4px_0_theme(colors.indigo.700)] active:shadow-[0_0px_0_theme(colors.indigo.700)] active:translate-y-1 transition-all"
          >
            📖 Read Bedtime Story
          </button>
        </motion.div>
      )}
    </div>
  );
};
