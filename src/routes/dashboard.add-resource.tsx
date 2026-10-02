import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, cities } from "@/lib/resourcex-data";

export const Route = createFileRoute("/dashboard/add-resource")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search["edit"] === "string" ? (search["edit"] as string) : undefined,
  }),

  head: () => ({
    meta: [
      { title: "Add a Resource — ResourceX Provider" },
      {
        name: "description",
        content:
          "List idle hospitality inventory with quantity, pricing, availability window, location and delivery options.",
      },
      { property: "og:title", content: "Add a Resource — ResourceX Provider" },
      { property: "og:description", content: "Turn idle inventory into a bookable listing in minutes." },
    ],
  }),
  component: AddResource,
});

function AddResource() {
  const navigate = useNavigate();
  const { edit } = Route.useSearch();
  const [category, setCategory] = useState<string>("Seating");
  const [delivery, setDelivery] = useState(true);
  const [instant, setInstant] = useState(false);

  const save = () => {
    toast.success(edit ? "Listing updated" : "Resource listed", {
      description: "It is now discoverable to nearby businesses searching for this category.",
    });
    navigate({ to: "/dashboard/resources" });
  };

  return (
    <DashboardShell
      title={edit ? `Edit ${edit}` : "Add Resource"}
      subtitle={
        edit
          ? "Adjust pricing and availability to lift utilisation"
          : "List idle inventory and start earning from it"
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="panel space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Resource name</Label>
              <Input className="mt-2" defaultValue={edit ?? ""} placeholder="Banquet chairs (cushioned, gold frame)" />
            </div>

            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity available</Label>
              <Input className="mt-2" type="number" min={1} placeholder="200" />
            </div>
            <div>
              <Label>Price per unit (₹)</Label>
              <Input className="mt-2" type="number" min={0} placeholder="50" />
            </div>
            <div>
              <Label>Minimum rental duration</Label>
              <Input className="mt-2" placeholder="4 hours" />
            </div>
            <div>
              <Label>City</Label>
              <Input className="mt-2" list="rx-add-cities" placeholder="Mumbai" />
              <datalist id="rx-add-cities">
                {cities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <Label>Area / pickup point</Label>
              <Input className="mt-2" placeholder="Andheri East" />
            </div>
            <div>
              <Label>Available from</Label>
              <Input className="mt-2" type="date" defaultValue="2026-09-14" />
            </div>
            <div>
              <Label>Available until</Label>
              <Input className="mt-2" type="date" defaultValue="2026-10-31" />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-2 resize-none"
              rows={4}
              maxLength={600}
              placeholder="Condition, handling requirements, what's included…"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
              <span className="min-w-0 text-sm text-muted-foreground">Delivery available</span>
              <Switch checked={delivery} onCheckedChange={setDelivery} />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
              <span className="min-w-0 text-sm text-muted-foreground">Allow instant booking</span>
              <Switch checked={instant} onCheckedChange={setInstant} />
            </label>
          </div>

          <div>
            <Label>Photos</Label>
            <div className="mt-2 grid place-items-center rounded-xl border border-dashed border-primary/30 bg-primary/5 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-foreground">Drop photos here</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Prototype: uploads are simulated for the demo.
              </p>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={save}>
            Publish listing
          </Button>
        </div>

        <aside className="panel h-fit p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Listing tips</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {[
              "Accurate quantity prevents partial-fulfilment conflicts.",
              "Realistic pricing scores higher in the matching engine's price factor.",
              "Delivery availability widens your effective service radius.",
              "Keep the availability window current so the calendar stays conflict-free.",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="min-w-0">{t}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </DashboardShell>
  );
}
