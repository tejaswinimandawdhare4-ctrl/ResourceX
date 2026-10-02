import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  categories,
  cities,
  listings,
  parseRequirement,
  parseRequirements,
  type ParsedRequirement,
} from "@/lib/resourcex-data";
import { ResourceCard } from "@/components/resourcex/ResourceCard";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Hospitality Resources — ResourceX" },
      {
        name: "description",
        content:
          "Describe what you need in plain language or set resource, quantity, location, date, budget and distance to find nearby hospitality resources.",
      },
      { property: "og:title", content: "Search Hospitality Resources — ResourceX" },
      {
        property: "og:description",
        content: "AI-assisted search for banquet chairs, tables, parking, AV gear and more.",
      },
    ],
  }),
  component: SearchPage,
});

const EXAMPLE = "I need 150 chairs near the city centre tomorrow evening under ₹10,000.";

function SearchPage() {
  const navigate = useNavigate();
  const [nl, setNl] = useState("");
  const [parsed, setParsed] = useState<ParsedRequirement[] | null>(null);
  const [parsing, setParsing] = useState(false);

  const [form, setForm] = useState({
    resource: "Banquet chairs",
    quantity: "150",
    location: "City Centre, Mumbai",
    date: "2026-09-15",
    time: "5:00 PM – 11:00 PM",
    budget: "10000",
    distance: "10",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  
  const interpret = () => {
  const text = nl.trim() || EXAMPLE;
  setParsing(true);

  setTimeout(() => {
    const results = parseRequirements(text);

    setParsed(results);

    if (results.length > 0) {
      const first = results[0]!;

      setForm((f) => ({
        ...f,
        resource: first.resource,
        quantity: first.quantity,
        location: first.location,
        budget: first.budget.replace(/[₹,]/g, ""),
      }));
    }

    setParsing(false);
  }, 700);
};

  const runSearch = () => {
  const requirements = parsed ?? [
    {
      resource: form.resource,
      quantity: form.quantity,
      location: form.location,
      date: form.date,
      time: form.time,
      budget: `₹${form.budget}`,
    },
  ];

  navigate({
    to: "/results",
    search: {
      resources: JSON.stringify(requirements),
      location: form.location,
      budget: Number(form.budget) || 10000,
      distance: Number(form.distance) || 10,
      date: form.date,
    },
  });
};

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-backdrop opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl">What do you need?</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Set your requirement below, or describe it in your own words and let ResourceX structure it
            for you.
          </p>

          {/* AI-assisted search */}
          <div className="mt-8 panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                AI-assisted search
              </span>
            </div>
            <Textarea
              value={nl}
              onChange={(e) => setNl(e.target.value)}
              placeholder={EXAMPLE}
              rows={3}
              className="mt-4 resize-none bg-surface text-sm"
              aria-label="Describe what you need"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button onClick={interpret} disabled={parsing}>
                <Wand2 className="h-4 w-4" />
                {parsing ? "Interpreting…" : "Interpret requirement"}
              </Button>
              <Button variant="ghost" onClick={() => setNl(EXAMPLE)}>
                Use example
              </Button>
            </div>

            {parsed && (
              <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  Interpreted parameters
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {parsed.map((requirement, index) => (
  <div
    key={`${requirement.resource}-${index}`}
    className="col-span-full rounded-lg border border-border p-3"
  >
    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
      Requirement {index + 1}
    </p>

    <div className="mt-2 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {(
        [
          ["Resource", requirement.resource],
          ["Quantity", requirement.quantity],
          ["Location", requirement.location],
          ["Date", requirement.date],
          ["Time", requirement.time],
          ["Budget", requirement.budget],
        ] as const
      ).map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {k}
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {v}
          </dd>
        </div>
      ))}
    </div>
  </div>
))}
                </dl>
                <Button className="mt-4" onClick={runSearch}>
                  Search with these requirements
                </Button>
              </div>
            )}
          </div>

          {/* Structured search */}
          <div className="mt-6 panel p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Resource">
                <Input value={form.resource} onChange={set("resource")} list="rx-resources" />
                <datalist id="rx-resources">
                  {listings.map((l) => (
                    <option key={l.id} value={l.name} />
                  ))}
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Quantity">
                <Input type="number" min={1} value={form.quantity} onChange={set("quantity")} />
              </Field>
              <Field label="Location">
                <Input value={form.location} onChange={set("location")} list="rx-cities" placeholder="Search location" />
                <datalist id="rx-cities">
                  {cities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Date">
                <Input type="date" value={form.date} onChange={set("date")} />
              </Field>
              <Field label="Time">
                <Input value={form.time} onChange={set("time")} />
              </Field>
              <Field label="Budget (₹)">
                <Input type="number" min={0} step={500} value={form.budget} onChange={set("budget")} />
              </Field>
              <Field label="Distance (km)">
                <Input type="number" min={1} value={form.distance} onChange={set("distance")} />
              </Field>
              <div className="flex items-end">
                <Button className="w-full" size="lg" onClick={runSearch}>
                  <Search className="h-4 w-4" /> Find Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-extrabold text-foreground">Popular right now</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {listings.slice(0, 4).map((l) => (
            <ResourceCard key={l.id} listing={l} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
