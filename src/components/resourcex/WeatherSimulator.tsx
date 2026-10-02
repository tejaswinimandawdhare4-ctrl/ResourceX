import { useMemo, useState } from "react";
import { CloudRain, Thermometer, Zap } from "lucide-react";
import { listings } from "@/lib/resourcex-data";
import { simulateWeatherImpact } from "@/lib/digitaltwin";
import { cn } from "@/lib/utils";

/**
 * Digital Twin What-If Simulator.
 *
 * Runs simulateWeatherImpact() against every real listing in the
 * marketplace using hypothetical weather from the sliders below —
 * demonstrating the required interactive scenario where changing a
 * weather parameter produces a corresponding, visible change across
 * the system, including cascading effects across different resource
 * categories (e.g. rain simultaneously raising Parking/Vehicle demand
 * while lowering Seating/Furniture availability).
 *
 * No real listing data is mutated — this is a pure simulation layer.
 */
export function WeatherSimulator() {
  const [rainfall, setRainfall] = useState(0); // mm/hr
  const [temperature, setTemperature] = useState(28); // °C
  const [isStorm, setIsStorm] = useState(false);

  const results = useMemo(() => {
    return listings.map((listing) => ({
      listing,
      impact: simulateWeatherImpact(listing, {
        temperatureC: temperature,
        precipitationMm: rainfall,
        isStorm,
      }),
    }));
  }, [rainfall, temperature, isStorm]);

  // Biggest movers first — makes the cascading effect visually obvious.
  const sorted = [...results].sort(
    (a, b) => Math.abs(b.impact.demandMultiplier - 1) - Math.abs(a.impact.demandMultiplier - 1),
  );

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          What-If Simulator
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Drag the sliders to simulate a weather scenario and watch every resource across ResourceX react
        through the Digital Twin — no real listings are changed.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <CloudRain className="h-3.5 w-3.5 text-primary" /> Rainfall intensity
            </span>
            <span className="font-bold tabular-nums text-primary">{rainfall} mm/hr</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={rainfall}
            onChange={(e) => setRainfall(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <Thermometer className="h-3.5 w-3.5 text-primary" /> Temperature
            </span>
            <span className="font-bold tabular-nums text-primary">{temperature}°C</span>
          </div>
          <input
            type="range"
            min={15}
            max={45}
            step={1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={isStorm}
          onChange={(e) => setIsStorm(e.target.checked)}
          className="accent-primary"
        />
        Active storm conditions
      </label>

      <div className="mt-5 space-y-2">
        {sorted.map(({ listing, impact }) => {
          const demandPct = Math.round((impact.demandMultiplier - 1) * 100);
          return (
            <div
              key={listing.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface/70 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{listing.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {listing.category} · {listing.provider}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-right">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Demand</p>
                  <p
                    className={cn(
                      "text-sm font-bold tabular-nums",
                      demandPct > 0
                        ? "text-primary"
                        : demandPct < 0
                          ? "text-orange-400"
                          : "text-foreground",
                    )}
                  >
                    {demandPct > 0 ? "+" : ""}
                    {demandPct}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Units</p>
                  <p className="text-sm font-bold tabular-nums text-foreground">
                    {impact.effectiveQuantity}/{listing.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Match</p>
                  <p className="text-sm font-bold tabular-nums text-foreground">{impact.adjustedScore}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}