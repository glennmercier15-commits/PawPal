import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2 } from 'lucide-react';

interface VoiceRecorderProps {
  onSave: (audioUrl: string) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSave, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Instead of object URL which revokes on reload, use FileReader to convert to Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioUrl(reader.result as string);
        };
        // Stop all tracks to release mic icon in browser
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioUrl(null);
    } catch (err) {
      console.error("Error accessing mic: ", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setIsPlaying(false);
  };

  const handleSave = () => {
    if (audioUrl) {
      onSave(audioUrl);
    }
  };

  const togglePlayback = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center p-6 bg-pal-card rounded-3xl border border-pal-primary/10 shadow-sm mt-4">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      <div className="text-center">
        <h3 className="font-extrabold text-pal-text mb-1 text-lg">Record a Memory</h3>
        <p className="text-xs font-medium text-pal-text/60">Tell a story about your pet today.</p>
      </div>

      {!audioUrl ? (
        <div className="flex justify-center my-6 relative">
          {isRecording && (
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-25 scale-150"></div>
          )}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white gap-2 shadow-lg transition-transform active:scale-95 z-10 ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-pal-primary hover:bg-pal-primary/90'
            }`}
          >
            {isRecording ? <Square size={36} fill="currentColor"/> : <Mic size={40} />}
            <span className="text-sm font-bold tracking-widest uppercase">
              {isRecording ? 'Stop' : 'Record'}
            </span>
          </button>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between bg-pal-background p-4 rounded-2xl gap-4">
          <button
            onClick={togglePlayback}
            className="w-12 h-12 bg-pal-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-sm"
          >
            {isPlaying ? <Square size={20} fill="currentColor"/> : <Play size={24} fill="currentColor" className="ml-1"/>}
          </button>
          
          <div className="flex-1">
            <div className="h-2 bg-black/5 rounded-full overflow-hidden w-full relative">
               <div className={`h-full bg-pal-primary transition-all duration-300 ${isPlaying ? 'w-full' : 'w-0'}`} />
            </div>
            <p className="text-xs font-bold text-pal-text/40 mt-2 uppercase tracking-wide">
              {isPlaying ? 'Playing...' : 'Audio Ready'}
            </p>
          </div>

          <button onClick={deleteRecording} className="text-pal-danger p-2 bg-pal-danger/10 rounded-xl">
            <Trash2 size={20} />
          </button>
        </div>
      )}

      <div className="flex gap-3 w-full mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-3 bg-pal-background text-pal-text/60 font-bold rounded-2xl active:bg-pal-text/10"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!audioUrl}
          className={`flex-1 py-3 rounded-2xl font-bold shadow-sm transition-all ${
            audioUrl ? 'bg-pal-primary text-white active:scale-95' : 'bg-pal-text/10 text-pal-text/30'
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};
