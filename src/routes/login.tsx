import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cities } from "@/lib/resourcex-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Business Login & Registration — ResourceX" },
      {
        name: "description",
        content:
          "Sign in as a hospitality business to list idle resources or request resources from verified providers nearby.",
      },
      { property: "og:title", content: "Business Login & Registration — ResourceX" },
      {
        property: "og:description",
        content: "Business accounts for providers and seekers on the hospitality resource exchange.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"provider" | "seeker">("provider");

  const go = (label: string) => {
    toast.success(label, { description: "Prototype session started as a demo business account." });
    navigate({ to: role === "provider" ? "/dashboard" : "/search" });
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 grid-backdrop opacity-60" aria-hidden />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-14">
        <div className="mx-auto">
          <Logo showTagline />
        </div>


        <div className="mt-8 panel p-6">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="register">Register business</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6 space-y-4">
              <div>
                <Label>Business email</Label>
                <Input className="mt-2" type="email" defaultValue="ops@hotelhorizon.in" />
              </div>
              <div>
                <Label>Password</Label>
                <Input className="mt-2" type="password" defaultValue="demo1234" />
              </div>
              <RolePicker role={role} setRole={setRole} />
              <Button className="w-full" size="lg" onClick={() => go("Signed in")}>
                <LogIn className="h-4 w-4" /> Sign in
              </Button>
            </TabsContent>

            <TabsContent value="register" className="mt-6 space-y-4">
              <div>
                <Label>Business name</Label>
                <Input className="mt-2" placeholder="Hotel Horizon" />
              </div>
              <div>
                <Label>Business type</Label>
                <Input className="mt-2" placeholder="Hotel, banquet hall, event company…" />
              </div>
              <div>
                <Label>City</Label>
                <Input className="mt-2" list="rx-login-cities" placeholder="Mumbai" />
                <datalist id="rx-login-cities">
                  {cities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label>Business email</Label>
                <Input className="mt-2" type="email" placeholder="ops@yourbusiness.in" />
              </div>
              <div>
                <Label>Password</Label>
                <Input className="mt-2" type="password" placeholder="At least 8 characters" />
              </div>
              <RolePicker role={role} setRole={setRole} />
              <Button className="w-full" size="lg" onClick={() => go("Business registered")}>
                <UserPlus className="h-4 w-4" /> Create business account
              </Button>
            </TabsContent>
          </Tabs>

          <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            Hackathon prototype: authentication is simulated, and any credentials open a demo business
            account.
          </p>
        </div>

        <Link to="/" className="mx-auto mt-6 text-xs text-muted-foreground hover:text-primary">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function RolePicker({
  role,
  setRole,
}: {
  role: "provider" | "seeker";
  setRole: (r: "provider" | "seeker") => void;
}) {
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Continue as
      </Label>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(["provider", "seeker"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={
              "rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition-colors " +
              (role === r
                ? "border-primary/60 bg-primary/12 text-primary"
                : "border-border text-muted-foreground hover:text-foreground")
            }
          >
            {r === "provider" ? "Resource provider" : "Resource seeker"}
          </button>
        ))}
      </div>
    </div>
  );
}
