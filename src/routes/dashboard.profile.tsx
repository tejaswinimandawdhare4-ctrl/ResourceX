import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Star } from "lucide-react";

import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Business Profile — ResourceX Provider" },
      {
        name: "description",
        content:
          "Manage your hospitality business profile: contact details, service area, verification status and ratings.",
      },
      { property: "og:title", content: "Business Profile — ResourceX Provider" },
      { property: "og:description", content: "Verified business details build trust with partners." },
    ],
  }),
  component: BusinessProfileSettings,
});

function BusinessProfileSettings() {
  return (
    <DashboardShell title="Business Profile" subtitle="Hotel Horizon · Verified provider">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="panel space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Business name</Label>
              <Input className="mt-2" defaultValue="Hotel Horizon" />
            </div>
            <div>
              <Label>Business type</Label>
              <Input className="mt-2" defaultValue="4-star hotel & banquet venue" />
            </div>
            <div>
              <Label>Contact person</Label>
              <Input className="mt-2" defaultValue="Ritika Sharma" />
            </div>
            <div>
              <Label>Business email</Label>
              <Input className="mt-2" type="email" defaultValue="ops@hotelhorizon.in" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="mt-2" defaultValue="+91 98200 45671" />
            </div>
            <div>
              <Label>City</Label>
              <Input className="mt-2" defaultValue="Mumbai" />
            </div>
            <div>
              <Label>Address</Label>
              <Input className="mt-2" defaultValue="123 City Centre Road" placeholder="Enter business address" />
            </div>
            <div>
              <Label>Service radius (km)</Label>
              <Input className="mt-2" type="number" defaultValue={25} />
            </div>
          </div>
          <div>
            <Label>About the business</Label>
            <Textarea
              className="mt-2 resize-none"
              rows={4}
              maxLength={600}
              defaultValue="Banquet and conference venue in Andheri East with a large inventory of seating, tables and AV equipment available for partner businesses between events."
            />
          </div>
          <Button size="lg" onClick={() => toast.success("Profile updated")}>
            Save changes
          </Button>
        </div>

        <aside className="space-y-5">
          <div className="panel p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-primary">
              <BadgeCheck className="h-4 w-4" /> Verified business
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              GST and business registration verified on 12 Aug 2026.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/dashboard/verify">Get verified / manage documents</Link>
            </Button>
          </div>

          <div className="panel p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Reputation</p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-extrabold text-foreground">
              <Star className="h-5 w-5 fill-primary text-primary" /> 4.8
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              From 126 completed exchanges · 97% fulfilment rate
            </p>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
