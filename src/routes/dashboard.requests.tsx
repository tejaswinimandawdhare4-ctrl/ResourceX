import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatusPill } from "@/components/resourcex/StatusPill";
import { Button } from "@/components/ui/button";
import { featuredListing, incomingRequests, inr, type RequestRecord } from "@/lib/resourcex-data";

export const Route = createFileRoute("/dashboard/requests")({
  head: () => ({
    meta: [
      { title: "Incoming Requests — ResourceX Provider" },
      {
        name: "description",
        content:
          "Review incoming resource requests, accept, reject or counter-offer with full requirement details.",
      },
      { property: "og:title", content: "Incoming Requests — ResourceX Provider" },
      { property: "og:description", content: "Accept, reject or negotiate every incoming request." },
    ],
  }),
  component: Requests,
});

function Requests() {
  const [rows, setRows] = useState<RequestRecord[]>(incomingRequests);

  const act = (id: string, status: RequestRecord["status"]) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(`Request ${id} ${status.toLowerCase()}`);
  };

  return (
    <DashboardShell
      title="Requests"
      subtitle={`${rows.filter((r) => r.status === "Pending" || r.status === "Negotiating").length} requests awaiting your response`}
    >
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.id} className="panel p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{r.id}</p>
                <h2 className="mt-1 truncate text-base font-bold text-foreground">{r.business}</h2>
                <p className="truncate text-sm text-muted-foreground">
                  {r.quantity} × {r.resource}
                </p>
              </div>
              <StatusPill status={r.status} className="shrink-0" />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              {(
                [
                  ["Date", r.date],
                  ["Time", r.time],
                  ["Offered", inr(r.budget)],
                  ["Quantity", `${r.quantity} units`],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 truncate font-semibold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => act(r.id, "Accepted")}>
                Accept
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/negotiation/$resourceId" params={{ resourceId: featuredListing.id }}>
                  Counter-offer
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={() => act(r.id, "Rejected")}>
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
