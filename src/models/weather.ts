export type WeatherCondition = {
  id: number;
  main: string;
  description: string;
  icon?: string;
};

export type WeatherData = {
  city: string;
  tempC: number;           // Celsius
  tempF?: number;          // Fahrenheit (optional)
  humidity: number;        // %
  windSpeed: number;       // m/s
  conditions: string;      // e.g., "Clear", "Cloudy"
  raw?: any;               // original response
  fetchedAt: string;       // ISO timestamp
};
