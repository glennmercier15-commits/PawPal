import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { usePetStore } from '../store/usePetStore';
import { loadMemory } from '../utils/memory';
import { generatePersonalizedStory, GeneratedStory } from '../services/storyService';
import { useDiaryStore } from '../store/useDiaryStore';
import { triggerHaptic } from '../utils/haptics';

function useTypewriter(text: string, speed: number = 28) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

export const StoryReaderScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, petType } = usePetStore();
  const addEntry = useDiaryStore(state => state.addEntry);
  
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const theme = location.state?.theme;
  const moral = location.state?.moral;
  const existingStory = location.state?.story;

  useEffect(() => {
    async function fetchStory() {
      if (existingStory) {
        setStory(existingStory);
        setLoading(false);
        return;
      }
      try {
        const memory = loadMemory();
        const generated = await generatePersonalizedStory(memory, name || 'Pet', petType || 'bunny', theme, moral);
        setStory(generated);
      } catch (err) {
        console.error("Error fetching story", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStory();
  }, [name, petType, theme, moral, existingStory]);

  // Read page aloud when it changes
  useEffect(() => {
    if (isSpeaking && story && story.pages[page]) {
      speakPage(story.pages[page].text);
    }
  }, [page, story, isSpeaking]);

  const speakPage = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.3;
      utterance.onend = () => {
        // Optional: Do something when done
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
    }
  };

  const handleNext = () => {
    if (!story) return;
    if (page < story.pages.length - 1) {
      triggerHaptic('light');
      setDirection(1);
      setPage(p => p + 1);
    } else {
      // End of story: save to diary
      triggerHaptic('success');
      if (!existingStory) {
        const contentStr = JSON.stringify({ title: story.title, pages: story.pages, theme, moral });
        addEntry({ type: 'story', content: contentStr });
        navigate('/diary');
      } else {
        navigate(-1);
      }
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      triggerHaptic('light');
      setDirection(-1);
      setPage(p => p - 1);
    }
  };

  const handleBack = () => {
    window.speechSynthesis?.cancel();
    navigate(-1);
  };

  const currentPage = story?.pages[page];
  const { displayed, done } = useTypewriter(currentPage?.text || '', 22);

  if (loading) {
    return (
      <div className="h-[100dvh] w-full bg-[#0F0A1E] text-white flex flex-col justify-center items-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="text-6xl mb-4">
          ✨
        </motion.div>
        <p className="text-xl font-bold italic text-[#9E7BB5] animate-pulse">Writing a magical story...</p>
      </div>
    );
  }

  if (!story || !story.pages || story.pages.length === 0) {
    return (
      <div className="h-[100dvh] w-full bg-[#0F0A1E] text-white flex flex-col justify-center items-center p-6">
        <p className="text-xl mb-6 text-center text-[#E8D5FF]">Oops, the magic dust blew away! Couldn't write the story right now.</p>
        <button onClick={handleBack} className="bg-[#7B2FBE] text-white px-6 py-3 rounded-full font-bold">Go Back</button>
      </div>
    );
  }

  const progress = ((page + 1) / story.pages.length) * 100;
  const isLast = page === story.pages.length - 1;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="h-[100dvh] w-full bg-[#0F0A1E] text-[#E8D5FF] flex flex-col relative overflow-hidden font-sans safe-top">
      {/* Stars backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
          />
        ))}
      </div>
      
      {/* Progress Track */}
      <div className="w-full h-1 bg-[#1E1035] relative z-20">
        <motion.div 
          className="h-full bg-[#B388FF] rounded-none shadow-[0_0_8px_#B388FF]" 
          animate={{ width: `${progress}%` }} 
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 z-20 relative">
        <button onClick={handleBack} className="text-[#9E7BB5] hover:text-[#E8D5FF] text-xl font-bold w-10 h-10 flex items-center justify-center">
          ✕
        </button>
        <div className="font-bold text-[14px]">
          {page + 1} / {story.pages.length}
        </div>
        <button onClick={toggleSpeech} className="text-2xl w-10 h-10 flex items-center justify-center filter drop-shadow-md">
          {isSpeaking ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center pt-8 px-6 z-10 w-full max-w-sm mx-auto overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col items-center w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -50) {
                handleNext();
              } else if (swipe > 50) {
                handlePrev();
              }
            }}
          >
            <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              {currentPage?.emoji}
            </div>
            
            <p className="text-[14px] text-[#9E7BB5] mb-6 tracking-wide text-center">
              📖 {name || 'Pet'} is reading...
            </p>
            
            <div className="bg-[#1A1035] border border-[#2D1A5E] rounded-[24px] p-6 w-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-h-[160px] relative">
              <h2 className="text-[17px] text-[#B388FF] font-bold mb-3 text-center">
                {currentPage?.title || story.title}
              </h2>
              
              <p className="text-[17px] font-medium leading-relaxed text-[#E8D5FF]">
                {displayed}
                {!done && <span className="text-[#B388FF] font-bold animate-pulse inline-block ml-1">▌</span>}
              </p>
              
              <div className="text-3xl mt-6 opacity-60 text-center">🌙</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons Row */}
      <div className="pb-10 pt-4 z-20 w-full max-w-sm mx-auto flex justify-between items-center px-4 relative">
        <button 
          onClick={handlePrev} 
          disabled={page === 0}
          className={`bg-[#2D1A5E] text-[#E8D5FF] px-5 py-3 rounded-[20px] font-bold text-[15px] transition-all ${page === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#3D257E] active:scale-95'}`}
        >
          ‹ Back
        </button>

        {/* Dots */}
        <div className="flex gap-2.5 items-center">
          {story.pages.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === page 
                  ? 'w-5 bg-[#B388FF] shadow-[0_0_8px_#B388FF]' 
                  : i < page 
                    ? 'w-2 bg-[#7B2FBE]' 
                    : 'w-2 bg-[#2D1A5E]'
              }`} 
            />
          ))}
        </div>
        
        <button
          onClick={handleNext}
          className={`bg-[#2D1A5E] text-[#E8D5FF] px-5 py-3 rounded-[20px] font-bold text-[15px] transition-all hover:bg-[#3D257E] active:scale-95 ${isLast && 'bg-[#7B2FBE] border border-[#B388FF] hover:bg-[#8A3BCE]'}`}
        >
          {isLast ? 'Finish 🌙' : 'Next ›'}
        </button>
      </div>
    </div>
  );
};
