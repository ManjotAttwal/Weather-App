import { WeatherData } from "../models/weather";

/**
 * VisualCrossing example:
 * https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{location}?unitGroup=metric&key={YOUR_KEY}&contentType=json
 *
 * We'll expect the user to set REACT_NATIVE_VISUALCROSSING_KEY in .env
 */

const BASE = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

const API_KEY = process.env.EXPO_PUBLIC_VISUALCROSSING_KEY || ""; // set in app.config or .env and through expo env

export async function fetchWeatherForCity(city: string): Promise<WeatherData> {
  if (!API_KEY) throw new Error("VisualCrossing API key not set. Set EXPO_PUBLIC_VISUALCROSSING_KEY.");

  const url = `${BASE}/${encodeURIComponent(city)}?unitGroup=metric&key=${API_KEY}&contentType=json&include=current`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(()=>"");
    throw new Error(`API request failed: ${res.status} ${res.statusText} ${txt}`);
  }
  const json = await res.json();

  // VisualCrossing returns currentConditions
  const current = json.currentConditions ?? (json.days && json.days[0] && json.days[0].hours && json.days[0].hours[0]) ?? null;
  if (!json || !json.resolvedAddress || !current) {
    throw new Error("Unexpected API response format.");
  }

  const data = {
    city: json.resolvedAddress,
    tempC: Number(current.temp ?? json.currentConditions.temp),
    tempF: Number(((current.temp ?? json.currentConditions.temp) * 9) / 5 + 32),
    humidity: Number(current.humidity ?? json.currentConditions.humidity ?? 0),
    windSpeed: Number(current.windspeed ?? json.currentConditions.windspeed ?? 0),
    conditions: current.conditions ?? json.currentConditions.conditions ?? "Unknown",
    raw: json,
    fetchedAt: new Date().toISOString(),
  } as WeatherData;

  return data;
}
