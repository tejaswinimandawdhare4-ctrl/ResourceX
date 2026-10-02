import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, MapPin, Star, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/seeker-profile")({
  head: () => ({
    meta: [
      { title: "Seeker Profile — ResourceX" },
      {
        name: "description",
        content:
          "Manage your seeker profile: personal details, contact information and address so providers can reach you quickly.",
      },
      { property: "og:title", content: "Seeker Profile — ResourceX" },
      {
        property: "og:description",
        content: "Your seeker profile helps providers verify and contact you faster.",
      },
    ],
  }),
  component: SeekerProfileSettings,
});

function SeekerProfileSettings() {
  return (
    <DashboardShell
      title="Seeker Profile"
      subtitle="Manage your personal and organisation details"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="panel space-y-6 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="org-name">Organisation / company name</Label>
              <Input id="org-name" className="mt-2" placeholder="e.g. Sunshine Events Pvt. Ltd." defaultValue="Sunshine Events Pvt. Ltd." />
            </div>
            <div>
              <Label htmlFor="org-type">Organisation type</Label>
              <Input id="org-type" className="mt-2" placeholder="e.g. Event management company" defaultValue="Event management company" />
            </div>
            <div>
              <Label htmlFor="org-email">Work email</Label>
              <Input id="org-email" className="mt-2" type="email" placeholder="you@company.com" defaultValue="ops@sunshineevents.in" />
            </div>
            <div>
              <Label htmlFor="org-city">City</Label>
              <Input id="org-city" className="mt-2" placeholder="e.g. Bengaluru" defaultValue="Bengaluru" />
            </div>
            <div>
              <Label htmlFor="org-radius">Typical search radius (km)</Label>
              <Input id="org-radius" className="mt-2" type="number" defaultValue={30} />
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5 space-y-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <UserCircle className="h-4 w-4" />
              Seeker Details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="seeker-name">Seeker's full name</Label>
                <Input id="seeker-name" className="mt-2" placeholder="e.g. Arjun Mehta" defaultValue="Arjun Mehta" />
              </div>
              <div>
                <Label htmlFor="seeker-phone">Contact number</Label>
                <Input id="seeker-phone" className="mt-2" type="tel" placeholder="+91 XXXXX XXXXX" defaultValue="+91 91234 56789" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="seeker-address">Address</Label>
                <Textarea id="seeker-address" className="mt-2 resize-none" rows={3} placeholder="Full residential or office address" defaultValue="12, MG Road, Indiranagar, Bengaluru, Karnataka – 560038" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="seeker-about">About your resource needs</Label>
            <Textarea id="seeker-about" className="mt-2 resize-none" rows={4} maxLength={600} defaultValue="We organise corporate and social events across Bengaluru and frequently need banquet furniture, AV equipment and shuttle services on short notice." />
          </div>

          <Button size="lg" onClick={() => toast.success("Seeker profile updated")}>
            Save changes
          </Button>
        </div>

        <aside className="space-y-5">
          <div className="panel p-5 space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Activity summary</p>
            {([ ["Requests sent", "34"], ["Confirmed bookings", "28"], ["Avg. response time", "~22 min"], ["Fulfilment rate", "94%"] ] as const).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-bold text-foreground">{value}</span>
              </div>
            ))}
          </div>
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Reputation</p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-extrabold text-foreground">
              <Star className="h-5 w-5 fill-primary text-primary" /> 4.6
            </p>
            <p className="mt-1 text-xs text-muted-foreground">From 28 completed exchanges · 94% fulfilment rate</p>
          </div>
          <div className="panel p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Primary location
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Bengaluru · 30 km search radius</p>
          </div>
          <div className="panel p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BookOpen className="h-4 w-4 text-primary" /> Categories sought
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Furniture", "AV Equipment", "Shuttle", "Catering"].map((cat) => (
                <span key={cat} className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">{cat}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
