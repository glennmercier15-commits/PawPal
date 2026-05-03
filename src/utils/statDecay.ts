import { useEffect } from 'react';
import { usePetStore } from '../store/usePetStore';
import { sendLowStatAlert } from './notifications';

export const useStatDecay = () => {
  const decayStats = usePetStore((state) => state.decayStats);
  const applyOfflineDecay = usePetStore((state) => state.applyOfflineDecay);
  const petType = usePetStore((state) => state.petType);

  useEffect(() => {
    if (!petType) return;
    
    // Apply offline decay once on mount
    applyOfflineDecay();

    // Check for critically low stats after offline decay
    const state = usePetStore.getState();
    const { name, hunger, happy, energy, clean } = state;
    
    if (hunger < 20) sendLowStatAlert('hunger', name);
    if (happy < 20) sendLowStatAlert('happiness', name);
    if (energy < 20) sendLowStatAlert('energy', name);
    if (clean < 20) sendLowStatAlert('cleanliness', name);
    
    const interval = setInterval(() => {
      decayStats();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [applyOfflineDecay, decayStats, petType]);
};
