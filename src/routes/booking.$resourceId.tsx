import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Download, MapPin, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { StatusPill } from "@/components/resourcex/StatusPill";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { demoStore, useDemoState } from "@/lib/demo-store";
import { getListing, inr } from "@/lib/resourcex-data";


export const Route = createFileRoute("/booking/$resourceId")({
  loader: ({ params }) => {
    const listing = getListing(params.resourceId);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Booking unavailable — ResourceX" }, { name: "robots", content: "noindex" }] };
    }
    const title = `Booking confirmed — ${loaderData.listing.name} | ResourceX`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: "Booking confirmation with agreed price, delivery window and provider contact details.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "Conflict-free confirmed booking on ResourceX." },
      ],
    };
  },
  component: BookingConfirmed,
});

function BookingConfirmed() {
  const { listing } = Route.useLoaderData();
  const state = useDemoState();
  const escrow = state.paymentMethod === "escrow";
  const amount = state.escrowAmount || 7500;


  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-6 text-3xl font-extrabold text-foreground sm:text-4xl">Booking confirmed</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Both businesses have been notified. The provider's calendar is now blocked for this window,
            so no other booking can overlap.
          </p>
        </div>

        <div className="mt-8 panel p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Booking reference
              </p>
              <p className="truncate text-xl font-extrabold text-foreground">BK-2026-0912</p>
            </div>
            <StatusPill status="Confirmed" className="shrink-0" />
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {(
              [
                ["Resource", `150 × ${listing.name}`],
                ["Provider", listing.provider],
                ["Date", "15 September 2026"],
                ["Time window", "5:00 PM – 11:00 PM"],
                ["Agreed price", inr(amount)],
                [
                  "Payment",
                  escrow
                    ? state.escrowReleased
                      ? "Released from ResourceX Escrow"
                      : "Held in ResourceX Escrow"
                    : "Settled offline between businesses",
                ],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="min-w-0 rounded-xl border border-border bg-surface px-4 py-3">
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                <dd className="mt-1 truncate text-sm font-bold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>

          {escrow && (
            <div className="mt-6 rounded-xl border border-primary/30 bg-primary/8 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <p className="flex min-w-0 items-center gap-2 text-sm font-bold text-primary">
                  <ShieldCheck className="h-4 w-4 shrink-0" /> ResourceX Escrow
                </p>
                <StatusPill
                  status={state.escrowReleased ? "Released" : "Held in Escrow"}
                  className="shrink-0"
                />
              </div>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Amount held
                  </dt>
                  <dd className="mt-1 text-lg font-extrabold text-foreground tabular-nums">
                    {inr(amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Released to provider
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    After delivery is confirmed by both parties
                  </dd>
                </div>
              </dl>
              {!state.escrowReleased && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    demoStore.set({ escrowReleased: true });
                    toast.success("Delivery confirmed", {
                      description: `${inr(amount)} released to ${listing.provider}.`,
                    });
                  }}
                >
                  Confirm delivery & release funds
                </Button>
              )}
              <p className="mt-3 text-[10px] text-muted-foreground/80">
                Prototype escrow flow — money movement is simulated for the demo.
              </p>
            </div>
          )}


          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0 text-primary" />
              Delivery scheduled for 3:00 PM, pickup next morning by 9:00 AM.
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              Pickup point: {listing.area}, {listing.city} ({listing.distanceKm} km away)
            </p>
            <p className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 shrink-0 text-primary" />
              Added to both availability calendars automatically.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="h-4 w-4" /> Save confirmation
            </Button>
            <Button asChild variant="ghost">
              <Link to="/dashboard/bookings">View in dashboard</Link>
            </Button>
            <Button asChild>
              <Link to="/search">Find more resources</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 panel p-6">
          <h2 className="text-sm font-bold text-foreground">What happens next</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            {[
              "Provider prepares the resource and confirms dispatch.",
              "Resource is delivered or collected within the agreed window.",
              "After the event, both sides mark fulfilment complete.",
              "Each business rates the other, building marketplace trust.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
                <span className="min-w-0">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
