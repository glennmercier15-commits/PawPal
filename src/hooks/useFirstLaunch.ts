import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('pawpal_onboarded').then(val => {
      setIsFirstLaunch(val === null);
    });
  }, []);

  return isFirstLaunch;
}
