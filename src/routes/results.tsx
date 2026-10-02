import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { GoogleMapPanel } from "@/components/resourcex/GoogleMapPanel";
import { ResourceCard } from "@/components/resourcex/ResourceCard";
import { FulfillmentSummary } from "@/components/resourcex/FulfillmentSummary";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildFulfillmentPlan,
  buildRequirementGroups,
  categories,
  inr,
  listings,
  type RequestedRequirement,
} from "@/lib/resourcex-data";

type SearchParams = {
  resources?: string;
  resource?: string;
  quantity?: number;
  location?: string;
  budget?: number;
  distance?: number;
  date?: string;
};

export const Route = createFileRoute("/results")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    resources:
      typeof search["resources"] === "string" ? search["resources"] : "[]",
    resource:
      typeof search["resource"] === "string" ? search["resource"] : "Banquet chairs",
    quantity: Number(search["quantity"]) || 150,
    location:
      typeof search["location"] === "string" ? search["location"] : "City Centre, Mumbai",
    budget: Number(search["budget"]) || 10000,
    distance: Number(search["distance"]) || 10,
    date: typeof search["date"] === "string" ? search["date"] : "2026-09-15",
  }),
  head: () => ({
    meta: [
      { title: "Search Results — Nearby Hospitality Resources | ResourceX" },
      {
        name: "description",
        content:
          "Compare ranked hospitality resources by match score, price, distance, availability and rating on a live map.",
      },
      { property: "og:title", content: "Search Results — ResourceX" },
      {
        property: "og:description",
        content: "Ranked providers with distance, price and availability on a dark-themed map.",
      },
    ],
  }),
  component: Results,
});

const sortOptions = ["Best Match", "Closest", "Lowest Price", "Highest Rated"] as const;

function Results() {
  const params = Route.useSearch();
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Best Match");
  const [activeId, setActiveId] = useState<string | null>(listings[0]!.id);
  const [maxDistance, setMaxDistance] = useState(params.distance ?? 10);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minRating, setMinRating] = useState(4);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const requestedRequirements = useMemo<RequestedRequirement[]>(() => {
    let requirements: RequestedRequirement[] = [];

    if (params.resources) {
      try {
        const parsed = JSON.parse(params.resources);
        if (Array.isArray(parsed)) {
          requirements = parsed
            .map((item) => ({
              resource:
                typeof item?.resource === "string" ? item.resource.toLowerCase().trim() : "",
              quantity: Number(item?.quantity) || 0,
            }))
            .filter((item) => item.resource);
        }
      } catch {
        requirements = [];
      }
    }

    if (requirements.length === 0 && params.resource) {
      requirements = [
        {
          resource: params.resource.toLowerCase().trim(),
          quantity: Number(params.quantity) || 0,
        },
      ];
    }

    return requirements;
  }, [params.resources, params.resource, params.quantity]);

  const requirementGroups = useMemo(
    () =>
      buildRequirementGroups(
        requestedRequirements,
        { maxDistance, maxPrice, minRating, deliveryOnly, selectedCats },
        sort,
      ),
    [requestedRequirements, sort, maxDistance, maxPrice, minRating, deliveryOnly, selectedCats],
  );

  const fulfillmentPlan = useMemo(
    () => buildFulfillmentPlan(requirementGroups),
    [requirementGroups],
  );

  const allMatchedListings = useMemo(() => {
    const seen = new Set<string>();
    const combined: (typeof requirementGroups)[number]["matches"] = [];
    requirementGroups.forEach((group) => {
      group.matches.forEach((listing) => {
        if (!seen.has(listing.id)) {
          seen.add(listing.id);
          combined.push(listing);
        }
      });
    });
    return combined;
  }, [requirementGroups]);

  const totalProviders = useMemo(
    () => new Set(allMatchedListings.map((l) => l.provider)).size,
    [allMatchedListings],
  );

  const filters = (
    <div className="space-y-6">
      <div>
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Category</Label>
        <div className="mt-3 space-y-2">
          {categories.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={selectedCats.includes(c)}
                onCheckedChange={(v) =>
                  setSelectedCats((prev) => (v ? [...prev, c] : prev.filter((x) => x !== c)))
                }
              />
              <span className="min-w-0 truncate">{c}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-xs">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Distance</Label>
          <span className="font-semibold text-primary">Within {maxDistance} km</span>
        </div>
        <Slider className="mt-3" min={1} max={20} value={[maxDistance]} onValueChange={([v]) => setMaxDistance(v!)} />
      </div>
      <div>
        <div className="flex items-center justify-between text-xs">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Max price</Label>
          <span className="font-semibold text-primary">{inr(maxPrice)}</span>
        </div>
        <Slider className="mt-3" min={2000} max={80000} step={500} value={[maxPrice]} onValueChange={([v]) => setMaxPrice(v!)} />
      </div>
      <div>
        <div className="flex items-center justify-between text-xs">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Min rating</Label>
          <span className="font-semibold text-primary">{minRating.toFixed(1)} ★</span>
        </div>
        <Slider className="mt-3" min={3} max={5} step={0.1} value={[minRating]} onValueChange={([v]) => setMinRating(v!)} />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Logistics</Label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={deliveryOnly} onCheckedChange={(v) => setDeliveryOnly(Boolean(v))} />
          Delivery available
        </label>
      </div>
    </div>
  );

  const searchSummary = (() => {
    if (!params.resources) {
      return `${params.quantity} × ${params.resource}`;
    }

    try {
      const requirements = JSON.parse(params.resources) as Array<{
        resource?: string;
        quantity?: string | number;
      }>;

      if (requirements.length === 0) {
        return `${params.quantity} × ${params.resource}`;
      }

      return requirements
        .map((requirement) => `${requirement.quantity ?? ""} × ${requirement.resource ?? ""}`)
        .join(" • ");
    } catch {
      return `${params.quantity} × ${params.resource}`;
    }
  })();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="border-b border-border bg-surface/60">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{searchSummary}</p>
            <p className="truncate text-xs text-muted-foreground">
              {params.location} · within {params.distance} km · under {inr(params.budget ?? 10000)} ·{" "}
              {totalProviders} providers
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen((v) => !v)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/search">Edit search</Link>
            </Button>
          </div>
        </div>
        {filtersOpen && <div className="border-t border-border px-4 py-5 lg:hidden">{filters}</div>}
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)_400px]">
        <aside className="hidden lg:block">
          <div className="panel sticky top-24 p-5">{filters}</div>
        </aside>

        <div className="min-w-0 space-y-8">
          {fulfillmentPlan && requirementGroups.length > 1 && (
            <FulfillmentSummary plan={fulfillmentPlan} />
          )}

          {requirementGroups.map((group) => (
            <div
              key={`${group.requirement.resource}-${group.requirement.quantity}`}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  {group.requirement.quantity} × {group.requirement.resource}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {group.matches.length} provider{group.matches.length === 1 ? "" : "s"} can fulfill
                  this
                </span>
              </div>

              {group.matches.length === 0 && (
                <div className="panel p-6 text-center text-sm text-muted-foreground">
                  No providers currently have enough {group.requirement.resource} for this request.
                  Try widening the distance or budget filters.
                </div>
              )}

              {group.matches.map((listing) => (
                <ResourceCard
                  key={listing.id}
                  listing={listing}
                  requestedQuantity={listing.requestedQuantity}
                  active={listing.id === activeId}
                  onHighlight={setActiveId}
                />
              ))}
            </div>
          ))}

          {requirementGroups.length === 0 && (
            <div className="panel p-10 text-center text-sm text-muted-foreground">
              No resources match these filters. Widen the distance or budget range.
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <GoogleMapPanel
            listings={allMatchedListings}
            activeId={activeId}
            onSelect={setActiveId}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}