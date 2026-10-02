import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { ResourceCard } from "@/components/resourcex/ResourceCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { listings, reviews } from "@/lib/resourcex-data";

export const Route = createFileRoute("/profile/$business")({
  loader: ({ params }) => {
    const business = decodeURIComponent(params.business);
    const owned = listings.filter((l) => l.provider === business);
    return { business, owned: owned.length ? owned : listings.slice(0, 2) };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.business ?? "Business profile";
    const title = `${name} — Business Profile | ResourceX`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `${name} on ResourceX: verified hospitality business with listed resources, ratings and fulfilment history.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Verified hospitality business profile with listed resources and reviews.",
        },
      ],
    };
  },
  component: BusinessProfile,
});

function BusinessProfile() {
  const { business, owned } = Route.useLoaderData();
  const first = owned[0]!;
  const avg = (owned.reduce((s, l) => s + l.rating, 0) / owned.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-backdrop opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-3xl font-extrabold text-foreground sm:text-4xl">
                {business}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" /> {first.area}, {first.city}
                </span>
                <span className="flex items-center gap-1 text-foreground">
                  <Star className="h-4 w-4 fill-primary text-primary" /> {avg} average rating
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <BadgeCheck className="h-4 w-4" /> Verified business
                </span>
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link to="/negotiation/$resourceId" params={{ resourceId: first.id }}>
                Contact business
              </Link>
            </Button>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(
              [
                ["Listed resources", String(owned.length)],
                ["Completed exchanges", "48"],
                ["Response time", "~28 min"],
                ["Fulfilment rate", "97%"],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="panel px-4 py-3">
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-lg font-extrabold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-extrabold text-foreground">Available resources</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {owned.map((l) => (
            <ResourceCard key={l.id} listing={l} />
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-extrabold text-foreground">Reviews from partners</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
      <SiteFooter />
    </div>
  );
}
