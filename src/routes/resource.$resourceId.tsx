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

            {/* Photo strip (illustrative panels) */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden panel grid-backdrop"
                  aria-hidden={i > 0}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(120% 90% at 30% 15%, oklch(0.851 0.132 183.5 / 0.16), transparent 70%)",
                    }}
                  />
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {["Inventory photo", "Setup view", "Storage & handling"][i]}
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
                <Link to="/request/$resourceId" params={{ resourceId: listing.id }}>
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
