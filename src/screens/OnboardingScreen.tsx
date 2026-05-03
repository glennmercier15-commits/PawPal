import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const SLIDES = [
  {
    emoji: '🐾',
    title: 'Welcome to PawPal',
    desc: 'Adopt your very own magical virtual pet and become best friends!'
  },
  {
    emoji: '🛁',
    title: 'Daily Care',
    desc: 'Feed, clean, and play games with your pet to keep them happy and healthy.'
  },
  {
    emoji: '🛍️',
    title: 'Dress Up',
    desc: 'Earn Paw Coins to buy fun outfits and decorate your space!'
  },
  {
    emoji: '📓',
    title: 'Secret Diary',
    desc: 'Draw pictures and write down your favorite memories together.'
  }
];

export const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      localStorage.setItem('pawpal_onboarded', 'true');
      navigate('/select');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('pawpal_onboarded', 'true');
    navigate('/select');
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-pal-primary overflow-hidden items-center text-center px-6 pb-safe relative">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            <div className="w-[200px] h-[200px] bg-white rounded-[40px] shadow-xl flex items-center justify-center mb-8 rotate-3">
              <span className="text-[100px]">{SLIDES[currentSlide].emoji}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-sm leading-tight">
              {SLIDES[currentSlide].title}
            </h2>
            <p className="text-[#FFE4F0] text-lg font-medium px-4 leading-relaxed">
              {SLIDES[currentSlide].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-6 mb-10 shrink-0">
        <div className="flex justify-center gap-3">
          {SLIDES.map((_, i) => (
            <div 
              key={i} 
              className={`h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/30'}`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleNext}
            className="w-full py-4 bg-white text-pal-primary rounded-full font-extrabold text-lg shadow-[0_8px_20px_rgba(0,0,0,0.1)] active:scale-95 transition-transform"
          >
            {currentSlide === SLIDES.length - 1 ? "Let's Play! 🚀" : "Next"}
          </button>
          <button 
            onClick={handleSkip}
            className={`w-full py-4 text-white/70 font-bold text-lg active:bg-white/10 rounded-full transition-opacity ${currentSlide === SLIDES.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};
