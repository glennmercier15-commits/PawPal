import * as Location from 'expo-location';

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function getWeatherMood(): Promise<'sunny' | 'cloudy' | 'rainy' | 'snowy'> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return 'sunny';

    const { coords } = await Location.getCurrentPositionAsync({});
    const res = await fetch(
      `${WEATHER_API}?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`
    );
    const data = await res.json();
    const code = data.current_weather?.weathercode;

    if (code === 0)          return 'sunny';      // Clear sky
    if (code <= 3)           return 'cloudy';
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 77) return 'snowy';
    return 'cloudy';
  } catch (error) {
    console.error('Failed to get weather:', error);
    return 'sunny';
  }
}
