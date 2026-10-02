import { createFileRoute } from "@tanstack/react-router";
import { AvailabilityCalendar } from "@/components/resourcex/AvailabilityCalendar";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatusPill } from "@/components/resourcex/StatusPill";
import { bookings, inr } from "@/lib/resourcex-data";

export const Route = createFileRoute("/dashboard/availability")({
  head: () => ({
    meta: [
      { title: "Availability Calendar — ResourceX Provider" },
      {
        name: "description",
        content:
          "Block dates, review reserved windows and keep bookings conflict-free across all listed resources.",
      },
      { property: "og:title", content: "Availability Calendar — ResourceX Provider" },
      { property: "og:description", content: "Conflict-free availability management for shared resources." },
    ],
  }),
  component: Availability,
});

function Availability() {
  return (
    <DashboardShell
      title="Availability"
      subtitle="Reserved windows are blocked automatically when a booking is confirmed"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AvailabilityCalendar />

        <div className="panel h-fit p-5">
          <h2 className="text-sm font-bold text-foreground">Reserved windows</h2>
          <ul className="mt-4 space-y-3">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{b.resource}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.date} · {b.time} · {inr(b.amount)}
                  </p>
                </div>
                <StatusPill status={b.status} className="shrink-0" />
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
            Overlapping requests for a reserved window are rejected before they reach you, which
            prevents double booking.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
