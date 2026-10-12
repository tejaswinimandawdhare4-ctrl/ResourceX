import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarClock,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { AvailabilityCalendar } from "@/components/resourcex/AvailabilityCalendar";
import { GoogleMapPanel } from "@/components/resourcex/GoogleMapPanel";
import { MatchMeter } from "@/components/resourcex/MatchMeter";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { getListing, inr, reviews } from "@/lib/resourcex-data";

export const Route = createFileRoute("/resource/$resourceId")({
  loader: ({ params }) => {
    const listing = getListing(params.resourceId);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Resource unavailable — ResourceX" }, { name: "robots", content: "noindex" }] };
    }
    const { listing } = loaderData;
    const title = `${listing.name} — ${listing.provider} | ResourceX`;
    const description = `${listing.quantity} available at ${inr(listing.unitPrice)} per unit, ${listing.distanceKm} km away in ${listing.city}. Available ${listing.availableDate}, ${listing.availableWindow}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ResourceDetails,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">Resource not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">This listing may have been deactivated.</p>
        <Button asChild className="mt-6">
          <Link to="/search">Back to search</Link>
        </Button>
      </div>
    </div>
  ),
});

// Category-specific image sets from Unsplash (free, no auth required)
const CATEGORY_IMAGES: Record<string, Array<{ url: string; label: string }>> = {
  Seating: [
    { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80", label: "Inventory photo" },
    { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80", label: "Setup view" },
    { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80", label: "Storage & handling" },
  ],
  Tables: [
    { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", label: "Inventory photo" },
    { url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&q=80", label: "Setup view" },
    { url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&q=80", label: "Storage & handling" },
  ],
  "AV Equipment": [
    { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80", label: "Inventory photo" },
    { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80", label: "Setup view" },
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", label: "AV equipment" },
  ],
  Parking: [
    { url: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80", label: "Parking area" },
    { url: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=600&q=80", label: "Valet zone" },
    { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", label: "Entry gate" },
  ],
  Kitchen: [
    { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80", label: "Kitchen setup" },
    { url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80", label: "Equipment" },
    { url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80", label: "Cold storage" },
  ],
  Furniture: [
    { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", label: "Furniture" },
    { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80", label: "Setup view" },
    { url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80", label: "Storage" },
  ],
  Vehicles: [
    { url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80", label: "Vehicle fleet" },
    { url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80", label: "Interior" },
    { url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80", label: "Exterior view" },
  ],
  Venue: [
    { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80", label: "Venue hall" },
    { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80", label: "Banquet setup" },
    { url: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80", label: "Stage & decor" },
  ],
};

const DEFAULT_IMAGES = [
  { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80", label: "Inventory photo" },
  { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80", label: "Setup view" },
  { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80", label: "Storage & handling" },
];

function getCategoryImages(category: string, _name: string) {
  return CATEGORY_IMAGES[category] ?? DEFAULT_IMAGES;
}

function ResourceDetails() {
  const { listing } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <h1 className="text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl">
                  {listing.name}
                </h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <Link
                    to="/profile/$business"
                    params={{ business: listing.provider }}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {listing.provider}
                  </Link>
                  <span className="flex items-center gap-1 text-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {listing.rating}
                    <span className="text-muted-foreground">({listing.reviews})</span>
                  </span>
                  {listing.verified && (
                    <span className="flex items-center gap-1 text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified Provider
                    </span>
                  )}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-extrabold text-foreground tabular-nums">
                  {inr(listing.unitPrice)}
                </p>
                <p className="text-xs text-muted-foreground">per unit</p>
              </div>
            </div>

            {/* Photo strip */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {getCategoryImages(listing.category, listing.name).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
                  aria-hidden={i > 0}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Available", `${listing.quantity} units`],
                ["Distance", `${listing.distanceKm} km away`],
                ["Date", listing.availableDate],
                ["Window", listing.availableWindow],
              ].map(([k, v]) => (
                <div key={k} className="panel px-4 py-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="mt-1 text-sm font-bold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-foreground">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-foreground">Features</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  [Truck, listing.delivery ? "Delivery available" : "Pickup only"],
                  [CalendarClock, `Flexible rental duration (min ${listing.minRental})`],
                  [BadgeCheck, listing.verified ? "Verified provider" : "Verification pending"],
                  [Zap, "Real-time availability"],
                ].map(([Icon, label]) => {
                  const I = Icon as typeof Truck;
                  return (
                    <li
                      key={label as string}
                      className="flex items-center gap-2 panel px-4 py-3 text-sm text-muted-foreground"
                    >
                      <I className="h-4 w-4 shrink-0 text-primary" />
                      <span className="min-w-0">{label as string}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-foreground">Location</h2>
              <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> {listing.area}, {listing.city} ·{" "}
                {listing.distanceKm} km away
              </p>
              <GoogleMapPanel listings={[listing]} activeId={listing.id} className="mt-4" />
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-foreground">Availability calendar</h2>
              <AvailabilityCalendar className="mt-4" />
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-foreground">Reviews</h2>
              <div className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <div key={r.business} className="panel p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <p className="truncate text-sm font-bold text-foreground">{r.business}</p>
                      <p className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {r.rating}.0
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground/70">{r.date}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Estimated total</p>
              <p className="mt-1 text-3xl font-extrabold text-foreground tabular-nums">
                {inr(listing.totalPrice)}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" /> {listing.availableWindow} ·{" "}
                {listing.availableDate}
              </p>
              <Button asChild size="lg" className="mt-5 w-full">
                <Link
                  to="/request/$resourceId"
                  params={{ resourceId: listing.id }}
                  search={{ quantity: listing.quantity }}
                >
                  Request Resource
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="mt-2 w-full">
                <Link to="/negotiation/$resourceId" params={{ resourceId: listing.id }}>
                  <MessageSquare className="h-4 w-4" /> Contact Provider
                </Link>
              </Button>
            </div>
            <MatchMeter
              breakdown={listing.match}
              explanation="This resource matches your requested quantity and availability, is nearby and fits your budget."
            />
          </aside>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
