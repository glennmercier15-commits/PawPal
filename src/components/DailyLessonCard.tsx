import React, { useState, useEffect } from 'react';
import { DAILY_LESSONS } from '../constants/lessons';
import { usePetStore } from '../store/usePetStore';
import { useTheme } from '../theme/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export default function DailyLessonCard() {
  const { theme, isDark } = useTheme();
  const { addCoins } = usePetStore();

  const [lessonIndex, setLessonIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    // Pick lesson based on the day
    const day = new Date().getDay();
    setLessonIndex(day % DAILY_LESSONS.length);
  }, []);

  const lesson = DAILY_LESSONS[lessonIndex];

  const handleAnswer = (opt: string) => {
    if (answered) return;
    setPicked(opt);
    setAnswered(true);
    if (opt === lesson.answer) {
      addCoins(lesson.reward);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-3xl mt-2 overflow-hidden relative"
      style={{ 
        backgroundColor: theme.card,
        boxShadow: isDark ? '0px 4px 12px rgba(0,0,0,0.3)' : '0px 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <h3 className="font-bold text-sm tracking-wide opacity-60 mb-1 uppercase" style={{ color: theme.text }}>
        {lesson.subject} · Daily Question
      </h3>
      <h2 className="text-xl font-black mb-4" style={{ color: theme.text }}>
        {lesson.question}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {lesson.options.map(opt => {
          const isCorrectAnswer = opt === lesson.answer;
          const isSelected = opt === picked;
          let bgColor = theme.background;
          let borderColor = 'transparent';
          let textColor = theme.text;
          
          if (answered) {
            if (isCorrectAnswer) {
              bgColor = '#A5D6A7'; // Green
              borderColor = '#81C784';
              textColor = '#1B5E20';
            } else if (isSelected && !isCorrectAnswer) {
              bgColor = '#EF9A9A'; // Red
              borderColor = '#E57373';
              textColor = '#B71C1C';
            } else {
              bgColor = theme.background;
              textColor = theme.textLight;
            }
          } else {
            borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
          }

          return (
            <button
              key={opt}
              disabled={answered}
              onClick={() => handleAnswer(opt)}
              className="py-3 px-4 rounded-2xl font-bold flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`,
                color: textColor,
                ...(!answered && { 
                  boxShadow: isDark ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.02)' 
                })
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            className="text-center font-bold"
            style={{ color: picked === lesson.answer ? '#4CAF50' : '#F44336' }}
          >
            {picked === lesson.answer 
              ? `✅ Correct! +${lesson.reward} 🪙` 
              : `❌ The answer was ${lesson.answer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
