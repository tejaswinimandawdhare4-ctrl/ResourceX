import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Star, Truck } from "lucide-react";
import { MatchBadge } from "@/components/resourcex/MatchMeter";
import { Button } from "@/components/ui/button";
import { computeListingPrice, inr, matchScore, type ResourceListing } from "@/lib/resourcex-data";
import { cn } from "@/lib/utils";

export function ResourceCard({
  listing,
  requestedQuantity,
  active,
  onHighlight,
}: {
  listing: ResourceListing;
  requestedQuantity?: number;
  active?: boolean;
  onHighlight?: (id: string) => void;
}) {
  const score = matchScore(listing.match);
  const displayPrice = computeListingPrice(listing, requestedQuantity);

  return (
    <article
      onMouseEnter={() => onHighlight?.(listing.id)}
      onClick={() => onHighlight?.(listing.id)}
      className={cn(
        "panel cursor-pointer p-4 transition-all duration-200 hover:border-primary/40 sm:p-5",
        active && "border-primary/60 glow-ring",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <MatchBadge score={score} />
          <h3 className="mt-2 truncate text-base font-bold text-foreground">{listing.provider}</h3>
          <p className="truncate text-sm text-muted-foreground">{listing.name}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-extrabold text-foreground tabular-nums">
            {inr(displayPrice)}
          </div>
          <div className="text-[11px] text-muted-foreground">{inr(listing.unitPrice)} / unit</div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">Available</dt>
          <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
            {listing.quantity} units
            {typeof requestedQuantity === "number" && (
              <span className="ml-1 font-normal text-muted-foreground">
                · Requested {requestedQuantity}
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Distance</dt>
          <dd className="mt-0.5 flex items-center gap-1 font-semibold text-foreground">
            <MapPin className="h-3 w-3 shrink-0 text-primary" />
            {listing.distanceKm} km
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Date</dt>
          <dd className="mt-0.5 truncate font-semibold text-foreground">{listing.availableDate}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Window</dt>
          <dd className="mt-0.5 truncate font-semibold text-foreground">{listing.availableWindow}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-semibold text-foreground">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          {listing.rating}
          <span className="font-normal text-muted-foreground">({listing.reviews})</span>
        </span>
        {listing.delivery && (
          <span className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-primary" /> Delivery available
          </span>
        )}
        {listing.verified && (
          <span className="flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Verified provider
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/resource/$resourceId" params={{ resourceId: listing.id }}>
            View Details
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link 
          to="/request/$resourceId" 
          params={{ resourceId: listing.id }}
          search={{ quantity: requestedQuantity }} >
            Request
          </Link>
        </Button>
      </div>
    </article>
  );
}