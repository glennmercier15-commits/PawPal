import React, { useState, useEffect } from 'react';
import { usePetStore } from '../store/usePetStore';
import { Settings, LogOut, Bell, Shield, Info, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const PIN_KEY = 'pawpal_parent_pin';
const DEFAULT_PIN = '1234';

const PinPad: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [input, setInput] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [tempPin, setTempPin] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(PIN_KEY);
    if (!stored) setIsSetup(true);
  }, []);

  const handlePress = (digit: string) => {
    const next = input + digit;
    setInput(next);

    if (next.length < 4) return;

    if (isSetup) {
      if (!tempPin) {
        setTempPin(next);
        setInput('');
        alert('Please enter your PIN again to confirm.');
      } else if (next === tempPin) {
        localStorage.setItem(PIN_KEY, next);
        alert('Your parent PIN has been saved.');
        setIsSetup(false);
        onSuccess();
      } else {
        alert('PINs did not match. Try again.');
        setTempPin('');
        setInput('');
      }
    } else {
      const stored = localStorage.getItem(PIN_KEY);
      if (next === (stored || DEFAULT_PIN)) {
        setInput('');
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setInput('');
        if (newAttempts >= 3) {
          alert('Too many wrong attempts. Ask a grown-up for help.');
        } else {
          alert(`Wrong PIN. ${3 - newAttempts} attempts remaining.`);
        }
      }
    }
  };

  const handleDelete = () => setInput((prev) => prev.slice(0, -1));

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-20 px-6">
      <div className="bg-pal-primary/10 p-4 rounded-full text-pal-primary mb-4">
        <Lock size={32} />
      </div>
      <h2 className="text-2xl font-bold text-pal-text mb-2 text-center">
        {isSetup ? (tempPin ? 'Confirm your PIN' : 'Create a Parent PIN') : 'Parent Area'}
      </h2>
      <p className="text-pal-text/60 text-sm mb-8 text-center max-w-[240px]">
        {isSetup ? 'Set a 4-digit PIN to protect parent settings' : 'Enter your 4-digit PIN'}
      </p>

      <div className="flex gap-4 mb-10">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 border-pal-primary ${
              i < input.length ? 'bg-pal-primary' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 w-[240px] mx-auto">
        {keys.map((key, i) =>
          key === '' ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              onClick={() => (key === '⌫' ? handleDelete() : handlePress(key))}
              className="w-16 h-16 rounded-full bg-pal-card flex items-center justify-center text-2xl font-bold text-pal-text shadow-sm active:scale-95 transition-all"
            >
              {key}
            </button>
          )
        )}
      </div>
    </div>
  );
};

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const { name, petType, setPetType, setName, hunger, happy, energy, clean, coins } = usePetStore();
  const [dailyLimit, setDailyLimit] = useState(30);
  const [notifications, setNotifications] = useState(true);
  const [adsEnabled, setAdsEnabled] = useState(true);

  const avgHealth = Math.round((hunger + happy + energy + clean) / 4);

  const handleResetApp = () => {
    if (window.confirm("Are you sure you want to reset the app? This deletes the current pet.")) {
      setPetType('');
      setName('');
      navigate('/select');
    }
  };

  const resetPin = () => {
    if (window.confirm('This will delete your current PIN and ask you to set a new one.')) {
      localStorage.removeItem(PIN_KEY);
      alert('PIN reset. Restart the parent section to set a new one.');
      // Reload or log out of parent view could happen here, keeping it simple
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 w-full mb-8">
        <div className="bg-pal-secondary/20 p-3 rounded-2xl text-pal-secondary">
          <Settings size={28} strokeWidth={2.5}/>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-pal-text">Parent</h1>
          <p className="text-pal-text/70 font-medium">Dashboard & Controls</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Pet Health Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pal-card rounded-3xl p-5 shadow-sm border border-pal-primary/10"
        >
          <h3 className="font-extrabold text-pal-text mb-2">🐾 Pet Health Summary</h3>
          <p className="text-pal-text/60 text-sm mb-4 font-medium">{name} ({petType})</p>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-pal-text">Overall Health:</span>
            <span className={`font-bold text-lg ${avgHealth > 60 ? 'text-pal-success' : avgHealth > 30 ? 'text-pal-gold' : 'text-pal-danger'}`}>
              {avgHealth}/100
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Hunger', val: hunger },
              { label: 'Happiness', val: happy },
              { label: 'Energy', val: energy },
              { label: 'Clean', val: clean },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-20 text-xs text-pal-text/80">{label}</span>
                <div className="flex-1 h-2 bg-pal-background rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${val > 60 ? 'bg-pal-success' : val > 30 ? 'bg-pal-gold' : 'bg-pal-danger'}`} style={{ width: `${val}%` }} />
                </div>
                <span className="w-8 text-right text-xs text-pal-text/80">{Math.round(val)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-pal-primary/10 font-bold text-pal-gold">
            💰 Paw Coins Balance: {coins}
          </div>
        </motion.div>

        {/* Play Time Limit */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-pal-card rounded-3xl p-5 shadow-sm border border-pal-primary/10"
        >
          <h3 className="font-extrabold text-pal-text mb-2">⏱️ Daily Play Limit</h3>
          <p className="text-pal-text/60 text-sm mb-4 font-medium">Set how many minutes per day your child can play.</p>
          <div className="flex justify-center items-center gap-6">
            <button 
              onClick={() => setDailyLimit(l => Math.max(5, l - 5))}
              className="w-12 h-12 rounded-full bg-pal-primary text-white text-2xl font-bold flex items-center justify-center active:scale-95 transition-transform"
            >
              −
            </button>
            <span className="text-2xl font-bold text-pal-text w-20 text-center">{dailyLimit} m</span>
            <button 
              onClick={() => setDailyLimit(l => Math.min(120, l + 5))}
              className="w-12 h-12 rounded-full bg-pal-primary text-white text-2xl font-bold flex items-center justify-center active:scale-95 transition-transform"
            >
              +
            </button>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-pal-card rounded-3xl p-5 shadow-sm border border-pal-primary/10"
        >
          <h3 className="font-extrabold text-pal-text mb-4">⚙️ Settings</h3>
          <div className="flex justify-between items-center py-2 border-b border-pal-primary/10">
            <span className="font-medium text-pal-text/90">🔔 Pet Reminders</span>
            <div 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full relative shadow-inner cursor-pointer transition-colors ${notifications ? 'bg-pal-primary' : 'bg-pal-text/20'}`}
            >
              <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full shadow-sm transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 pt-4">
            <span className="font-medium text-pal-text/90">📺 Kid-Safe Ads</span>
            <div 
              onClick={() => setAdsEnabled(!adsEnabled)}
              className={`w-12 h-6 rounded-full relative shadow-inner cursor-pointer transition-colors ${adsEnabled ? 'bg-pal-primary' : 'bg-pal-text/20'}`}
            >
              <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full shadow-sm transition-all ${adsEnabled ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="bg-pal-card rounded-3xl p-5 shadow-sm border border-pal-primary/10 flex flex-col gap-3"
        >
          <button 
            onClick={resetPin}
            className="w-full flex justify-between items-center py-3 px-4 bg-pal-background text-pal-primary border-2 border-pal-primary rounded-2xl font-bold active:bg-pal-primary/10 transition-colors"
          >
            🔑 Change Parent PIN
          </button>
          <button 
            onClick={handleResetApp}
            className="w-full flex justify-between items-center py-3 px-4 bg-pal-danger/10 text-pal-danger rounded-2xl font-bold active:bg-pal-danger/20 transition-colors mt-2"
          >
            Reset Pet Data
            <LogOut size={18} />
          </button>
        </motion.div>
      </div>
    </>
  );
};

export const ParentDashboard: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col pt-12 px-6 safe-top bg-pal-background overflow-y-auto pb-32">
      {unlocked ? <DashboardContent /> : <PinPad onSuccess={() => setUnlocked(true)} />}
    </div>
  );
};

