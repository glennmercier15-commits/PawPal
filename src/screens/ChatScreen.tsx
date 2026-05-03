import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import { getPetStage } from '../utils/petAge';
import { sendMessage } from '../services/chatService';
import { motion, AnimatePresence } from 'motion/react';
import { PetAvatar } from '../components/PetAvatar';
import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../utils/haptics';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const ChatScreen: React.FC = () => {
  const { name, createdAt, petType, addCoins } = usePetStore();
  const { theme, isDark } = useTheme();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compute stage for personality engine
  const totalDaysPlayed = Math.floor((Date.now() - (createdAt || Date.now())) / 86400000);
  const stage = getPetStage(totalDaysPlayed).stage;
  
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognitionRef = useRef<any>(null);

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    triggerHaptic('medium');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Format history for Gemini
    const history = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Reward for interaction
    addCoins(2);

    const replyText = await sendMessage(userMessage.text, history, name || 'Pet', petType || 'bunny');

    const modelMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: replyText
    };

    setMessages(prev => [...prev, modelMessage]);
    setIsTyping(false);
    triggerHaptic('success');
    speakText(replyText);
  };

  const handleSend = () => handleSendText(inputText);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let text = '';
        let isFinal = false;
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        
        setInputText(text);
        
        if (isFinal) {
          setIsListening(false);
          triggerHaptic('light');
          if (text.trim()) {
            handleSendText(text);
          }
        }
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        triggerHaptic('error');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [SpeechRecognition, addCoins, isTyping, messages, name, petType]);

  useEffect(() => {
    // Initial greeting based on memory and personality
    const initialGreeting = `Hi! I'm ${name}, your lovely pet! 🐾 What do you want to talk about?`;
    
    setMessages([
      { id: 'msg-0', role: 'model', text: initialGreeting }
    ]);
  }, [name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a cute voice
      const voices = window.speechSynthesis.getVoices();
      const cuteVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female'));
      if (cuteVoice) utterance.voice = cuteVoice;
      utterance.pitch = stage === 'baby' ? 1.6 : stage === 'child' ? 1.4 : 1.2; 
      utterance.rate = 1.1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListen = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      triggerHaptic('light');
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        triggerHaptic('success');
      } catch (err) {
        console.error(err);
      }
    }
  };


  return (
    <div className="min-h-[100dvh] w-full flex flex-col pb-28 safe-top transition-colors duration-1000" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <button 
          onClick={() => navigate('/home')}
          className="text-2xl bg-white/50 w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm backdrop-blur-md active:scale-95 transition-transform"
        >
          ‹
        </button>
        <h1 className="text-xl font-bold" style={{ color: theme.text }}>Chat with {name}</h1>
        <div className="w-12"></div>
      </div>

      {/* Pet Avatar Preview */}
      <div className="flex justify-center p-4">
        <div className="w-32 h-32 relative bg-pal-card rounded-full flex items-end justify-center shadow-md overflow-hidden ring-4 ring-pal-primary/20">
          <div className="transform scale-[0.6] origin-bottom mb-[-20px]">
            <PetAvatar />
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                style={{ 
                  backgroundColor: msg.role === 'user' ? '#A5BEF5' : theme.card,
                  color: msg.role === 'user' ? '#1E3A8A' : theme.text,
                }}
              >
                <p className="font-medium text-lg leading-snug">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm text-gray-500 font-bold">
                {name} is typing... 🐾
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 pb-6 pt-2 min-h-[80px]">
        {/* Helper Hint text above input box if listening */}
        {isListening && <p className="text-sm italic text-center mb-2 text-gray-500">Listening... tap to stop</p>}
        <div className="flex items-center gap-2">
          <motion.button 
            animate={isListening ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={isListening ? { repeat: Infinity, duration: 1.2 } : {}}
            onClick={toggleListen}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-pal-primary active:scale-95 transition-colors ${
              isListening 
                ? 'bg-pal-primary text-white shadow-[0_0_15px_rgba(255,107,107,0.5)]' 
                : 'bg-white text-gray-600'
            }`}
          >
            {isListening ? '⏹️' : '🎤'}
          </motion.button>
          
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? 'Listening...' : `Say hi to ${name}...`}
            className="flex-1 h-14 rounded-2xl px-4 outline-none font-medium shadow-sm border-2 border-transparent focus:border-pal-primary/30"
            style={{ backgroundColor: theme.card, color: theme.text }}
          />
          
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="w-14 h-14 bg-[#4CAF50] text-white rounded-2xl flex items-center justify-center text-2xl shadow-sm disabled:opacity-50 active:scale-95 transition-all"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};
