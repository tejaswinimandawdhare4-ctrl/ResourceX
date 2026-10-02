import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarRange, LineChart, Wallet } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { inr, resourcePerformance } from "@/lib/resourcex-data";
import { StatusPill } from "@/components/resourcex/StatusPill";

export const Route = createFileRoute("/for-providers")({
  head: () => ({
    meta: [
      { title: "For Providers — Monetise Idle Hospitality Resources | ResourceX" },
      {
        name: "description",
        content:
          "List banquet space, furniture, parking, vehicles and equipment on ResourceX, control availability and track utilisation and revenue.",
      },
      { property: "og:title", content: "For Providers — ResourceX" },
      {
        property: "og:description",
        content: "Turn unused hospitality inventory into a tracked revenue line.",
      },
    ],
  }),
  component: ForProviders,
});

function ForProviders() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              For resource providers
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
              Your idle inventory is a revenue line.
            </h1>
            <p className="mt-5 text-base text-muted-foreground">
              Publish what you already own, keep full control of availability and pricing, and accept
              only the requests that fit your operations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/dashboard/add-resource" search={{ edit: undefined }}>
                  Start Listing Resources <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">View Provider Dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Wallet, t: "Pricing control", d: "Set unit price, minimum rental period and delivery terms." },
              { icon: CalendarRange, t: "Conflict-free calendar", d: "Block dates and prevent overlapping reservations." },
              { icon: LineChart, t: "Utilisation insight", d: "See which resources earn and which sit idle." },
              { icon: BadgeCheck, t: "Verified profile", d: "Build trust with ratings from completed exchanges." },
            ].map((f) => (
              <div key={f.t} className="panel p-5">
                <f.icon className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-sm font-bold text-foreground">{f.t}</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          What performance looks like
        </h2>
        <div className="mt-6 panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Resource</th>
                  <th className="px-4 py-3 font-semibold">Bookings</th>
                  <th className="px-4 py-3 font-semibold">Utilization</th>
                  <th className="px-4 py-3 font-semibold">Revenue</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {resourcePerformance.map((r) => (
                  <tr key={r.resource} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-foreground">{r.resource}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.bookings}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${r.utilization}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold tabular-nums text-foreground">
                          {r.utilization}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums text-foreground">
                      {inr(r.revenue)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
