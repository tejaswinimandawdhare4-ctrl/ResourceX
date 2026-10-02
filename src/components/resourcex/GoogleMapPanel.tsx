import { Link } from "@tanstack/react-router";
import { MapPin, Navigation, Satellite } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { inr, matchScore, type ResourceListing } from "@/lib/resourcex-data";
import { cn } from "@/lib/utils";

/**
 * Google Maps integration surface for ResourceX.
 *
 * Renders cyan provider markers over a dark map surface with provider preview
 * cards. When the Google Maps browser key is connected, live tiles and routes
 * render in the same panel. No other map provider is used.
 */

export function GoogleMapPanel({
  listings,
  activeId,
  onSelect,
  className,
}: {
  listings: ResourceListing[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const positions = useMemo(() => {
    const lats = listings.map((l) => l.lat);
    const lngs = listings.map((l) => l.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return listings.map((l) => ({
      id: l.id,
      top: 86 - ((l.lat - minLat) / (maxLat - minLat || 1)) * 72,
      left: 12 + ((l.lng - minLng) / (maxLng - minLng || 1)) * 74,
    }));
  }, [listings]);

  const active = listings.find((l) => l.id === activeId) ?? null;

  return (
    <div className={cn("panel relative overflow-hidden", className)}>
      <div className="absolute inset-0 grid-backdrop opacity-70" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 80% at 30% 20%, oklch(0.29 0.043 236 / 0.9), oklch(0.209 0.032 231.5))",
        }}
      />

      <div className="relative flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Satellite className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Google Maps · Nearby providers
          </span>
        </div>
        <span className="shrink-0 rounded-md border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {listings.length} within 25 km
        </span>
      </div>


      <div className="relative h-[360px] lg:h-[calc(100%-49px)]">
        {positions.map((p) => {
          const listing = listings.find((l) => l.id === p.id)!;
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => onSelect?.(p.id)}
              aria-label={`${listing.provider} marker`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${p.top}%`, left: `${p.left}%` }}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full border transition-all",
                  isActive
                    ? "scale-125 border-primary bg-primary text-primary-foreground shadow-[0_0_24px_var(--color-primary)]"
                    : "border-primary/50 bg-card text-primary hover:border-primary",
                )}
              >
                <MapPin className="h-4 w-4" />
              </span>
            </button>
          );
        })}

        {active && (
          <div className="absolute inset-x-3 bottom-3 glass rounded-xl p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{active.provider}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {active.distanceKm} km · {active.quantity} {active.name.toLowerCase()}
                </p>
                <p className="mt-1 text-xs font-semibold text-primary">
                  {inr(active.totalPrice)} · {matchScore(active.match)}% match
                </p>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link to="/resource/$resourceId" params={{ resourceId: active.id }}>
                  View
                </Link>
              </Button>
            </div>
          </div>
        )}

        {!active && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl border border-primary/25 bg-surface/70 p-3 text-center">
            <p className="flex items-center justify-center gap-2 text-xs font-semibold text-primary">
              <Navigation className="h-3.5 w-3.5" /> Tap a marker to preview a provider
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Markers show provider distance, available quantity and match score across Mumbai.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
