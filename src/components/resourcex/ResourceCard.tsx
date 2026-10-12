import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Star, Truck } from "lucide-react";
import { MatchBadge } from "@/components/resourcex/MatchMeter";
import { Button } from "@/components/ui/button";
import { computeListingPrice, inr, matchScore, type ResourceListing } from "@/lib/resourcex-data";
import { cn } from "@/lib/utils";

// Thumbnail images per category from Unsplash (free, no auth needed)
const CATEGORY_THUMBNAILS: Record<string, string> = {
  Seating: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=75",
  Tables: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=75",
  "AV Equipment": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=75",
  Parking: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=75",
  Kitchen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=75",
  Furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75",
  Vehicles: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=75",
  Venue: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=75",
};

const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=75";

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
  const thumbnail = CATEGORY_THUMBNAILS[listing.category] ?? DEFAULT_THUMBNAIL;

  return (
    <article
      onMouseEnter={() => onHighlight?.(listing.id)}
      onClick={() => onHighlight?.(listing.id)}
      className={cn(
        "panel cursor-pointer overflow-hidden transition-all duration-200 hover:border-primary/40",
        active && "border-primary/60 glow-ring",
      )}
    >
      {/* Thumbnail image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={listing.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-3">
          <MatchBadge score={score} />
        </div>
        <div className="absolute right-3 top-3">
          <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {listing.category}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-foreground">{listing.provider}</h3>
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
              search={{ quantity: requestedQuantity ?? 1 }}
            >
              Request
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}