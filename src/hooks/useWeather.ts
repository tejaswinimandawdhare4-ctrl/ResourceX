import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchWeather, type WeatherData } from "@/lib/weather";
import type { ResourceListing } from "@/lib/resourcex-data";
 
/**
 * Weather for a single coordinate, cached and auto-refreshed.
 */
export function useWeather(lat: number, lng: number) {
  return useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: () => fetchWeather(lat, lng),
    staleTime: 10 * 60 * 1000, // 10 minutes — Open-Meteo data doesn't change faster than this
    refetchInterval: 15 * 60 * 1000, // keep it live without hammering the API
  });
}
 
export type CityWeatherEntry = {
  data: WeatherData | undefined;
  isLoading: boolean;
  error: unknown;
};
 
/**
 * Fetches weather once per unique city among the given listings,
 * rather than once per listing — several listings often share a
 * city, and there's no reason to request the same forecast twice.
 * Returns a Map keyed by city name.
 */
export function useCitiesWeather(listings: ResourceListing[]): Map<string, CityWeatherEntry> {
  const uniqueCities = Array.from(
    new Map(listings.map((l) => [l.city, { lat: l.lat, lng: l.lng }])).entries(),
  );
 
  const results = useQueries({
    queries: uniqueCities.map(([city, coords]) => ({
      queryKey: ["weather", city, coords.lat, coords.lng],
      queryFn: () => fetchWeather(coords.lat, coords.lng),
      staleTime: 10 * 60 * 1000,
    })),
  });
 
  const byCity = new Map<string, CityWeatherEntry>();
  uniqueCities.forEach(([city], i) => {
    byCity.set(city, {
      data: results[i]?.data,
      isLoading: results[i]?.isLoading ?? false,
      error: results[i]?.error,
    });
  });
 
  return byCity;
}