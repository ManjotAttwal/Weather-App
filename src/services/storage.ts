import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeatherData } from "../models/weather";

const LAST_WEATHER_KEY = "@WeatherMVVM:lastWeather";

export async function saveLastWeather(data: WeatherData): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_WEATHER_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to save weather to storage", e);
  }
}

export async function loadLastWeather(): Promise<WeatherData | null> {
  try {
    const txt = await AsyncStorage.getItem(LAST_WEATHER_KEY);
    if (!txt) return null;
    return JSON.parse(txt) as WeatherData;
  } catch (e) {
    console.warn("Failed to load weather from storage", e);
    return null;
  }
}
