import { useState, useCallback, useEffect } from "react";
import { WeatherData } from "../models/weather";
import * as api from "../services/visualCrossingApi";
import * as storage from "../services/storage";

export function useWeatherViewModel() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState<boolean>(false);

  const loadCached = useCallback(async () => {
    const cached = await storage.loadLastWeather();
    if (cached) {
      setWeather(cached);
      setIsOfflineData(true);
    }
  }, []);

  useEffect(() => {
    loadCached();
  }, [loadCached]);

  const fetchWeather = useCallback(async (queryCity?: string) => {
    const q = (queryCity ?? city).trim();
    if (!q) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError(null);
    setIsOfflineData(false);

    try {
      const data = await api.fetchWeatherForCity(q);
      setWeather(data);
      await storage.saveLastWeather(data);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Failed to fetch weather.");
      // try to load cache if exists
      const cached = await storage.loadLastWeather();
      if (cached) {
        setWeather(cached);
        setIsOfflineData(true);
      }
    } finally {
      setLoading(false);
    }
  }, [city]);

  const refresh = useCallback(async () => {
    if (!weather) return;
    await fetchWeather(weather.city);
  }, [weather, fetchWeather]);

  return {
    city,
    setCity,
    weather,
    loading,
    error,
    isOfflineData,
    fetchWeather,
    refresh,
    loadCached,
  } as const;
}
