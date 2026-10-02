import { AlertTriangle, ExternalLink, Newspaper } from "lucide-react";
import { useSocialSignals } from "@/hooks/useSocialSignals";

interface SocialSignalsPanelProps {
  city: string;
  severity?: string;
}

export function SocialSignalsPanel({ city, severity }: Readonly<SocialSignalsPanelProps>) {
  const { data, isLoading, error } = useSocialSignals(city, severity);

  if (isLoading) {
    return (
      <div className="panel p-5 text-sm text-muted-foreground">
        Fetching real-world signals for {city}…
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-5 flex items-center gap-2 text-sm text-muted-foreground">
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        Signals temporarily unavailable — please try again shortly.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="panel p-5 flex items-center gap-2 text-sm text-muted-foreground">
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        No recent news signals found for {city} right now.
      </div>
    );
  }

  return (
    <div className="panel p-5 space-y-3">
      {data.map((signal) => (
        <a
          key={signal.url}
          href={signal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3"
        >
          <Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
              {signal.title}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {signal.source} · {signal.seenDate}
            </p>
          </div>
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </a>
      ))}
    </div>
  );
}