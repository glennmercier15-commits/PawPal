import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePetStore } from '../../store/usePetStore';
import { X } from 'lucide-react';

interface FetchGameProps {
  onExit: () => void;
}

const GAME_SECONDS = 30;

export const FetchGame: React.FC<FetchGameProps> = ({ onExit }) => {
  const { addCoins, play: playWithPet } = usePetStore();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const ballTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const moveBall = useCallback(() => {
    setBallPos({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80
    });
    
    if (ballTimer.current) clearTimeout(ballTimer.current);
    ballTimer.current = setTimeout(moveBall, 1500);
  }, []);

  const startGame = () => {
    setStarted(true);
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setGameOver(false);
    moveBall();
  };

  useEffect(() => {
    if (started && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (started && timeLeft === 0 && !gameOver) {
      setGameOver(true);
      if (ballTimer.current) clearTimeout(ballTimer.current);
    }
  }, [started, timeLeft, gameOver]);

  useEffect(() => {
    return () => {
      if (ballTimer.current) clearTimeout(ballTimer.current);
    };
  }, []);

  const handleBallClick = () => {
    if (gameOver || !started) return;
    setScore(s => s + 1);
    moveBall();
  };

  const handleFinish = () => {
    const coinsEarned = Math.min(20, Math.floor(score / 2));
    if (coinsEarned > 0) {
      addCoins(coinsEarned);
    }
    playWithPet();
    onExit();
  };

  if (!started) {
    return (
      <div className="fixed inset-0 z-[100] bg-pal-background flex flex-col items-center justify-center p-8 text-center pt-safe pb-safe">
        <h2 className="text-4xl font-extrabold text-pal-text mb-4">🎾 Fetch!</h2>
        <p className="text-lg text-pal-text/70 mb-8 max-w-[250px] leading-relaxed">
          Tap the ball as fast as you can!<br/>You have {GAME_SECONDS} seconds ⏱️
        </p>
        <button 
          onClick={startGame}
          className="px-8 py-4 bg-pal-primary text-white font-extrabold rounded-full shadow-[0_8px_20px_rgba(255,158,202,0.4)] active:scale-95 transition-transform mb-4"
        >
          ▶️ Start Game
        </button>
        <button 
          onClick={onExit}
          className="text-pal-text/50 font-bold px-6 py-2 active:bg-pal-text/5 rounded-full"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-pal-background flex flex-col pt-safe pb-safe">
      <div className="p-6 flex justify-between items-center relative z-10 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-pal-text/60 font-bold text-sm">Time: <span className="text-pal-primary">{timeLeft}s</span></span>
          <span className="text-pal-text/60 font-bold text-sm">Score: <span className="text-pal-primary">{score}</span></span>
        </div>
        <button 
          onClick={onExit}
          className="w-10 h-10 bg-pal-card rounded-full flex items-center justify-center text-pal-text/40 shadow-sm"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden mx-6 mb-6 bg-[#FFF0F8] rounded-3xl border-4 border-pal-primary/10 shadow-inner">
        {!gameOver ? (
          <motion.div
            animate={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute w-16 h-16 w-[64px] h-[64px] -ml-[32px] -mt-[32px] rounded-full bg-[#FFD54F] shadow-sm flex items-center justify-center cursor-pointer active:scale-75"
            onClick={handleBallClick}
          >
            <span className="text-4xl drop-shadow-md select-none touch-none">🎾</span>
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
            <h2 className="text-4xl font-black text-pal-text mb-2">⏱️ Time's Up!</h2>
            <p className="text-lg text-pal-text/70 font-medium mb-6">Your score: {score} 🎾</p>
            
            <div className="bg-pal-gold/20 p-4 rounded-2xl mb-8 border border-pal-gold/30">
              <span className="text-pal-gold font-bold text-lg">Coins earned: 🪙 {Math.min(20, Math.floor(score / 2))}</span>
            </div>

            <button 
              onClick={handleFinish}
              className="px-8 py-4 bg-pal-primary text-white font-extrabold rounded-full shadow-[0_8px_20px_rgba(255,158,202,0.4)] active:scale-95 transition-transform mb-3"
            >
              🪙 Collect Coins
            </button>
            <button 
              onClick={startGame}
              className="text-pal-text/50 font-bold px-6 py-2 active:bg-pal-text/5 rounded-full"
            >
              🔁 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
