import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ResourceX — Hospitality Resource Exchange" },
      {
        name: "description",
        content:
          "ResourceX is a smart B2B marketplace for shared hospitality resources, built to connect unused capacity with businesses that need it.",
      },
      { property: "og:title", content: "About ResourceX" },
      {
        property: "og:description",
        content: "A smart B2B marketplace for shared hospitality resources.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">About</span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
          Connect unused hospitality capacity with businesses that need it.
        </h1>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            Hotels, banquet halls, caterers and event companies own far more inventory than they use on
            any given day. Meanwhile, a business two kilometres away is calling brokers to find 150
            chairs for tomorrow evening. ResourceX closes that gap.
          </p>
          <p>
            Providers publish resources with quantity, pricing and availability. Seekers describe a
            requirement in plain language. The Smart Matching Engine — a transparent weighted scoring
            algorithm — ranks the options, Google Maps shows what is genuinely nearby, and every
            request, negotiation, booking and fulfilment step is tracked in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Mail, label: "Email", value: "tejaswinimandawdhare4@gmail.com" },
            { icon: Phone, label: "Phone", value: "+91 8454820655" },
            { icon: MapPin, label: "Base", value: "Mumbai, India" },
          ].map((c) => (
            <div key={c.label} className="panel p-5">
              <c.icon className="h-4 w-4 text-primary" />
              <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                {c.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{c.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Contact details above are placeholders for the prototype — share the real ones and they will
          be swapped in.
        </p>

        <div className="mt-10 panel bg-surface p-6 text-center">
          <p className="text-lg font-bold text-foreground">Connect resources. Create opportunities.</p>
          <Button asChild className="mt-5">
            <Link to="/search">Start with ResourceX</Link>
          </Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
