import { useState } from "react";
import { septemberAvailability, type DayStatus } from "@/lib/resourcex-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const legend: Array<{ status: DayStatus; label: string; cls: string }> = [
  { status: "available", label: "Available", cls: "border-primary/40 bg-primary/10 text-primary" },
  { status: "partial", label: "Partially booked", cls: "border-warning/40 bg-warning/10 text-warning" },
  { status: "booked", label: "Booked", cls: "border-primary/20 bg-secondary text-muted-foreground" },
  { status: "unavailable", label: "Unavailable", cls: "border-destructive/40 bg-destructive/10 text-destructive" },
];

const styleFor = (s: DayStatus) => legend.find((l) => l.status === s)!.cls;

export function AvailabilityCalendar({ className }: { className?: string }) {
  const [selected, setSelected] = useState<number | null>(16);
  const firstWeekday = 2; // 1 September 2026 is a Tuesday
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const pick = (day: number) => {
    const entry = septemberAvailability[day];
    if (entry?.status === "unavailable" || entry?.status === "booked") {
      toast.error(`${day} September is not available`, { description: entry.note });
      return;
    }
    setSelected(day);
    toast.success(`${day} September selected`, {
      description: entry?.note ?? "200 units available in your time window.",
    });
  };

  const selectedEntry = selected ? septemberAvailability[selected] : undefined;

  return (
    <div className={cn("panel p-5", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h3 className="min-w-0 truncate text-sm font-bold text-foreground">September 2026</h3>
        <span className="shrink-0 text-[11px] uppercase tracking-wider text-muted-foreground">
          Conflict-free booking
        </span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstWeekday }, (_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const entry = septemberAvailability[day];
          const status: DayStatus = entry?.status ?? "available";
          const blocked = status === "unavailable" || status === "booked";
          return (
            <button
              key={day}
              onClick={() => pick(day)}
              aria-label={`${day} September — ${status}`}
              className={cn(
                "aspect-square rounded-lg border text-xs font-semibold tabular-nums transition-all",
                styleFor(status),
                blocked ? "cursor-not-allowed opacity-60" : "hover:border-primary hover:shadow-[0_0_16px_-4px_var(--color-primary)]",
                selected === day && !blocked && "ring-2 ring-ring",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {legend.map((l) => (
          <span key={l.status} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={cn("h-2.5 w-2.5 rounded-sm border", l.cls)} />
            {l.label}
          </span>
        ))}
      </div>

      {selected && (
        <div className="mt-4 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-xs">
          <span className="font-bold text-primary">{selected} September 2026 · </span>
          <span className="text-muted-foreground">
            {selectedEntry?.note ?? "200 units available"}
          </span>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Live availability helps prevent double booking and overlapping reservations.
      </p>
    </div>
  );
}
