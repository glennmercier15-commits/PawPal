import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const SPARKLES = ['✨','🌸','⭐','💫','🌟','🎀','💖'];

interface SparkleData {
  id: number;
  x: number;
  delay: number;
  duration: number;
  emoji: string;
  size: number;
}

export default function SparkleBackground({ count = 10 }: { count?: number }) {
  const [sparkles, setSparkles] = useState<SparkleData[]>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: i * (5000 / count) / 1000,
      duration: (3000 + Math.random() * 3000) / 1000,
      emoji: SPARKLES[Math.floor(Math.random() * SPARKLES.length)],
      size: 12 + Math.random() * 14,
    }));
    setSparkles(newSparkles);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[45]">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            fontSize: sparkle.size,
          }}
          initial={{ top: '110%', opacity: 0 }}
          animate={{
            top: '-10%',
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: "linear",
            times: [0, 0.1, 0.9, 1]
          }}
        >
          {sparkle.emoji}
        </motion.div>
      ))}
    </div>
  );
}
