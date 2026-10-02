import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, FileCheck2, ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatusPill } from "@/components/resourcex/StatusPill";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { demoStore, useDemoState } from "@/lib/demo-store";

export const Route = createFileRoute("/dashboard/verify")({
  head: () => ({
    meta: [
      { title: "Verify Your Business — ResourceX" },
      {
        name: "description",
        content:
          "Upload your GST certificate and business registration document to earn the Verified Provider badge on ResourceX.",
      },
      { property: "og:title", content: "Verify Your Business — ResourceX" },
      {
        property: "og:description",
        content: "Verified businesses win more bookings on the hospitality resource exchange.",
      },
    ],
  }),
  component: VerifyBusiness,
});

type Doc = { key: "gst" | "registration"; label: string; hint: string };

const docs: Doc[] = [
  { key: "gst", label: "GST Certificate", hint: "PDF or image, up to 5 MB" },
  { key: "registration", label: "Business Registration Document", hint: "Shop & establishment, LLP or company certificate" },
];

function VerifyBusiness() {
  const state = useDemoState();
  const [files, setFiles] = useState<Record<string, string | null>>({ gst: null, registration: null });
  const uploaded = docs.every((d) => files[d.key]);

  const statusLabel =
    state.verification === "verified"
      ? "Verified"
      : state.verification === "pending"
        ? "Pending Verification"
        : "Unverified";

  return (
    <DashboardShell
      title="Verify Your Business"
      subtitle="Hotel Horizon · trust & compliance"
      actions={<StatusPill status={statusLabel} />}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="panel space-y-6 p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">
            Businesses complete this step before the Verified Provider badge appears on their profile
            and listings. Documents are reviewed once and cover every resource you list.
          </p>

          {docs.map((d) => (
            <div key={d.key} className="rounded-xl border border-dashed border-primary/30 bg-surface p-5">
              <Label className="text-sm font-bold text-foreground">{d.label}</Label>
              <p className="mt-1 text-xs text-muted-foreground">{d.hint}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <p className="min-w-0 truncate text-xs text-muted-foreground">
                  {files[d.key] ? (
                    <span className="flex items-center gap-2 font-semibold text-primary">
                      <FileCheck2 className="h-3.5 w-3.5 shrink-0" />
                      {files[d.key]}
                    </span>
                  ) : (
                    "No document selected yet."
                  )}
                </p>
                <label className="shrink-0">
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const name = e.target.files?.[0]?.name;
                      if (!name) return;
                      setFiles((f) => ({ ...f, [d.key]: name }));
                      toast.success(`${d.label} attached`, { description: name });
                    }}
                  />
                  <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                    <Upload className="h-3.5 w-3.5" /> {files[d.key] ? "Replace file" : "Upload file"}
                  </span>
                </label>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button
              size="lg"
              disabled={!uploaded || state.verification === "pending"}
              onClick={() => {
                demoStore.set({ verification: "pending" });
                toast.success("Documents submitted for verification");
              }}
            >
              Submit for verification
            </Button>
            {state.verification === "pending" && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  demoStore.set({ verification: "verified" });
                  toast.success("Business verified", {
                    description: "The Verified Provider badge is now live on your profile.",
                  });
                }}
              >
                Simulate review approval
              </Button>
            )}
          </div>
          {!uploaded && (
            <p className="text-xs text-muted-foreground">
              Attach both documents to submit your verification request.
            </p>
          )}
        </div>

        <aside className="space-y-5">
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Verification status</p>
            <div className="mt-3 flex items-center gap-3">
              <StatusPill status={statusLabel} />
            </div>
            <ol className="mt-4 space-y-3 text-xs text-muted-foreground">
              {["Documents uploaded", "Pending verification", "Verified provider badge live"].map(
                (step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="min-w-0">{step}</span>
                  </li>
                ),
              )}
            </ol>
          </div>

          <div className="panel p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-primary">
              <ShieldCheck className="h-4 w-4" /> Why it matters
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Verified businesses rank higher in nearby search results and close 2× more bookings on
              ResourceX.
            </p>
            <Button asChild variant="ghost" className="mt-4 w-full">
              <Link to="/dashboard/profile">
                <BadgeCheck className="h-4 w-4" /> Back to business profile
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
