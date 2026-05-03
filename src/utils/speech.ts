import * as Speech from 'expo-speech';

export function petSpeak(text: string) {
  Speech.speak(text, {
    language: 'en-US',
    pitch: 1.4,      // higher pitch = cuter voice
    rate:  0.85,
  });
}
