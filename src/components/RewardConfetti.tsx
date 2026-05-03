import React, { useImperativeHandle } from 'react';
import confetti from 'canvas-confetti';
import { colors } from '../theme';

interface RewardConfettiProps {
  trigger: React.Ref<any>;
}

export default function RewardConfetti({ trigger }: RewardConfettiProps) {
  useImperativeHandle(trigger, () => ({
    shoot: () => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.5, y: 0 }, 
        gravity: 0.8,
        scalar: 1.2,
        colors: [
          colors.primary, colors.secondary, colors.accent,
          colors.gold, '#FF6B6B', '#69F0AE',
        ],
        disableForReducedMotion: true,
      });
    },
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-50 border-none pointer-events-none"></div>
  );
}
