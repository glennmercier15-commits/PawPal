import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { AVPlaybackSource } from 'expo-av/build/AV';

export function useSoundEffect(assetModule: AVPlaybackSource) {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.Sound.createAsync(assetModule).then(({ sound }) => {
      soundRef.current = sound;
    });
    return () => { 
      if (soundRef.current) {
        soundRef.current.unloadAsync(); 
      }
    };
  }, [assetModule]);

  const play = async () => {
    if (soundRef.current) {
       await soundRef.current.replayAsync();
    }
  };

  return { play };
}
