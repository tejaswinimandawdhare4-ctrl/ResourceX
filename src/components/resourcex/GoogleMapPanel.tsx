import { Link } from "@tanstack/react-router";
import { MapPin, Navigation, Satellite } from "lucide-react";
import { useCallback, useMemo } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { inr, matchScore, type ResourceListing } from "@/lib/resourcex-data";
import { cn } from "@/lib/utils";

const GOOGLE_MAPS_API_KEY = import.meta.env["VITE_GOOGLE_MAPS_API_KEY"] as string | undefined;

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0f1117" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f1117" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b7280" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#141a1f" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e2633" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0f1117" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1a2332" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a0f1a" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#374151" }],
  },
];

/**
 * Google Maps integration for ResourceX.
 *
 * When VITE_GOOGLE_MAPS_API_KEY is set, renders real dark-styled Google Maps
 * tiles with provider markers. Falls back gracefully with a styled placeholder
 * when the key is missing.
 */
export function GoogleMapPanel({
  listings,
  activeId,
  onSelect,
  className,
}: {
  listings: ResourceListing[];
  activeId?: string | null | undefined;
  onSelect?: ((id: string) => void) | undefined;
  className?: string | undefined;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
    id: "resourcex-google-map",
  });

  // Calculate center from listings
  const center = useMemo(() => {
    if (listings.length === 0) return { lat: 19.076, lng: 72.8777 }; // Mumbai default
    const avgLat = listings.reduce((s, l) => s + l.lat, 0) / listings.length;
    const avgLng = listings.reduce((s, l) => s + l.lng, 0) / listings.length;
    return { lat: avgLat, lng: avgLng };
  }, [listings]);

  const active = listings.find((l) => l.id === activeId) ?? null;

  const onLoad = useCallback((_map: google.maps.Map) => {
    // Map loaded
  }, []);

  // If no API key, show the styled placeholder
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <FallbackMapPanel
        listings={listings}
        activeId={activeId}
        onSelect={onSelect}
        className={className}
      />
    );
  }

  return (
    <div className={cn("panel relative overflow-hidden", className)}>
      {/* Header */}
      <div className="relative flex items-center justify-between gap-3 border-b border-border px-4 py-3 bg-card/80 backdrop-blur-sm z-10">
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

      {/* Map */}
      <div className="relative h-[360px] lg:h-[calc(100%-49px)]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={12}
            onLoad={onLoad}
            options={{
              styles: darkMapStyles,
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {listings.map((listing) => (
              <Marker
                key={listing.id}
                position={{ lat: listing.lat, lng: listing.lng }}
                onClick={() => onSelect?.(listing.id)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: listing.id === activeId ? 10 : 7,
                  fillColor: listing.id === activeId ? "#22d3ee" : "#0e7490",
                  fillOpacity: 1,
                  strokeColor: listing.id === activeId ? "#ffffff" : "#22d3ee",
                  strokeWeight: 2,
                }}
                title={listing.provider}
              />
            ))}

            {active && (
              <InfoWindow
                position={{ lat: active.lat, lng: active.lng }}
                onCloseClick={() => onSelect?.("")}
                options={{ disableAutoPan: false }}
              >
                <div className="min-w-[200px] rounded-lg bg-[#0f1117] p-3 text-white">
                  <p className="text-sm font-bold text-white">{active.provider}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {active.distanceKm} km · {active.quantity} {active.name.toLowerCase()}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-cyan-400">
                    {inr(active.totalPrice)} · {matchScore(active.match)}% match
                  </p>
                  <a
                    href={`/resource/${active.id}`}
                    className="mt-2 block rounded bg-cyan-600 px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-cyan-500"
                  >
                    View Resource
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="flex h-full items-center justify-center bg-card/50">
            <p className="text-xs text-muted-foreground">Loading map…</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Fallback panel when API key is absent ─────────────

function FallbackMapPanel({
  listings,
  activeId,
  onSelect,
  className,
}: {
  listings: ResourceListing[];
  activeId?: string | null | undefined;
  onSelect?: ((id: string) => void) | undefined;
  className?: string | undefined;
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
            Provider Map · Nearby providers
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
              Markers show provider distance, available quantity and match score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
