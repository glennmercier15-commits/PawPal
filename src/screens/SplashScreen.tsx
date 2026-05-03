import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { usePetStore } from '../store/usePetStore';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const petType = usePetStore(state => state.petType);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (petType) {
        navigate('/home');
      } else {
        const onboarded = localStorage.getItem('pawpal_onboarded');
        if (onboarded) {
          navigate('/select');
        } else {
          navigate('/onboarding');
        }
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate, petType]);

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-pal-primary relative gap-2">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          scale: { type: "spring", bounce: 0.6, duration: 1 },
          opacity: { duration: 0.6 }
        }}
        className="text-[90px] leading-none z-10 drop-shadow-lg"
      >
        🐾
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-[40px] font-bold text-white tracking-[2px] z-10 drop-shadow-md leading-tight mt-2"
      >
        PawPal
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-[16px] text-[#FFE4F0] font-medium z-10"
      >
        Your Magical Pet World ✨
      </motion.p>
    </div>
  );
};
