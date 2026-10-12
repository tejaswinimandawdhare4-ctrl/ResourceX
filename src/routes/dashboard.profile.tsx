import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";

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
  const { user, updateProfile } = useAuth();

  const [businessName, setBusinessName] = useState(user?.businessName ?? "");
  const [businessType, setBusinessType] = useState(user?.businessType ?? "");
  const [contactPerson, setContactPerson] = useState(user?.contactPerson ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.contactPhone ?? user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [serviceRadius, setServiceRadius] = useState<number>(25);
  const [description, setDescription] = useState(user?.description ?? "");
  const [saving, setSaving] = useState(false);

  // Sync state if user rehydrates or updates
  useEffect(() => {
    if (user) {
      setBusinessName(user.businessName || "");
      setBusinessType(user.businessType || "");
      setContactPerson(user.contactPerson || "");
      setEmail(user.email || "");
      setPhone(user.contactPhone || user.phone || "");
      setCity(user.city || "");
      setAddress(user.address || "");
      setDescription(user.description || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        business_name: businessName,
        business_type: businessType,
        contact_person: contactPerson,
        contact_phone: phone,
        city,
        address,
        description,
      });
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error("Update failed", { description: msg });
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.businessName || businessName || "My Business";
  const displayCity = user?.city || city || "India";

  return (
    <DashboardShell
      title="Business Profile"
      subtitle={`${displayName} · ${displayCity} · ${user?.isVerified ? "Verified provider" : "Standard account"}`}
    >
      <form onSubmit={handleSave} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="panel space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Business name</Label>
              <Input
                className="mt-2"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Lily Hotel"
                required
              />
            </div>
            <div>
              <Label>Business type</Label>
              <Input
                className="mt-2"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. Hotel, Banquet, Restaurant"
              />
            </div>
            <div>
              <Label>Contact person</Label>
              <Input
                className="mt-2"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label>Business email</Label>
              <Input
                className="mt-2"
                type="email"
                value={email}
                disabled
                title="Email cannot be changed directly"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                className="mt-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98200 45671"
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                className="mt-2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                className="mt-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter business address / area"
              />
            </div>
            <div>
              <Label>Service radius (km)</Label>
              <Input
                className="mt-2"
                type="number"
                value={serviceRadius}
                onChange={(e) => setServiceRadius(Number(e.target.value) || 25)}
              />
            </div>
          </div>
          <div>
            <Label>About the business</Label>
            <Textarea
              className="mt-2 resize-none"
              rows={4}
              maxLength={600}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your hospitality business, capacity, and available resources..."
            />
          </div>
          <Button size="lg" type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>

        <aside className="space-y-5">
          <div className="panel p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-primary">
              <BadgeCheck className="h-4 w-4" /> {user?.isVerified ? "Verified business" : "Pending verification"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {user?.isVerified
                ? "GST and business registration verified on ResourceX."
                : "Submit your business registration documents to get the verified badge."}
            </p>
            {!user?.isVerified && (
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link to="/dashboard/verify">Get verified / manage documents</Link>
              </Button>
            )}
          </div>

          <div className="panel p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Reputation</p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-extrabold text-foreground">
              <Star className="h-5 w-5 fill-primary text-primary" /> {user?.rating ?? "4.8"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {user?.completedExchanges ?? 0} completed exchanges · 100% fulfilment rate
            </p>
          </div>
        </aside>
      </form>
    </DashboardShell>
  );
}
