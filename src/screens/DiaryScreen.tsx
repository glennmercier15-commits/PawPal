import React, { useState, useEffect } from 'react';
import { FileText, Calendar, PenTool, Mic, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePetStore } from '../store/usePetStore';
import { useDiaryStore } from '../store/useDiaryStore';
import { DiaryEntryCard } from '../components/DiaryEntryCard';
import { DrawingCanvas } from '../components/DrawingCanvas';
import { VoiceRecorder } from '../components/VoiceRecorder';

type Tab = 'entries' | 'write' | 'draw' | 'voice';

export const DiaryScreen: React.FC = () => {
  const { name } = usePetStore();
  const { entries, loadEntries, isLoaded, addEntry, deleteEntry } = useDiaryStore();
  const [activeTab, setActiveTab] = useState<Tab>('entries');
  const [textEntry, setTextEntry] = useState('');

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSaveText = async () => {
    if (!textEntry.trim()) return;
    await addEntry({ type: 'text', content: textEntry.trim(), mood: '📝' });
    setTextEntry('');
    setActiveTab('entries');
  };

  const handleSaveDrawing = async (dataUrl: string) => {
    await addEntry({ type: 'drawing', content: dataUrl, mood: '🎨' });
    setActiveTab('entries');
  };

  const handleSaveVoice = async (audioUrl: string) => {
    await addEntry({ type: 'voice', content: audioUrl, mood: '🎤' });
    setActiveTab('entries');
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col pt-12 px-6 safe-top bg-pal-background overflow-y-auto pb-32">
      <div className="flex items-center gap-3 w-full mb-6">
        <div className="bg-pal-primary/20 p-3 rounded-2xl text-pal-primary">
          <FileText size={28} strokeWidth={2.5}/>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-pal-text">Diary</h1>
          <p className="text-pal-text/70 font-medium">{name || 'Your Pet'}'s Memory Book</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide shrink-0">
        {[
          { id: 'entries', label: 'Memories', icon: Calendar },
          { id: 'write', label: 'Write', icon: FileText },
          { id: 'draw', label: 'Draw', icon: PenTool },
          { id: 'voice', label: 'Voice', icon: Mic },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-4 py-2.5 rounded-full font-bold text-[13px] whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-pal-primary text-white shadow-[0_4px_12px_rgba(255,158,202,0.4)]'
                  : 'bg-pal-card text-pal-text/60 border border-pal-primary/10'
              }`}
            >
              <Icon size={16} strokeWidth={2.5} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'entries' && (
            <motion.div 
              key="entries"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-6 relative pb-10"
            >
               {entries.length > 0 && (
                 <div className="absolute left-[30px] top-4 bottom-0 w-1 bg-pal-primary/20 rounded-full z-0 h-full"></div>
               )}
               {isLoaded && entries.length === 0 ? (
                 <div className="text-center bg-pal-card p-8 rounded-3xl border border-pal-primary/10 mt-4">
                   <div className="text-4xl mb-4">📓</div>
                   <h3 className="font-bold text-lg text-pal-text mb-2">No Memories Yet</h3>
                   <p className="text-sm text-pal-text/60">Choose Write, Draw, or Voice to add a memory!</p>
                 </div>
               ) : (
                 entries.map((entry, i) => (
                   <DiaryEntryCard key={entry.id} entry={entry} onDelete={deleteEntry} index={i} />
                 ))
               )}
            </motion.div>
          )}

          {activeTab === 'write' && (
            <motion.div 
              key="write"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-pal-card p-5 rounded-[24px] shadow-sm border border-pal-primary/10 flex flex-col gap-4"
            >
              <h3 className="font-extrabold text-pal-text text-lg">New Entry</h3>
              <textarea
                value={textEntry}
                onChange={(e) => setTextEntry(e.target.value)}
                placeholder={`What did you and ${name} do today?`}
                className="w-full h-40 bg-pal-background rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-pal-primary/30 text-pal-text placeholder:text-pal-text/30"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('entries')}
                  className="flex-1 py-3 bg-pal-background text-pal-text/60 font-bold rounded-2xl active:bg-pal-text/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveText}
                  disabled={!textEntry.trim()}
                  className="flex-1 py-3 bg-pal-primary text-white font-bold rounded-2xl shadow-sm active:scale-95 transition-transform disabled:opacity-50"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'draw' && (
            <motion.div 
              key="draw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DrawingCanvas onSave={handleSaveDrawing} onCancel={() => setActiveTab('entries')} />
            </motion.div>
          )}

          {activeTab === 'voice' && (
            <motion.div 
              key="voice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <VoiceRecorder onSave={handleSaveVoice} onCancel={() => setActiveTab('entries')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
