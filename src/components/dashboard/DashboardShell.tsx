import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,

  CalendarRange,
  Inbox,
  LayoutDashboard,
  Package,
  PlusCircle,
  Search,
  Ticket,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

const items = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "My Resources", to: "/dashboard/resources", icon: Package },
  { label: "Add Resource", to: "/dashboard/add-resource", icon: PlusCircle },
  { label: "Availability", to: "/dashboard/availability", icon: CalendarRange },
  { label: "Requests", to: "/dashboard/requests", icon: Inbox },
  { label: "Bookings", to: "/dashboard/bookings", icon: Ticket },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  { label: "Notifications", to: "/dashboard/notifications", icon: Bell },
  { label: "Business Profile", to: "/dashboard/profile", icon: Building2 },
  { label: "Get Verified", to: "/dashboard/verify", icon: BadgeCheck },
] as const;


export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-sidebar px-4 py-5 lg:flex">
        <Logo showTagline />
        <nav className="mt-8 grid gap-1">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/dashboard" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-primary/12 data-[status=active]:text-primary"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto panel p-4">
          <p className="text-xs font-semibold text-foreground">Looking for resources?</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Switch to seeker mode and search nearby capacity.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3 w-full">
            <Link to="/search">
              <Search className="h-3.5 w-3.5" /> Find Resources
            </Link>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 glass">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold text-foreground sm:text-xl">{title}</h1>
              {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          </div>
        </header>
        <main className="min-w-0 px-4 py-6 sm:px-6">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-border bg-sidebar lg:hidden">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/dashboard" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground data-[status=active]:text-primary"
          >
            <item.icon className="h-4 w-4" />
            <span className="truncate px-1">{item.label.split(" ").at(-1)}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
