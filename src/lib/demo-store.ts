import { useSyncExternalStore } from "react";
import { resourcePerformance, utilizationSeries } from "@/lib/resourcex-data";

export type PaymentMethod = "escrow" | "offline";

export type DemoState = {
  /** Payment selection made during the negotiation → booking flow. */
  paymentMethod: PaymentMethod;
  escrowAmount: number;
  escrowReleased: boolean;
  termsAccepted: boolean;
  /** Business verification onboarding status. */
  verification: "unverified" | "pending" | "verified";
  /** Bookings completed live during a demo, applied on top of demo data. */
  ledger: { resource: string; amount: number; utilizationBoost: number }[];
};

const initial: DemoState = {
  paymentMethod: "escrow",
  escrowAmount: 7500,
  escrowReleased: false,
  termsAccepted: false,
  verification: "verified",
  ledger: [],
};

let state: DemoState = initial;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const demoStore = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  set: (patch: Partial<DemoState>) => {
    state = { ...state, ...patch };
    emit();
  },
  recordBooking: (entry: { resource: string; amount: number; utilizationBoost?: number }) => {
    if (state.ledger.some((l) => l.resource === entry.resource && l.amount === entry.amount)) return;
    state = {
      ...state,
      ledger: [
        ...state.ledger,
        { resource: entry.resource, amount: entry.amount, utilizationBoost: entry.utilizationBoost ?? 6 },
      ],
    };
    emit();
  },
};

export function useDemoState(): DemoState {
  return useSyncExternalStore(demoStore.subscribe, demoStore.get, demoStore.get);
}

const matchResource = (name: string, listed: string) =>
  name.toLowerCase().includes(listed.toLowerCase()) || listed.toLowerCase().includes(name.toLowerCase());

/** Demo data plus anything booked live during the demo. */
export function livePerformance(state: DemoState) {
  return resourcePerformance.map((r) => {
    const extra = state.ledger.filter((l) => matchResource(l.resource, r.resource));
    if (extra.length === 0) return r;
    return {
      ...r,
      bookings: r.bookings + extra.length,
      revenue: r.revenue + extra.reduce((s, e) => s + e.amount, 0),
      utilization: Math.min(100, r.utilization + extra.reduce((s, e) => s + e.utilizationBoost, 0)),
    };
  });
}

export function liveTotals(state: DemoState) {
  const perf = livePerformance(state);
  const extraRevenue = state.ledger.reduce((s, e) => s + e.amount, 0);
  const septRevenue = (utilizationSeries.at(-1)?.revenue ?? 0) + extraRevenue;
  const avgUtilization = Math.round(perf.reduce((s, r) => s + r.utilization, 0) / perf.length);
  return {
    performance: perf,
    septRevenue,
    avgUtilization,
    lowUtilization: perf.filter((r) => r.utilization < 50),
    extraBookings: state.ledger.length,
  };
}

export function liveUtilizationSeries(state: DemoState) {
  const totals = liveTotals(state);
  return utilizationSeries.map((row, i) =>
    i === utilizationSeries.length - 1
      ? {
          ...row,
          revenue: totals.septRevenue,
          bookings: row.bookings + totals.extraBookings,
          utilization: Math.min(100, row.utilization + totals.extraBookings),
        }
      : row,
  );
}

export const termsForCategory = (category: string): string[] => {
  const base = [
    "Free cancellation up to 24 hours before the booking start time; later cancellations are charged 25% of the agreed price.",
  ];
  if (/av|projector|sound/i.test(category))
    return [
      "The renting business is responsible for damage, loss or theft of equipment during the rental period.",
      "Late return penalty: ₹500 per hour beyond the agreed return time.",
      ...base,
    ];
  if (/vehicle|shuttle|parking/i.test(category))
    return [
      "Fuel, tolls and driver allowance are settled by the renting business unless agreed otherwise.",
      "Late release penalty: ₹750 per hour beyond the agreed window.",
      ...base,
    ];
  return [
    "The renting business is responsible for damage or loss of items during the rental period.",
    "Late return penalty: ₹250 per hour beyond the agreed return time.",
    ...base,
  ];
};
