import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MatchMeter } from "@/components/resourcex/MatchMeter";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { featuredListing } from "@/lib/resourcex-data";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ResourceX Works — List, Discover, Match, Exchange" },
      {
        name: "description",
        content:
          "See how ResourceX takes a hospitality requirement from natural-language search to a confirmed, conflict-free booking.",
      },
      { property: "og:title", content: "How ResourceX Works" },
      {
        property: "og:description",
        content: "List, discover, match and exchange hospitality resources in four steps.",
      },
    ],
  }),
  component: HowItWorks,
});

const journey = [
  ["01", "Requirement", "A business needs 150 chairs near the city centre tomorrow evening under ₹10,000."],
  ["02", "AI-assisted search", "Plain-language input is parsed into resource, quantity, location, date, time and budget."],
  ["03", "Smart matching", "Live listings are scored on availability, distance, price, quantity and rating."],
  ["04", "Compare on the map", "Google Maps shows nearby providers with distance and availability context."],
  ["05", "Request & negotiate", "Send a structured request, receive a quote, counter-offer and confirm."],
  ["06", "Booking & fulfilment", "Availability updates instantly and both dashboards reflect the exchange."],
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Process</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
            From idle capacity to confirmed booking.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground">
            ResourceX standardises how hospitality businesses share resources — replacing broker calls
            and WhatsApp groups with structured discovery, scoring and tracked transactions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {journey.map(([no, title, body]) => (
            <div key={no} className="panel p-6">
              <span className="text-xs font-extrabold tracking-[0.2em] text-primary">{no}</span>
              <h2 className="mt-3 text-lg font-bold text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/60">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground">Transparent scoring</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The Smart Matching Engine is a weighted scoring algorithm — not a black box. Each factor
              contributes a fixed share of the final score, so providers know how to rank higher and
              seekers know exactly why a result is recommended.
            </p>
            <Button asChild className="mt-6">
              <Link to="/search">
                Try a search <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <MatchMeter
            breakdown={featuredListing.match}
            explanation="This resource matches your requested quantity and availability, is nearby and fits your budget."
          />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
