import { Link } from "@tanstack/react-router";
import { PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { computeListingPrice, inr, type FulfillmentPlan } from "@/lib/resourcex-data";

export function FulfillmentSummary({ plan }: { plan: FulfillmentPlan }) {
  const providerCount = new Set(plan.items.map((item) => item.listing.provider)).size;

  return (
    <div className="panel border-primary/30 bg-primary/5 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <PackageCheck className="h-4 w-4 text-primary" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          Fulfillment plan
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        The best way to fulfill your entire request across{" "}
        {providerCount === 1 ? "one provider" : `${providerCount} providers`}.
      </p>

      <div className="mt-4 divide-y divide-border rounded-lg border border-border">
        {plan.items.map((item) => (
          <div
            key={`${item.listing.id}-${item.requirement.resource}`}
            className="flex items-center justify-between gap-3 p-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{item.listing.provider}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.requirement.quantity} × {item.requirement.resource}
              </p>
            </div>
            <div className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
              {inr(computeListingPrice(item.listing, item.listing.requestedQuantity))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Estimated total
        </span>
        <span className="text-lg font-extrabold text-foreground tabular-nums">{inr(plan.total)}</span>
      </div>

      {/* Prototype note: this links to the first provider's request page since
         there's no combined multi-provider request endpoint yet. Wire this to
         a real "request the whole plan" flow when the backend supports it. */}
      <Button className="mt-4 w-full sm:w-auto" size="lg" asChild>
        <Link to="/request/$resourceId" params={{ resourceId: plan.items[0]!.listing.id }}>
          Request this fulfillment plan
        </Link>
      </Button>
    </div>
  );
}