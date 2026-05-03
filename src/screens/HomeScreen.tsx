import React, { useEffect, useState } from 'react';
import { usePetStore } from '../store/usePetStore';
import { PetAvatar } from '../components/PetAvatar';
import NeumorphicStatCard from '../components/NeumorphicStatCard';
import { PetSpeechBubble } from '../components/PetSpeechBubble';
import { CoinCounter } from '../components/CoinCounter';
import { useStatDecay } from '../utils/statDecay';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import LevelBanner from '../components/LevelBanner';
import DailyLessonCard from '../components/DailyLessonCard';
import DailyGiftBox from '../components/DailyGiftBox';
import { MemoryCard } from '../components/MemoryCard';

import { usePetMood } from '../hooks/usePetMood';
import { getWeatherMood } from '../utils/weather';

const WEATHER_BG = {
  sunny:  { bg: '#FFF8E1', emoji: '☀️' },
  cloudy: { bg: '#F5F5F5', emoji: '⛅' },
  rainy:  { bg: '#E3F2FD', emoji: '🌧️' },
  snowy:  { bg: '#E8F5E9', emoji: '❄️' },
};

export const HomeScreen: React.FC = () => {
  useStatDecay(); // Activate background decay
  const { name, hunger, happy, energy, clean, isSleeping } = usePetStore();
  const petMood = usePetMood();
  const [weather, setWeather] = useState<keyof typeof WEATHER_BG>('sunny');
  const navigate = useNavigate();

  useEffect(() => {
    getWeatherMood().then(setWeather);
  }, []);

  const getMood = () => {
    if (isSleeping) return "Zzz... 💤";
    return petMood.message;
  };

  const weatherStyle = WEATHER_BG[weather];

  return (
    <div 
      className="min-h-[100dvh] w-full flex flex-col pt-12 px-6 pb-28 gap-6 overflow-y-auto safe-top transition-colors duration-1000"
      style={{ backgroundColor: weatherStyle.bg }}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <CoinCounter />
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/achievements')}
            className="text-2xl bg-white/50 w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm backdrop-blur-md active:scale-95 transition-transform"
          >
            🏆
          </button>
          <div className="text-3xl bg-white/50 w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm backdrop-blur-md">
            {weatherStyle.emoji}
          </div>
        </div>
      </div>

      <LevelBanner />
      <DailyGiftBox />
      <DailyLessonCard />

      <div className="flex flex-col items-center mt-2">
        <h1 className="text-3xl font-extrabold text-[var(--app-text)]">{name || 'Your Pet'} 🌟</h1>
      </div>

      {/* Pet Area Container */}
      <div className="relative w-full aspect-square bg-pal-card rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] pt-16 flex flex-col justify-end items-center border-[6px] border-pal-card ring-1 ring-pal-primary/10 overflow-hidden">
        <div onClick={() => navigate('/chat')} className="cursor-pointer active:scale-95 transition-transform z-10 hover:opacity-90">
          <PetSpeechBubble message={getMood()} />
        </div>
        
        {/* Background gradient behind pet */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-pal-background/50 to-transparent"></div>
        
        <PetAvatar />
        
        {/* The shadow floor for the pet */}
        <div className="w-[120px] h-4 bg-black/10 rounded-[100%] blur-sm mb-[40px]"></div>
      </div>

      <div className="flex justify-center mt-2 mb-4">
        <button 
          onClick={() => navigate('/chat')}
          className="bg-pal-primary text-white font-bold text-lg py-4 px-8 rounded-[24px] shadow-[0_6px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 w-full"
        >
          <span className="text-2xl">🎤</span> Chat with {name}
        </button>
      </div>

      {/* Stats Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col"
      >
        <NeumorphicStatCard statKey="hunger" value={hunger} />
        <NeumorphicStatCard statKey="happiness" value={happy} />
        <NeumorphicStatCard statKey="energy" value={energy} />
        <NeumorphicStatCard statKey="cleanliness" value={clean} />
      </motion.div>

      <MemoryCard />
    </div>
  );
};
