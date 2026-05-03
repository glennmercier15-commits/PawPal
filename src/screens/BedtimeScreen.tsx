import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const STORIES = [
  { 
    title: 'The Star That Fell',
    pages: ['Once upon a time...', '...a tiny star fell from the sky 🌟', '...and landed in PawPal land! 🐾'] 
  },
  { 
    title: 'The Magic Garden',
    pages: ['There was a garden 🌸', '...full of magical flowers...', '...where pets played all day! ☀️'] 
  },
];

export const BedtimeScreen: React.FC = () => {
  const navigate = useNavigate();
  const story = STORIES[new Date().getDate() % STORIES.length];
  const [page, setPage] = useState(0);

  return (
    <div className="h-screen w-full bg-[#1A1A2E] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Stars backdrop */}
      <div className="absolute top-10 left-0 w-full text-center text-3xl opacity-60 tracking-widest pointer-events-none">
        ✨ 🌙 ⭐ 💫 🌟
      </div>
      
      <motion.div
        key={`page-${page}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm flex flex-col items-center flex-grow justify-center pb-20 z-10"
      >
        <h1 className="text-[#FFD700] text-3xl font-extrabold mb-8 text-center drop-shadow-lg">
          {story.title}
        </h1>
        
        <p className="text-2xl font-medium text-center leading-relaxed text-[#EAEAEA] drop-shadow-md">
          {story.pages[page]}
        </p>

        <div className="mt-16 w-full flex justify-center">
          {page < story.pages.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => p + 1)}
              className="bg-[#2E1A47] border-2 border-[#6A3D9A] text-white px-8 py-4 rounded-3xl font-bold text-xl shadow-[0_0_15px_rgba(106,61,154,0.6)]"
            >
              Next ›
            </motion.button>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <span className="text-xl font-bold text-[#FFD700] drop-shadow-md">
                The End 🌙 Goodnight!
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
                className="bg-[#FFD700] text-[#1A1A2E] px-8 py-3 rounded-2xl font-bold text-lg shadow-lg"
              >
                Back to Home
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
