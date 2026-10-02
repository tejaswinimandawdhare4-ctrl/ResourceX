import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "How It Works", to: "/how-it-works" },
      { label: "Resources", to: "/search" },
      { label: "Smart Matching", to: "/how-it-works" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "For Providers", to: "/for-providers" },
      { label: "For Businesses", to: "/search" },
      { label: "Provider Dashboard", to: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/about" },
      { label: "Privacy", to: "/about" },
      { label: "Terms", to: "/about" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo showTagline />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Connect resources. Create opportunities.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        © 2026 ResourceX — B2B Hospitality Resource Exchange. Hackathon prototype.
      </div>
    </footer>
  );
}
