import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { usePetStore } from '../store/usePetStore';
import { STORY_THEMES, STORY_MORALS } from '../services/storyService';
import { triggerHaptic } from '../utils/haptics';

export const StorySetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { name } = usePetStore();
  const [theme, setTheme] = useState(STORY_THEMES[0]);
  const [moral, setMoral] = useState(STORY_MORALS[0]);

  const handleGenerate = () => {
    triggerHaptic('success');
    navigate('/story-reader', { 
      state: { 
        theme: theme.label, 
        moral: moral.label 
      } 
    });
  };

  const handleBack = () => {
    triggerHaptic('light');
    navigate(-1);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#0F0A1E] text-white flex flex-col p-6 safe-top overflow-y-auto">
      <button onClick={handleBack} className="absolute top-6 left-6 z-20 text-white opacity-70 hover:opacity-100 text-2xl font-bold">
        ✕
      </button>

      <div className="max-w-md mx-auto w-full pt-10 pb-20">
        <div className="text-center mb-10">
          <p className="text-2xl tracking-[0.3em] mb-2">✨ 🌙 ⭐ 💫</p>
          <h1 className="text-3xl font-bold text-[#E8D5FF]">Bedtime Story</h1>
          <p className="text-sm text-[#9E7BB5] mt-2">
            {name || 'Your pet'} will read you a magical story! 🐾
          </p>
        </div>

        <h2 className="text-lg font-bold text-[#E8D5FF] mb-4">🌍 Choose Your World</h2>
        <div className="flex overflow-x-auto pb-6 hide-scrollbar gap-3 snap-x">
          {STORY_THEMES.map(t => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic('light');
                setTheme(t);
              }}
              className={`min-w-[100px] snap-center rounded-[18px] p-3 flex flex-col justify-center gap-2 items-center border-[2px] transition-colors ${
                theme.id === t.id 
                  ? 'border-[#B388FF] bg-[#2D1A5E]' 
                  : 'border-transparent bg-[#1E1035] hover:bg-[#251545]'
              }`}
            >
              <div className="text-3xl">{t.emoji}</div>
              <div className="text-[11px] font-semibold text-[#CE93D8] text-center">{t.label.replace(/^(In|Under the|Magic|Fairy|Cloud) /, '')}</div>
            </motion.button>
          ))}
        </div>

        <h2 className="text-lg font-bold text-[#E8D5FF] mb-4 mt-2">💖 Story Lesson</h2>
        <div className="flex flex-wrap gap-2.5 mb-10">
          {STORY_MORALS.map(m => (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic('light');
                setMoral(m);
              }}
              className={`px-4 py-2.5 rounded-full border-[2px] transition-colors ${
                moral.id === m.id
                  ? 'border-[#FF9ECA] bg-[#3D1535]'
                  : 'border-transparent bg-[#1E1035] hover:bg-[#251545]'
              }`}
            >
              <span className="text-[#E8D5FF] font-semibold text-[13px]">{m.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          className="w-full bg-[#7B2FBE] rounded-full py-4 px-6 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(123,47,190,0.4)] border border-[#9E7BB5]/30"
        >
          <span className="text-white font-bold text-[17px]">🌙 Generate My Story</span>
        </motion.button>
        <p className="text-center text-[#9E7BB5] mt-4 text-[13px]">
          {name || 'Your pet'} is ready to tell a story... ✨
        </p>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
