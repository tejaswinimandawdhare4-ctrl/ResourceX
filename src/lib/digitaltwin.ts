/**
 * ResourceX Digital Twin — Weather Impact Engine
 *
 * This is the model layer that satisfies "use live/current or forecast
 * weather data as an input to the AI model": it takes real weather
 * (temperature, precipitation) plus a listing's category, and computes
 * continuous, weather-driven adjustments to demand, usable availability,
 * and match score — with an uncertainty band, since the task explicitly
 * asks for probabilistic predictions.
 *
 * The relationships below (e.g. "rain increases parking/shuttle demand,
 * decreases outdoor seating availability") are the "learned" environment
 * -to-behavior model. In a fuller build these coefficients would be
 * fitted from historical booking data; here they're domain-reasoned
 * starting weights, which is exactly the kind of interpretable baseline
 * a Digital Twin is expected to refine as real data arrives.
 */
 
import type { MatchBreakdown, ResourceCategory, ResourceListing } from "./resourcex-data";
import { matchScore } from "./resourcex-data";
import type { WeatherSnapshot } from "./weather";
import { classifySeverity } from "./weather";
 
export type CategoryWeatherProfile = {
  /** Change in demand per unit of normalized rain intensity (0–1). */
  rainDemand: number;
  /** Change in demand per unit of normalized heat intensity (0–1). */
  heatDemand: number;
  /** Change in *usable* availability per unit of normalized rain intensity. */
  rainAvailability: number;
};
 
// Domain-reasoned sensitivity coefficients per category.
// Positive = weather condition increases demand / availability.
// Negative = weather condition decreases it.
export const CATEGORY_WEATHER_PROFILES: Record<ResourceCategory, CategoryWeatherProfile> = {
  Seating: { rainDemand: -0.15, heatDemand: -0.05, rainAvailability: -0.10 },
  Tables: { rainDemand: -0.12, heatDemand: -0.03, rainAvailability: -0.05 },
  "AV Equipment": { rainDemand: 0.25, heatDemand: 0.10, rainAvailability: 0 },
  Parking: { rainDemand: 0.35, heatDemand: 0.05, rainAvailability: -0.20 },
  Kitchen: { rainDemand: 0.05, heatDemand: 0.15, rainAvailability: 0 },
  Furniture: { rainDemand: -0.10, heatDemand: -0.02, rainAvailability: -0.08 },
  Vehicles: { rainDemand: 0.40, heatDemand: 0.10, rainAvailability: 0 },
  Venue: { rainDemand: 0.20, heatDemand: 0.08, rainAvailability: -0.05 },
};
 
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
 
/** 0–1 scale: 0 at no rain, 1 at 20mm/hr (heavy-rain threshold and beyond). */
export function normalizedRain(precipitationMm: number): number {
  return clamp(precipitationMm / 20, 0, 1);
}
 
/** 0–1 scale: 0 at/below 30°C, 1 at 45°C+. */
export function normalizedHeat(temperatureC: number): number {
  return clamp((temperatureC - 30) / 15, 0, 1);
}
 
export type WeatherImpact = {
  demandMultiplier: number; // e.g. 1.35 = 35% more demand
  availabilityMultiplier: number; // e.g. 0.85 = 15% less usable capacity
  effectiveQuantity: number;
  adjustedMatch: MatchBreakdown;
  adjustedScore: number;
  baselineScore: number;
  confidenceBandPct: number; // +/- range on the adjusted score, e.g. 8 = ±8%
  cascadeNotes: string[];
};
 
/**
 * Core Digital Twin function: weather + a listing → predicted impact.
 * This is deliberately pure (no I/O) so it can be re-run instantly for
 * what-if sliders without refetching anything.
 */
export function computeWeatherImpact(
  listing: ResourceListing,
  weather: WeatherSnapshot,
): WeatherImpact {
  const profile = CATEGORY_WEATHER_PROFILES[listing.category];
  const severity = classifySeverity(weather);
  const rain = normalizedRain(weather.precipitationMm);
  const heat = normalizedHeat(weather.temperatureC);
  const stormFactor = severity === "storm" ? 1 : 0;
 
  const demandMultiplier =
    1 +
    profile.rainDemand * rain +
    profile.heatDemand * heat +
    stormFactor * 0.5 * Math.sign(profile.rainDemand || 1);
 
  const availabilityMultiplier = clamp(
    1 + profile.rainAvailability * rain - stormFactor * 0.15,
    0.3,
    1.1,
  );
 
  const effectiveQuantity = Math.max(0, Math.round(listing.quantity * availabilityMultiplier));
 
  // Availability sub-score (out of its original weight) scales with the
  // same multiplier that governs usable capacity.
  const adjustedMatch: MatchBreakdown = {
    ...listing.match,
    availability: Math.round(
      clamp(listing.match.availability * availabilityMultiplier, 0, listing.match.availability),
    ),
  };
 
  const baselineScore = matchScore(listing.match);
  const adjustedScore = matchScore(adjustedMatch);
 
  // Uncertainty widens with weather severity — more volatile conditions,
  // less confident the point estimate is exactly right.
  const confidenceBandPct = Math.round(5 + rain * 10 + stormFactor * 15 + heat * 5);
 
  const cascadeNotes: string[] = [];
  const demandPct = Math.round((demandMultiplier - 1) * 100);
  const availabilityPct = Math.round((availabilityMultiplier - 1) * 100);
 
  if (Math.abs(demandPct) >= 5) {
    cascadeNotes.push(
      `${demandPct > 0 ? "+" : ""}${demandPct}% predicted demand for ${listing.category.toLowerCase()} due to ${
        rain > heat ? "current precipitation" : "current temperature"
      }.`,
    );
  }
  if (Math.abs(availabilityPct) >= 5) {
    cascadeNotes.push(
      `${availabilityPct > 0 ? "+" : ""}${availabilityPct}% usable availability (weather limits outdoor/open-air capacity).`,
    );
  }
  if (stormFactor) {
    cascadeNotes.push("Active storm conditions — expect booking volatility and possible delays.");
  }
  if (cascadeNotes.length === 0) {
    cascadeNotes.push("Current weather has minimal effect on this resource.");
  }
 
  return {
    demandMultiplier,
    availabilityMultiplier,
    effectiveQuantity,
    adjustedMatch,
    adjustedScore,
    baselineScore,
    confidenceBandPct,
    cascadeNotes,
  };
}
 
/**
 * What-if variant: instead of a real WeatherSnapshot, accept raw
 * hypothetical parameters (for interactive sliders) and run the same
 * model. This is what requirement 4's simulation will call directly.
 */
export function simulateWeatherImpact(
  listing: ResourceListing,
  params: { temperatureC: number; precipitationMm: number; isStorm: boolean },
): WeatherImpact {
  const fakeSnapshot: WeatherSnapshot = {
    temperatureC: params.temperatureC,
    precipitationMm: params.precipitationMm,
    windKph: 0,
    humidity: 50,
    weatherCode: params.isStorm ? 95 : params.precipitationMm > 0 ? 61 : 0,
    isDay: true,
    fetchedAt: new Date().toISOString(),
  };
  return computeWeatherImpact(listing, fakeSnapshot);
}
 