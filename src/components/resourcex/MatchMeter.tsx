import { MATCH_WEIGHTS, matchLabel, matchScore, type MatchBreakdown } from "@/lib/resourcex-data";
import { cn } from "@/lib/utils";

export function MatchBadge({ score, className }: { score: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-bold text-primary",
        className,
      )}
    >
      {score}% MATCH
    </span>
  );
}

export function MatchMeter({
  breakdown,
  explanation,
  className,
}: {
  breakdown: MatchBreakdown;
  explanation?: string;
  className?: string;
}) {
  const total = matchScore(breakdown);

  return (
    <div className={cn("panel p-5 sm:p-6", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Smart Matching Engine
          </p>
          <p className="mt-1 text-sm font-semibold text-primary">{matchLabel(total)}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-3xl font-extrabold text-foreground sm:text-4xl">{total}%</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Match
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {MATCH_WEIGHTS.map((w) => {
          const value = breakdown[w.key];
          return (
            <div key={w.key}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="min-w-0 truncate text-muted-foreground">{w.label}</span>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">
                  {value}/{w.weight}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                  style={{ width: `${(value / w.weight) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="font-semibold text-muted-foreground">Total</span>
        <span className="font-extrabold text-primary tabular-nums">{total}%</span>
      </div>

      {explanation && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{explanation}</p>}
      <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground/70">
        Weighted scoring across availability, distance, price, quantity compatibility and rating. No
        machine-learning model is used in this prototype.
      </p>
    </div>
  );
}
