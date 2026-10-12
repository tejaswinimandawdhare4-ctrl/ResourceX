import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ── Types ─────────────────────────────────────────────

export type UserRole = "provider" | "seeker";

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  businessId: number;
  businessName: string;
  businessType: string;
  city: string;
  isVerified: boolean;
  rating?: number | string;
  contactPerson?: string;
  contactPhone?: string;
  phone?: string;
  address?: string;
  description?: string;
  totalReviews?: number;
  completedExchanges?: number;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ProfileUpdateData {
  business_name?: string;
  business_type?: string;
  contact_person?: string;
  contact_phone?: string;
  city?: string;
  address?: string;
  description?: string;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export interface RegisterData {
  business_name: string;
  business_type: string;
  email: string;
  password: string;
  city: string;
  role: UserRole;
}

// ── API base URL ─────────────────────────────────────

const API_BASE = "http://localhost:5001/api";

// ── Context ──────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────

const TOKEN_KEY = "rx_auth_token";
const USER_KEY = "rx_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // true initially so we can rehydrate from localStorage
  });

  const persist = (token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ user, token, isAuthenticated: true, isLoading: false });
  };

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success && data.user) {
        persist(token, data.user);
      }
    } catch (e) {
      console.warn("Failed to refresh user:", e);
    }
  }, []);

  // Rehydrate session on mount and refresh from backend
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser);
        setState({
          user,
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
        // Silently refresh in background from DB
        refreshUser();
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState((s) => ({ ...s, isLoading: false }));
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string, role?: UserRole) => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      persist(data.token, data.user);
    },
    []
  );

  const register = useCallback(async (formData: RegisterData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }

    persist(data.token, data.user);
  }, []);

  const updateProfile = useCallback(async (profileData: ProfileUpdateData) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update profile");
    }

    if (token && data.user) {
      persist(token, data.user);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, updateProfile, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ── Helper: get stored token for API calls ────────────

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
