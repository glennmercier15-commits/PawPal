import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { usePetStore } from '../../store/usePetStore';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

interface ObstacleGameProps {
  onExit: () => void;
}

const LANES = [20, 50, 80]; // percentage X positions

export const ObstacleGame: React.FC<ObstacleGameProps> = ({ onExit }) => {
  const { addCoins, play: playWithPet } = usePetStore();
  
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [lane, setLane] = useState(1);
  const [obstacles, setObstacles] = useState<{ id: number, lane: number, y: number }[]>([]);
  
  const laneRef = useRef(1);
  const gameOverRef = useRef(false);
  const startedRef = useRef(false);
  
  const frameRef = useRef(0);
  const reqRef = useRef<number>(0);

  const switchLane = (dir: number) => {
    if (gameOverRef.current || !startedRef.current) return;
    const next = Math.max(0, Math.min(2, laneRef.current + dir));
    setLane(next);
    laneRef.current = next;
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') switchLane(-1);
    if (e.key === 'ArrowRight') switchLane(1);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const startGame = () => {
    setStarted(true);
    startedRef.current = true;
    setGameOver(false);
    gameOverRef.current = false;
    setScore(0);
    setObstacles([]);
    setLane(1);
    laneRef.current = 1;
    frameRef.current = 0;
  };

  useEffect(() => {
    if (!started || gameOver) return;
    
    let obstacleIdSeq = 0;
    // ensure no overlapping obstacles spawn too closely
    let lastSpawnFrame = 0; 
    
    const tick = () => {
      if (gameOverRef.current) return;

      setObstacles(prev => {
        // Speed up slightly over time
        const speed = 1.5 + (frameRef.current / 2000);
        let newOb = prev.map(o => ({ ...o, y: o.y + speed }));
        
        // Check collision (player sits horizontally centered around y=85)
        const currentLane = laneRef.current;
        for (const o of newOb) {
          if (o.y > 75 && o.y < 92 && o.lane === currentLane) {
             setGameOver(true);
             gameOverRef.current = true;
             return prev; 
          }
        }
        
        // Cleanup old obstacles
        newOb = newOb.filter(o => o.y < 120);
        
        // Spawn obstacles
        // Limit spawn rate so it doesn't get impossible immediately
        const framesSinceLastSpawn = frameRef.current - lastSpawnFrame;
        const minimumFramesBetweenSpawn = Math.max(30, 80 - (frameRef.current / 100));
        const spawnChance = Math.min(0.05, 0.01 + (frameRef.current / 5000));
        
        if (framesSinceLastSpawn > minimumFramesBetweenSpawn && Math.random() < spawnChance) {
           newOb.push({ id: ++obstacleIdSeq, lane: Math.floor(Math.random() * 3), y: -10 });
           lastSpawnFrame = frameRef.current;
        }
        
        return newOb;
      });

      frameRef.current++;
      if (frameRef.current % 30 === 0) {
        setScore(s => s + 1);
      }

      if (!gameOverRef.current) {
        reqRef.current = requestAnimationFrame(tick);
      }
    };
    
    reqRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(reqRef.current);
  }, [started, gameOver]);

  const handleFinish = () => {
    const coinsEarned = Math.min(20, Math.floor(score / 5));
    if (coinsEarned > 0) {
      addCoins(coinsEarned);
    }
    playWithPet();
    onExit();
  };

  if (!started) {
    return (
      <div className="fixed inset-0 z-[100] bg-pal-background flex flex-col items-center justify-center p-8 text-center pt-safe pb-safe">
        <h2 className="text-4xl font-extrabold text-pal-text mb-4">🏃 Obstacle Course</h2>
        <p className="text-lg text-pal-text/70 mb-8 max-w-[280px] leading-relaxed">
          Tap ← → to switch lanes!<br/>Dodge the blocks as long as you can 🐾
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
    <div className="fixed inset-0 z-[100] bg-pal-background flex flex-col pt-safe pb-safe select-none overflow-hidden">
      <div className="p-6 flex justify-between items-center relative z-10 shrink-0 pointer-events-none">
        <div className="flex flex-col gap-1">
          <span className="text-pal-text/60 font-bold text-sm">Score: <span className="text-pal-primary">{score}</span></span>
        </div>
        {!gameOver && (
          <button 
            onClick={(e) => { e.stopPropagation(); onExit(); }}
            className="w-10 h-10 bg-pal-card rounded-full flex items-center justify-center text-pal-text/40 shadow-sm pointer-events-auto"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden mx-6 mb-6 bg-[#FFF0F8] rounded-3xl border-4 border-pal-primary/10 shadow-inner">
        
        {/* Lane Background Lines */}
        {LANES.map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-pal-primary/10 opacity-50" style={{ left: `${LANES[i]}%` }} />
        ))}

        {!gameOver ? (
          <>
            {/* Player */}
            <motion.div
              animate={{ left: `${LANES[lane]}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute bottom-[10%] w-12 h-12 -ml-6 flex justify-center items-center text-4xl drop-shadow-md z-20"
            >
              🏃‍♂️
            </motion.div>

            {/* Obstacles */}
            {obstacles.map(o => (
              <div 
                key={o.id}
                className="absolute w-12 h-12 -ml-6 bg-red-400 rounded-lg flex items-center justify-center shadow-sm text-2xl z-10"
                style={{ left: `${LANES[o.lane]}%`, top: `${o.y}%` }}
              >
                🧱
              </div>
            ))}
            
            {/* Controls */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-around px-8 z-30 pointer-events-none">
               <button 
                  onPointerDown={(e) => { e.stopPropagation(); switchLane(-1); }}
                  className="w-[70px] h-[70px] bg-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform text-2xl border border-black/5 pointer-events-auto"
               >
                 <ArrowLeft size={32} className="text-pal-text" />
               </button>
               <button 
                  onPointerDown={(e) => { e.stopPropagation(); switchLane(1); }}
                  className="w-[70px] h-[70px] bg-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform text-2xl border border-black/5 pointer-events-auto"
               >
                 <ArrowRight size={32} className="text-pal-text" />
               </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-30 bg-pal-card/90 backdrop-blur-sm pointer-events-auto">
            <h2 className="text-4xl font-black text-pal-text mb-2">💥 Oops!</h2>
            <p className="text-lg text-pal-text/70 font-medium mb-6">Score: {score}</p>
            
            <div className="bg-pal-gold/20 p-4 rounded-2xl mb-8 border border-pal-gold/30">
              <span className="text-pal-gold font-bold text-lg">Earned: 🪙 {Math.min(20, Math.floor(score / 5))} Paw Coins</span>
            </div>

            <button 
              onClick={handleFinish}
              className="px-8 py-4 bg-pal-accent text-white font-extrabold rounded-full shadow-sm active:scale-95 transition-transform mb-3"
            >
              🪙 Collect & Exit
            </button>
            <button 
              onClick={startGame}
              className="text-pal-text/50 font-bold px-6 py-2 active:bg-pal-text/5 rounded-full"
            >
              🔁 Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
