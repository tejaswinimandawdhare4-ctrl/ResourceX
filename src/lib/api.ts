import { authHeaders } from "./auth-context";

export const API_BASE = "http://localhost:5001/api";

// ── Generic fetch helper ─────────────────────────────

async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return response.json();
}

// ── Resources ────────────────────────────────────────

export async function getResources(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiFetch(`/resources${qs}`);
}

export async function getResourceById(id: string) {
  return apiFetch(`/resources/${id}`);
}

export async function createResource(data: Record<string, unknown>) {
  return apiFetch("/resources", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateResource(id: string, data: Record<string, unknown>) {
  return apiFetch(`/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteResource(id: string) {
  return apiFetch(`/resources/${id}`, { method: "DELETE" });
}

// ── Auth ─────────────────────────────────────────────

export async function apiLogin(email: string, password: string, role?: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
}

export async function apiRegister(data: {
  business_name: string;
  business_type: string;
  email: string;
  password: string;
  city: string;
  role: string;
}) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetMe() {
  return apiFetch("/auth/me");
}