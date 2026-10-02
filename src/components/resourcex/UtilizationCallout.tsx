import { Link } from "@tanstack/react-router";
import { TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { liveTotals, useDemoState } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

export function UtilizationCallout({ className }: { className?: string }) {
  const state = useDemoState();
  const { lowUtilization } = liveTotals(state);
  if (lowUtilization.length === 0) return null;

  return (
    <div
      className={cn(
        "panel grid gap-4 border-primary/40 bg-primary/8 p-5 shadow-[0_0_40px_-18px_var(--color-primary)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
          <TrendingDown className="h-4 w-4 shrink-0" />
          {lowUtilization.length} of your resources are running below 50% utilisation
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {lowUtilization.map((r) => r.resource).join(", ")} — list them at a lower price to boost
          bookings and fill idle windows.
        </p>
      </div>
      <Button asChild className="shrink-0">
        <Link to="/dashboard/resources">Review low-utilisation resources</Link>
      </Button>
    </div>
  );
}
