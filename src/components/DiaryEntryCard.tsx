import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Square, Trash2 } from 'lucide-react';
import { DiaryEntry } from '../store/useDiaryStore';

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onDelete: (id: string) => void;
  index: number;
}

export const DiaryEntryCard: React.FC<DiaryEntryCardProps> = ({ entry, onDelete, index }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formattedDate = new Date(entry.date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15 }}
      className="flex gap-4 relative z-10"
    >
      <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
        <div className="w-[60px] bg-pal-card border-2 border-pal-primary/20 rounded-full py-1 text-center font-bold text-[10px] uppercase tracking-wider text-pal-primary shadow-sm shrink-0">
          {formattedDate}
        </div>
        <div className="w-4 h-4 bg-pal-primary rounded-full border-[3px] border-pal-card shadow-sm my-1 shrink-0"></div>
      </div>
      
      <div className="bg-pal-card p-4 rounded-[20px] rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-pal-primary/10 flex-1 overflow-hidden relative">
        <button 
          onClick={() => {
            if(window.confirm('Delete this memory?')) {
              onDelete(entry.id);
            }
          }}
          className="absolute top-3 right-3 text-pal-text/20 hover:text-pal-danger transition-colors p-1"
        >
          <Trash2 size={16} />
        </button>

        {entry.type === 'text' && (
          <p className="text-pal-text/90 font-medium leading-relaxed text-sm pr-6 break-words">{entry.content}</p>
        )}

        {entry.type === 'story' && (() => {
          try {
            const storyData = JSON.parse(entry.content);
            return (
              <div className="bg-[#1A1035] rounded-[20px] p-4 mt-1 border border-[#2D1A5E] shadow-sm">
                <div className="flex items-center gap-3 mb-3 relative">
                  <div className="text-3xl">📖</div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-[#E8D5FF]">{storyData.title || 'Bedtime Story'}</h3>
                    <p className="text-[12px] text-[#9E7BB5] mt-0.5">{storyData.pages?.length || 0} pages</p>
                  </div>
                </div>
                <p className="text-[13px] text-[#B39DDB] leading-relaxed mb-4 line-clamp-2 italic">
                  "{storyData.pages?.[0]?.text || ''}"
                </p>
                <button
                  onClick={() => navigate('/story-reader', {
                    state: { 
                      story: storyData
                    }
                  })}
                  className="w-full bg-[#2D1A5E] text-[#CE93D8] hover:bg-[#3D257E] font-bold text-[14px] py-2.5 rounded-[14px] transition-colors"
                >
                  🌙 Read Again
                </button>
              </div>
            );
          } catch(e) {
            return <p className="text-pal-text/90 font-medium leading-relaxed text-sm pr-6 break-words">{entry.content}</p>;
          }
        })()}

        {entry.type === 'drawing' && (
          <div className="w-full bg-pal-background rounded-2xl overflow-hidden mt-2">
            <img src={entry.content} alt="Memory Drawing" className="w-full h-auto object-cover" />
          </div>
        )}

        {entry.type === 'voice' && (
          <div className="flex items-center gap-3 bg-pal-background p-3 rounded-2xl mt-2 w-full pr-8">
             <audio ref={audioRef} src={entry.content} onEnded={() => setIsPlaying(false)} className="hidden" />
             <button
              onClick={togglePlayback}
              className="w-10 h-10 bg-pal-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-sm"
            >
              {isPlaying ? <Square size={16} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-0.5"/>}
            </button>
            <div className="flex-1">
              <div className={`text-xs font-bold ${isPlaying ? 'text-pal-primary' : 'text-pal-text/50'}`}>
                {isPlaying ? 'Playing...' : 'Voice Note'}
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 flex justify-end">
          {entry.mood && <span className="text-2xl bg-pal-background px-2 rounded-xl">{entry.mood}</span>}
        </div>
      </div>
    </motion.div>
  );
};
