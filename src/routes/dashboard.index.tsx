import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, IndianRupee, Inbox, Package, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatusPill } from "@/components/resourcex/StatusPill";
import { UtilizationCallout } from "@/components/resourcex/UtilizationCallout";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { liveTotals, liveUtilizationSeries, useDemoState } from "@/lib/demo-store";
import {
  bookings,
  incomingRequests,
  inr,
  notifications,
} from "@/lib/resourcex-data";


export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Provider Dashboard — ResourceX" },
      {
        name: "description",
        content:
          "Track utilisation, revenue, incoming requests and upcoming bookings for your idle hospitality resources.",
      },
      { property: "og:title", content: "Provider Dashboard — ResourceX" },
      { property: "og:description", content: "Utilisation, revenue and request overview for providers." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const demo = useDemoState();
  const totals = liveTotals(demo);
  const series = liveUtilizationSeries(demo);
  const stats = [
    { label: "Active resources", value: "6", icon: Package, delta: "+1 this month" },
    { label: "Open requests", value: String(incomingRequests.length), icon: Inbox, delta: "3 need a reply" },
    {
      label: "Utilisation",
      value: `${totals.avgUtilization}%`,
      icon: TrendingUp,
      delta: totals.extraBookings ? `+${totals.extraBookings} booking this session` : "+4% vs Aug",
    },
    {
      label: "Revenue (Sep)",
      value: inr(totals.septRevenue),
      icon: IndianRupee,
      delta: totals.extraBookings ? "Updated with live booking" : "+13% vs Aug",
    },
  ];

  return (
    <DashboardShell
      title="Dashboard"
      subtitle="Hotel Horizon · Andheri East, Mumbai"
      actions={
        <Button asChild>
          <Link to="/dashboard/add-resource" search={{ edit: undefined }}>Add resource</Link>
        </Button>
      }
    >
      <UtilizationCallout className="mb-6" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((s) => (
          <div key={s.label} className="panel p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <p className="min-w-0 truncate text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <s.icon className="h-4 w-4 shrink-0 text-primary" />
            </div>
            <p className="mt-3 text-2xl font-extrabold text-foreground tabular-nums">{s.value}</p>
            <p className="mt-1 text-[11px] text-primary">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="panel p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="min-w-0 truncate text-sm font-bold text-foreground">
              Utilisation & revenue trend
            </h2>
            <Link
              to="/dashboard/analytics"
              className="shrink-0 text-xs text-primary hover:underline"
            >
              Full analytics
            </Link>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="rxUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "var(--color-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  name="Utilisation %"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#rxUtil)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-sm font-bold text-foreground">Notifications</h2>
          <ul className="mt-4 space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="rounded-xl border border-border bg-surface px-4 py-3">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <p className="mt-1 text-xs text-muted-foreground capitalize">{n.kind}</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  {n.time}
                </p>
              </li>
            ))}
          </ul>
          <Button asChild variant="ghost" className="mt-4 w-full">
            <Link to="/dashboard/notifications">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="panel p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="min-w-0 truncate text-sm font-bold text-foreground">Incoming requests</h2>
            <Link to="/dashboard/requests" className="shrink-0 text-xs text-primary hover:underline">
              Manage
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {incomingRequests.slice(0, 4).map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{r.business}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.quantity} × {r.resource} · {r.date} · {inr(r.budget)}
                  </p>
                </div>
                <StatusPill status={r.status} className="shrink-0" />
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="min-w-0 truncate text-sm font-bold text-foreground">Upcoming bookings</h2>
            <Link to="/dashboard/bookings" className="shrink-0 text-xs text-primary hover:underline">
              All bookings
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <li
                key={b.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{b.resource}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.business} · {b.date} · {inr(b.amount)}
                  </p>
                </div>
                <StatusPill status={b.status} className="shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}
