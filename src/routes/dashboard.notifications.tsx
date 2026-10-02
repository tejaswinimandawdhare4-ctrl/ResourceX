import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { notifications } from "@/lib/resourcex-data";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — ResourceX Provider" },
      {
        name: "description",
        content:
          "Real-time alerts for new requests, counter-offers, confirmed bookings and fulfilment reminders.",
      },
      { property: "og:title", content: "Notifications — ResourceX Provider" },
      { property: "og:description", content: "Never miss a request, offer or booking update." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  return (
    <DashboardShell title="Notifications" subtitle="Latest activity across your resources">
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="panel grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 p-5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10">
              <Bell className="h-4 w-4 text-primary" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{n.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{n.kind}</p>
              <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                {n.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
