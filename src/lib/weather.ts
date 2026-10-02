/**
 * Weather service for the ResourceX Digital Twin layer.
 *
 * Uses Open-Meteo (https://open-meteo.com) — free, no API key required,
 * and CORS-enabled for direct browser requests. Returns current
 * conditions plus a short hourly forecast for a given lat/lng, which
 * maps directly onto every ResourceX listing (they already carry
 * lat/lng).
 */

 
export type WeatherSnapshot = {
  temperatureC: number;
  precipitationMm: number;
  windKph: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  fetchedAt: string;
};
 
export type WeatherPoint = {
  time: string;
  temperatureC: number;
  precipitationMm: number;
  weatherCode: number;
};
 
export type WeatherData = {
  current: WeatherSnapshot;
  hourly: WeatherPoint[];
};
 
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
 
export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: "temperature_2m,precipitation,weather_code,wind_speed_10m,relative_humidity_2m,is_day",
    hourly: "temperature_2m,precipitation,weather_code",
    forecast_days: "2",
    timezone: "auto",
  });
 
  const response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Weather fetch failed: ${response.status} ${response.statusText}`);
  }
 
  const data = await response.json();
 
  const current: WeatherSnapshot = {
    temperatureC: data.current.temperature_2m,
    precipitationMm: data.current.precipitation,
    windKph: data.current.wind_speed_10m,
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    fetchedAt: data.current.time,
  };
 
  const hourly: WeatherPoint[] = data.hourly.time.map((time: string, i: number) => ({
    time,
    temperatureC: data.hourly.temperature_2m[i],
    precipitationMm: data.hourly.precipitation[i],
    weatherCode: data.hourly.weather_code[i],
  }));
 
  return { current, hourly };
}
 
// WMO weather interpretation codes, as used by Open-Meteo.
// https://open-meteo.com/en/docs#weathervariables
const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};
 
export function describeWeatherCode(code: number): string {
  return WEATHER_CODE_LABELS[code] ?? "Unknown conditions";
}
 
export type WeatherSeverity = "clear" | "rain" | "heavy-rain" | "storm" | "extreme-heat";
 
/**
 * Buckets a raw weather snapshot into a severity level the Digital
 * Twin engine (and map markers) can key rules off of, rather than
 * every consumer re-deriving thresholds from raw numbers.
 */
export function classifySeverity(snapshot: WeatherSnapshot): WeatherSeverity {
  if (snapshot.weatherCode >= 95) return "storm";
  if (snapshot.temperatureC >= 40) return "extreme-heat";
  if (snapshot.precipitationMm >= 7.6) return "heavy-rain"; // mm/hr threshold for "heavy" rain
  if (snapshot.precipitationMm > 0 || snapshot.weatherCode >= 51) return "rain";
  return "clear";
}
 