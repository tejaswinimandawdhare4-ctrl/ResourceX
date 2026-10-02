import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatusPill } from "@/components/resourcex/StatusPill";
import { UtilizationCallout } from "@/components/resourcex/UtilizationCallout";
import { Button } from "@/components/ui/button";
import { liveTotals, useDemoState } from "@/lib/demo-store";
import { inr } from "@/lib/resourcex-data";


export const Route = createFileRoute("/dashboard/resources")({
  head: () => ({
    meta: [
      { title: "My Resources — ResourceX Provider" },
      {
        name: "description",
        content: "Manage listed hospitality resources: quantity, pricing, utilisation and active status.",
      },
      { property: "og:title", content: "My Resources — ResourceX Provider" },
      { property: "og:description", content: "Edit, pause and track every listed resource." },
    ],
  }),
  component: MyResources,
});

function MyResources() {
  const demo = useDemoState();
  const { performance, lowUtilization } = liveTotals(demo);
  return (
    <DashboardShell
      title="My Resources"
      subtitle={`${performance.length} listed resources · ${lowUtilization.length} below 50% utilisation`}
      actions={
        <Button asChild>
          <Link to="/dashboard/add-resource" search={{ edit: undefined }}>
            <PlusCircle className="h-4 w-4" /> Add resource
          </Link>
        </Button>
      }
    >
      <UtilizationCallout className="mb-6" />

      <div className="panel overflow-x-auto">

        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-4 font-semibold">Resource</th>
              <th className="px-5 py-4 font-semibold">Category</th>
              <th className="px-5 py-4 font-semibold">Qty</th>
              <th className="px-5 py-4 font-semibold">Bookings</th>
              <th className="px-5 py-4 font-semibold">Utilisation</th>
              <th className="px-5 py-4 font-semibold">Revenue</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody>
            {performance.map((r) => (
              <tr key={r.resource} className="border-b border-border/60 last:border-0">
                <td className="px-5 py-4 font-semibold text-foreground">{r.resource}</td>
                <td className="px-5 py-4 text-muted-foreground">{r.category}</td>
                <td className="px-5 py-4 tabular-nums text-muted-foreground">{r.quantity}</td>
                <td className="px-5 py-4 tabular-nums text-muted-foreground">{r.bookings}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${r.utilization}%` }}
                      />
                    </div>
                    <span className="tabular-nums text-xs text-foreground">{r.utilization}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 tabular-nums text-foreground">{inr(r.revenue)}</td>
                <td className="px-5 py-4">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/dashboard/add-resource" search={{ edit: r.resource }}>
                      Edit
                    </Link>
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Low utilisation resources are surfaced first in nearby search results to help them earn.
      </p>
    </DashboardShell>
  );
}
