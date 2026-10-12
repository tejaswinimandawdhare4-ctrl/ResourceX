import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cities } from "@/lib/resourcex-data";
import { useAuth, type UserRole } from "@/lib/auth-context";

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
  const { login, register } = useAuth();

  // Sign-in state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<UserRole>("provider");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Register state
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regBusinessType, setRegBusinessType] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("provider");
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail.trim()) {
      toast.error("Please enter your business email");
      return;
    }
    if (!loginPassword) {
      toast.error("Please enter your password");
      return;
    }

    setLoginLoading(true);
    try {
      await login(loginEmail.trim(), loginPassword, loginRole);
      toast.success("Signed in successfully!", {
        description: `Welcome back. You're signed in as a ${loginRole}.`,
      });
      navigate({ to: loginRole === "provider" ? "/dashboard" : "/search" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error("Login failed", { description: message });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regBusinessName.trim()) {
      toast.error("Business name is required");
      return;
    }
    if (!regEmail.trim()) {
      toast.error("Business email is required");
      return;
    }
    if (regPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setRegLoading(true);
    try {
      await register({
        business_name: regBusinessName.trim(),
        business_type: regBusinessType.trim() || "Hotel",
        email: regEmail.trim(),
        password: regPassword,
        city: regCity.trim() || "Mumbai",
        role: regRole,
      });
      toast.success("Account created!", {
        description: "Your business account is ready.",
      });
      navigate({ to: regRole === "provider" ? "/dashboard" : "/search" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error("Registration failed", { description: message });
    } finally {
      setRegLoading(false);
    }
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

            {/* ── Login tab ── */}
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Business email</Label>
                  <Input
                    id="login-email"
                    className="mt-2"
                    type="email"
                    autoComplete="email"
                    placeholder="ops@yourbusiness.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="login-password"
                      type={showLoginPwd ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowLoginPwd((v) => !v)}
                    >
                      {showLoginPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <RolePicker role={loginRole} setRole={setLoginRole} />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loginLoading}
                >
                  <LogIn className="h-4 w-4" />
                  {loginLoading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            {/* ── Register tab ── */}
            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="reg-name">Business name</Label>
                  <Input
                    id="reg-name"
                    className="mt-2"
                    placeholder="Hotel Horizon"
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-type">Business type</Label>
                  <Input
                    id="reg-type"
                    className="mt-2"
                    placeholder="Hotel, banquet hall, event company…"
                    value={regBusinessType}
                    onChange={(e) => setRegBusinessType(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reg-city">City</Label>
                  <Input
                    id="reg-city"
                    className="mt-2"
                    list="rx-login-cities"
                    placeholder="Mumbai"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                  />
                  <datalist id="rx-login-cities">
                    {cities.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="reg-email">Business email</Label>
                  <Input
                    id="reg-email"
                    className="mt-2"
                    type="email"
                    autoComplete="email"
                    placeholder="ops@yourbusiness.in"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="reg-password"
                      type={showRegPwd ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowRegPwd((v) => !v)}
                    >
                      {showRegPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <RolePicker role={regRole} setRole={setRegRole} />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={regLoading}
                >
                  <UserPlus className="h-4 w-4" />
                  {regLoading ? "Creating account…" : "Create business account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            All data is securely stored. Your credentials are hashed and never shared.
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
            type="button"
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
