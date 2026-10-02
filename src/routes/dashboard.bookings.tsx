import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatusPill } from "@/components/resourcex/StatusPill";
import { Button } from "@/components/ui/button";
import { bookings, inr } from "@/lib/resourcex-data";


export const Route = createFileRoute("/dashboard/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings — ResourceX Provider" },
      {
        name: "description",
        content:
          "Track confirmed, ongoing and completed resource bookings with counterparties, timing and payouts.",
      },
      { property: "og:title", content: "Bookings — ResourceX Provider" },
      { property: "og:description", content: "Confirmed and completed exchanges in one place." },
    ],
  }),
  component: Bookings,
});

function Bookings() {
  return (
    <DashboardShell title="Bookings" subtitle="Confirmed exchanges block your availability automatically">
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-4 font-semibold">Reference</th>
              <th className="px-5 py-4 font-semibold">Resource</th>
              <th className="px-5 py-4 font-semibold">Counterparty</th>
              <th className="px-5 py-4 font-semibold">Date & time</th>
              <th className="px-5 py-4 font-semibold">Amount</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-border/60 last:border-0">
                <td className="px-5 py-4 font-semibold text-foreground">{b.id}</td>
                <td className="px-5 py-4 text-muted-foreground">{b.resource}</td>
                <td className="px-5 py-4 text-muted-foreground">{b.business}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {b.date}
                  <span className="block text-xs text-muted-foreground/70">{b.time}</span>
                </td>
                <td className="px-5 py-4 tabular-nums text-foreground">{inr(b.amount)}</td>
                <td className="px-5 py-4">
                  <StatusPill status={b.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast.info(`${b.id} · ${b.resource}`, {
                        description: `${b.business} · ${b.date}, ${b.time} · ${inr(b.amount)} · ${b.status}`,
                      })
                    }
                  >
                    Details
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
