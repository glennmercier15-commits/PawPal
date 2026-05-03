import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FetchGame } from '../components/games/FetchGame';
import { ObstacleGame } from '../components/games/ObstacleGame';
import { ChevronLeft } from 'lucide-react';

const GAMES = [
  { id: 'fetch',    label: '🎾 Fetch',          desc: 'Tap the ball before it vanishes!'   },
  { id: 'obstacle', label: '🏃 Obstacle Course', desc: 'Dodge the blocks to keep running!' },
];

export const MiniGameScreen: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const navigate = useNavigate();

  if (activeGame === 'fetch')    return <FetchGame    onExit={() => setActiveGame(null)} />;
  if (activeGame === 'obstacle') return <ObstacleGame onExit={() => setActiveGame(null)} />;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col pt-12 px-6 safe-top bg-pal-background overflow-y-auto pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-pal-card rounded-full flex items-center justify-center text-pal-text/60 shadow-sm border border-pal-primary/10 active:bg-pal-text/5"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-pal-text">🎮 Mini Games</h1>
          <p className="text-pal-text/70 font-medium">Play to earn Paw Coins! 🪙</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {GAMES.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveGame(game.id)}
            className="w-full bg-pal-card p-5 rounded-[24px] shadow-sm border border-pal-primary/10 flex flex-col items-center active:scale-95 transition-transform"
          >
            <span className="text-2xl font-bold text-pal-text">{game.label}</span>
            <span className="text-sm text-[#9E7BB5] mt-1.5 text-center">{game.desc}</span>
            <div className="mt-3 bg-pal-gold/20 px-4 py-1.5 rounded-full">
              <span className="font-bold text-pal-gold text-xs">Up to 🪙 20 coins</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
