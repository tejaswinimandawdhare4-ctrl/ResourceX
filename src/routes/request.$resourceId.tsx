import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getListing, inr } from "@/lib/resourcex-data";

export const Route = createFileRoute("/request/$resourceId")({
  validateSearch: (search: Record<string, unknown>) => ({
    quantity: Number(search["quantity"]) || 150,
  }),
  loader: ({ params }) => {
    const listing = getListing(params.resourceId);
    if (!listing) throw notFound();
    return { listing };
  },
  
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Request unavailable — ResourceX" }, { name: "robots", content: "noindex" }] };
    }
    const title = `Request ${loaderData.listing.name} — ResourceX`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Send a booking request to ${loaderData.listing.provider} with your quantity, date, time window and offer.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Send a structured resource request with quantity, timing and price offer.",
        },
      ],
    };
  },
  component: RequestPage,         
}); 

function RequestPage() {
  const { listing } = Route.useLoaderData();
  const { quantity: requestedQty } = Route.useSearch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(requestedQty);
  const [offer, setOffer] = useState(listing.unitPrice * requestedQty);
  const [date, setDate] = useState("2026-09-15");
  const [start, setStart] = useState("17:00");
  const [end, setEnd] = useState("23:00");
  const [notes, setNotes] = useState(
    `Setup for ${requestedQty} guests. Need ${listing.name.toLowerCase()} delivered by 3 PM for setup.`,
  );
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setQuantity(requestedQty);
    setOffer(listing.unitPrice * requestedQty);
    setDate("2026-09-15");
    setStart("17:00");
    setEnd("23:00");
    setNotes(
      `Setup for ${requestedQty} guests. Need ${listing.name.toLowerCase()} delivered by 3 PM for setup.`,
    );
    setSent(false);
  }, [listing.id, requestedQty]);
  

  // ...rest of the file stays exactly the same

  const submit = () => {
    setSent(true);
    toast.success("Request sent to " + listing.provider, {
      description: "You'll be notified when the provider responds.",
    });
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-6 text-3xl font-extrabold text-foreground">Request sent</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {listing.provider} received your request for {quantity} × {listing.name} on {date}, and
            typically responds within 30 minutes.
          </p>
          <div className="mt-6 panel p-5 text-left text-sm">
            {(
              [
                ["Request ID", "RQ-2042"],
                ["Resource", listing.name],
                ["Quantity", `${quantity} units`],
                ["Window", `${start} – ${end}`],
                ["Your offer", inr(offer)],
                ["Status", "Pending provider response"],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="min-w-0 truncate font-semibold text-foreground">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button onClick={() => navigate({ to: "/negotiation/$resourceId", params: { resourceId: listing.id } })}>
              Open negotiation
            </Button>
            <Button asChild variant="outline">
              <Link to="/search">Keep browsing</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          to="/resource/$resourceId"
          params={{ resourceId: listing.id }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to resource
        </Link>
        <h1 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">Request resource</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {listing.name} from {listing.provider} · {listing.area}, {listing.city}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="panel space-y-5 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Quantity needed</Label>
                <Input
                  className="mt-2"
                  type="number"
                  min={1}
                  max={listing.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {listing.quantity} units available
                </p>
              </div>
              <div>
                <Label>Date</Label>
                <Input className="mt-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <Label>Start time</Label>
                <Input className="mt-2" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <Label>End time</Label>
                <Input className="mt-2" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label>Your price offer (₹)</Label>
                <Input
                  className="mt-2"
                  type="number"
                  step={250}
                  value={offer}
                  onChange={(e) => setOffer(Number(e.target.value))}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Listed total: {inr(listing.totalPrice)} · providers can counter-offer.
                </p>
              </div>
            </div>
            <div>
              <Label>Notes for the provider</Label>
              <Textarea
                className="mt-2 resize-none"
                rows={4}
                maxLength={600}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button size="lg" className="w-full" onClick={submit}>
              Send request
            </Button>
          </div>

          <aside className="panel h-fit p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Summary</p>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Unit price" value={inr(listing.unitPrice)} />
              <Row label="Quantity" value={`${quantity} units`} />
              <Row label="Listed total" value={inr(listing.unitPrice * quantity)} />
              <Row label="Your offer" value={inr(offer)} />
              <Row label="Delivery" value={listing.delivery ? "Available" : "Pickup only"} />
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
              Sending a request does not confirm a booking. The provider reviews availability first,
              so overlapping reservations are prevented.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  );
}
