import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, IndianRupee, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusPill } from "@/components/resourcex/StatusPill";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { demoStore, termsForCategory, type PaymentMethod } from "@/lib/demo-store";
import { getListing, inr } from "@/lib/resourcex-data";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/negotiation/$resourceId")({
  loader: ({ params }) => {
    const listing = getListing(params.resourceId);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Negotiation unavailable — ResourceX" }, { name: "robots", content: "noindex" }] };
    }
    const title = `Negotiate with ${loaderData.listing.provider} — ResourceX`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: "Message the provider, exchange counter-offers and accept a final price before booking.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "Transparent counter-offers between hospitality businesses." },
      ],
    };
  },
  component: Negotiation,
});

type Msg = { from: "you" | "provider"; text: string; time: string; offer?: number };

function Negotiation() {
  const { listing } = Route.useLoaderData();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("escrow");
  const [termsOk, setTermsOk] = useState(false);
  const terms = termsForCategory(listing.category);

  const [draft, setDraft] = useState("");
  const [counter, setCounter] = useState(7000);
  const [thread, setThread] = useState<Msg[]>([
    {
      from: "you",
      text: `Requesting 150 × ${listing.name} for 15 Sep, 5 PM – 11 PM. Offering ${inr(7000)}.`,
      time: "10:12",
      offer: 7000,
    },
    {
      from: "provider",
      text: "We can do it, but delivery before 3 PM adds handling. Counter-offer below.",
      time: "10:19",
      offer: 7800,
    },
  ]);

  const send = () => {
    if (!draft.trim()) return;
    setThread((t) => [...t, { from: "you", text: draft.trim(), time: "10:24" }]);
    setDraft("");
  };

  const sendCounter = () => {
    setThread((t) => [
      ...t,
      { from: "you", text: `Counter-offer: ${inr(counter)} including delivery.`, time: "10:26", offer: counter },
    ]);
    toast.success("Counter-offer sent", { description: inr(counter) + " including delivery." });
    setTimeout(() => {
      setThread((t) => [
        ...t,
        {
          from: "provider",
          text: `Agreed at ${inr(7500)} with delivery included. Accept to confirm the booking.`,
          time: "10:31",
          offer: 7500,
        },
      ]);
      setAgreed(7500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold text-foreground sm:text-3xl">
              {listing.provider}
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              {listing.name} · 150 units · 15 Sep 2026, 5 PM – 11 PM
            </p>
          </div>
          <StatusPill status={agreed ? "Accepted" : "Negotiating"} className="shrink-0" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="panel flex min-h-[440px] flex-col p-5">
            <div className="flex-1 space-y-4">
              {thread.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex", m.from === "you" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                      m.from === "you"
                        ? "bg-primary/12 text-foreground border border-primary/30"
                        : "bg-secondary text-muted-foreground border border-border",
                    )}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {m.from === "you" ? "You" : listing.provider} · {m.time}
                    </p>
                    <p className="mt-1.5">{m.text}</p>
                    {m.offer && (
                      <p className="mt-2 flex items-center gap-1 text-sm font-extrabold text-primary tabular-nums">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {m.offer.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Write a message…"
                maxLength={400}
              />
              <Button onClick={send} className="shrink-0">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>

          <aside className="panel h-fit p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Price negotiation</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Listed total{" "}
              <span className="font-bold text-foreground">{inr(listing.totalPrice)}</span>
            </p>
            <div className="mt-4">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Your counter-offer (₹)
              </label>
              <Input
                className="mt-2"
                type="number"
                step={250}
                value={counter}
                onChange={(e) => setCounter(Number(e.target.value))}
              />
            </div>
            <Button className="mt-3 w-full" onClick={sendCounter}>
              Send counter-offer
            </Button>

            {agreed && (
              <div className="mt-5 space-y-5">
                <div className="rounded-xl border border-primary/30 bg-primary/8 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-primary">
                    <CheckCircle2 className="h-4 w-4" /> Agreed at {inr(agreed)}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-foreground">Payment</h2>
                  <RadioGroup
                    className="mt-3 gap-2"
                    value={payment}
                    onValueChange={(v) => setPayment(v as PaymentMethod)}
                  >
                    {(
                      [
                        ["escrow", "Pay via ResourceX Escrow"],
                        ["offline", "Settle Offline Between Businesses"],
                      ] as const
                    ).map(([value, label]) => (
                      <Label
                        key={value}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-xs font-semibold transition-colors",
                          payment === value
                            ? "border-primary/50 bg-primary/8 text-foreground"
                            : "border-border bg-surface text-muted-foreground hover:border-primary/30",
                        )}
                      >
                        <RadioGroupItem value={value} className="shrink-0" />
                        <span className="min-w-0">{label}</span>
                      </Label>
                    ))}
                  </RadioGroup>

                  {payment === "escrow" ? (
                    <div className="mt-3 rounded-xl border border-primary/30 bg-surface p-4">
                      <p className="flex items-center gap-2 text-xs font-bold text-primary">
                        <ShieldCheck className="h-4 w-4" /> ResourceX Escrow
                      </p>
                      <dl className="mt-3 space-y-2.5 text-xs">
                        <div>
                          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Amount held
                          </dt>
                          <dd className="mt-0.5 text-base font-extrabold text-foreground tabular-nums">
                            {inr(agreed)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Released to provider
                          </dt>
                          <dd className="mt-0.5 text-muted-foreground">
                            After delivery is confirmed by both parties
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Status
                          </dt>
                          <dd className="mt-1">
                            <StatusPill status="Held in Escrow" />
                          </dd>
                        </div>
                      </dl>
                    </div>
                  ) : (
                    <p className="mt-3 rounded-xl border border-border bg-surface p-4 text-xs text-muted-foreground">
                      Settled offline between businesses.
                    </p>
                  )}
                  <p className="mt-2 text-[10px] text-muted-foreground/80">
                    Prototype escrow flow — money movement is simulated for the demo.
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-foreground">Booking Terms</h2>
                  <ul className="mt-3 space-y-2 rounded-xl border border-border bg-surface p-4 text-[11px] leading-relaxed text-muted-foreground">
                    {terms.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span className="min-w-0">{t}</span>
                      </li>
                    ))}
                  </ul>
                  <Label className="mt-3 flex cursor-pointer items-start gap-3 text-xs font-semibold text-foreground">
                    <Checkbox
                      checked={termsOk}
                      onCheckedChange={(v) => setTermsOk(v === true)}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="min-w-0">I agree to the rental terms for this booking.</span>
                  </Label>
                </div>

                <Button
                  className="w-full"
                  disabled={!termsOk}
                  onClick={() => {
                    demoStore.set({
                      paymentMethod: payment,
                      escrowAmount: agreed,
                      termsAccepted: true,
                      escrowReleased: false,
                    });
                    demoStore.recordBooking({
                      resource: listing.name,
                      amount: agreed,
                      utilizationBoost: 8,
                    });
                    navigate({ to: "/booking/$resourceId", params: { resourceId: listing.id } });
                  }}
                >
                  Confirm booking
                </Button>
                {!termsOk && (
                  <p className="text-center text-[11px] text-muted-foreground">
                    Agree to the rental terms to enable confirmation.
                  </p>
                )}
              </div>
            )}


            <Link
              to="/resource/$resourceId"
              params={{ resourceId: listing.id }}
              className="mt-5 block text-xs text-muted-foreground hover:text-primary"
            >
              View resource details
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
