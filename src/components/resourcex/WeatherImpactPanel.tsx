import { AlertTriangle, CloudRain, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { computeWeatherImpact } from "@/lib/digitaltwin";
import { describeWeatherCode } from "@/lib/weather";
import type { ResourceListing } from "@/lib/resourcex-data";
import { cn } from "@/lib/utils";

/**
 * Digital Twin display: fetches real live weather for a listing's
 * location, runs it through the weather-impact model, and shows the
 * predicted demand/availability shift with a confidence band and
 * plain-language cascade explanations.
 */
export function WeatherImpactPanel({ listing }: { listing: ResourceListing }) {
  const { data, isLoading, error } = useWeather(listing.lat, listing.lng);

  if (isLoading) {
    return (
      <div className="panel p-5">
        <p className="text-xs text-muted-foreground">Loading live weather conditions…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="panel p-5">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 text-primary" />
          Weather data unavailable right now.
        </p>
      </div>
    );
  }

  const impact = computeWeatherImpact(listing, data.current);
  const demandUp = impact.demandMultiplier > 1.02;
  const demandDown = impact.demandMultiplier < 0.98;
  const scoreDelta = impact.adjustedScore - impact.baselineScore;

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Digital Twin · Weather Impact
          </span>
        </div>
        <span className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          ±{impact.confidenceBandPct}% confidence
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-foreground">
        <CloudRain className="h-4 w-4 text-primary" />
        <span className="font-semibold">{Math.round(data.current.temperatureC)}°C</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{describeWeatherCode(data.current.weatherCode)}</span>
        <span className="text-muted-foreground">· {listing.city}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface/70 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Predicted demand</p>
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-lg font-extrabold tabular-nums",
              demandUp ? "text-primary" : demandDown ? "text-orange-400" : "text-foreground",
            )}
          >
            {demandUp && <TrendingUp className="h-4 w-4" />}
            {demandDown && <TrendingDown className="h-4 w-4" />}
            {Math.round((impact.demandMultiplier - 1) * 100)}%
          </p>
        </div>
        <div className="rounded-xl bg-surface/70 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Usable availability</p>
          <p className="mt-1 text-lg font-extrabold tabular-nums text-foreground">
            {impact.effectiveQuantity}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              / {listing.quantity} units
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-surface/70 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Weather-adjusted match score</span>
          <span className="font-bold tabular-nums text-foreground">
            {impact.adjustedScore}%
            {scoreDelta !== 0 && (
              <span className={cn("ml-1", scoreDelta > 0 ? "text-primary" : "text-orange-400")}>
                ({scoreDelta > 0 ? "+" : ""}
                {scoreDelta} from baseline {impact.baselineScore}%)
              </span>
            )}
          </span>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {impact.cascadeNotes.map((note) => (
          <li key={note} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}