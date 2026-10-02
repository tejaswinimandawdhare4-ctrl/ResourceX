import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, ClipboardList, Search } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StatusPill } from "@/components/resourcex/StatusPill";
import { Button } from "@/components/ui/button";
import { useDemoState } from "@/lib/demo-store";
import { bookings, featuredListing, incomingRequests, inr } from "@/lib/resourcex-data";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "My Requests & Bookings — ResourceX" },
      {
        name: "description",
        content:
          "Track every resource request you've sent, negotiations in progress, and confirmed bookings in one place.",
      },
      { property: "og:title", content: "My Requests & Bookings — ResourceX" },
      {
        property: "og:description",
        content: "Your requests, negotiations and bookings across the ResourceX marketplace.",
      },
    ],
  }),
  component: Activity,
});

function Activity() {
  const state = useDemoState();
  const liveBookings = state.ledger;

  const escrowLabel = !state.escrowReleased
    ? "Held in Escrow"
    : "Released";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              My Requests &amp; Bookings
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything you've requested and booked across the marketplace, in one place.
            </p>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/search">
              <Search className="h-4 w-4" /> New request
            </Link>
          </Button>
        </div>

        {/* Requests */}
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Requests you've sent</h2>
          </div>
          <div className="mt-4 space-y-3">
            {incomingRequests.map((r) => (
              <div key={r.id} className="panel p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{r.id}</p>
                    <h3 className="mt-1 truncate text-base font-bold text-foreground">
                      {r.quantity} × {r.resource}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {r.business} · {r.date}, {r.time}
                    </p>
                  </div>
                  <StatusPill status={r.status} className="shrink-0" />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Your offer: <span className="font-semibold text-foreground tabular-nums">{inr(r.budget)}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {r.status === "Negotiating" || r.status === "Accepted" ? (
                      <Button asChild size="sm">
                        <Link to="/negotiation/$resourceId" params={{ resourceId: featuredListing.id }}>
                          Open negotiation <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast.info(`${r.id} · ${r.resource}`, {
                            description: `${r.business} · ${r.date}, ${r.time} · ${inr(r.budget)} · ${r.status}`,
                          })
                        }
                      >
                        Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bookings */}
        <section className="mt-12">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Your bookings</h2>
          </div>
          <div className="mt-4 space-y-3">
            {liveBookings.map((l, i) => (
              <div key={`live-${l.resource}-${l.amount}`} className="panel border-primary/40 p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      BK-{5200 + i} · Booked this session
                    </p>
                    <h3 className="mt-1 truncate text-base font-bold text-foreground">{l.resource}</h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {state.paymentMethod === "escrow"
                        ? `Payment: ${inr(l.amount)} held in ResourceX Escrow`
                        : "Payment: settled offline between businesses"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <StatusPill status="Confirmed" />
                    {state.paymentMethod === "escrow" && <StatusPill status={escrowLabel} />}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Agreed amount:{" "}
                    <span className="font-semibold text-foreground tabular-nums">{inr(l.amount)}</span>
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/booking/$resourceId" params={{ resourceId: featuredListing.id }}>
                      View confirmation
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            {bookings.map((b) => (
              <div key={b.id} className="panel p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{b.id}</p>
                    <h3 className="mt-1 truncate text-base font-bold text-foreground">{b.resource}</h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {b.business} · {b.date}, {b.time}
                    </p>
                  </div>
                  <StatusPill status={b.status} className="shrink-0" />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Amount: <span className="font-semibold text-foreground tabular-nums">{inr(b.amount)}</span>
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.info(`${b.id} · ${b.resource}`, {
                        description: `${b.business} · ${b.date}, ${b.time} · ${inr(b.amount)} · ${b.status}`,
                      })
                    }
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
