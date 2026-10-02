import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { UtilizationCallout } from "@/components/resourcex/UtilizationCallout";
import { liveTotals, liveUtilizationSeries, useDemoState } from "@/lib/demo-store";
import {
  bookingStatusSeries,
  demandSeries,
  inr,
} from "@/lib/resourcex-data";


export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Utilisation & Demand | ResourceX" },
      {
        name: "description",
        content:
          "Utilisation trends, revenue growth, most-requested resources and booking status breakdown for your business.",
      },
      { property: "og:title", content: "Analytics — Utilisation & Demand | ResourceX" },
      { property: "og:description", content: "See which idle resources earn and which sit unused." },
    ],
  }),
  component: Analytics,
});

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--color-foreground)",
};

function Analytics() {
  const demo = useDemoState();
  const totals = liveTotals(demo);
  const series = liveUtilizationSeries(demo);
  const perf = totals.performance;
  const best = [...perf].sort((a, b) => b.utilization - a.utilization)[0]!;
  const worst = [...perf].sort((a, b) => a.utilization - b.utilization)[0]!;
  const sixMonthRevenue = series.reduce((s, r) => s + r.revenue, 0);

  return (
    <DashboardShell title="Analytics" subtitle="April – September 2026 · demo data">
      <UtilizationCallout className="mb-6" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Avg utilisation", `${totals.avgUtilization}%`],
          ["Revenue (6 mo)", inr(sixMonthRevenue)],
          ["Best performer", `${best.resource} · ${best.utilization}%`],
          ["Needs attention", `${worst.resource} · ${worst.utilization}%`],
        ].map(([k, v]) => (
          <div key={k} className="panel p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{k}</p>
            <p className="mt-2 truncate text-lg font-extrabold text-foreground">{v}</p>
          </div>
        ))}
      </div>


      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-sm font-bold text-foreground">Utilisation & bookings</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  name="Utilisation %"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-sm font-bold text-foreground">Most requested resources</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandSeries} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="resource"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  width={100}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="requests" name="Requests" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-sm font-bold text-foreground">Booking status mix</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusSeries}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="var(--color-background)"
                >
                  {bookingStatusSeries.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-sm font-bold text-foreground">Revenue by month</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => inr(Number(v))} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
