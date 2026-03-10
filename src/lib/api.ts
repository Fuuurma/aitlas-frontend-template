// src/lib/api.ts
import "server-only";
import { env } from "@/env";
import { cookies } from "next/headers";

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
  withAuth?: boolean;
};

export async function apiFetch<T>(
  baseUrl: string,
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, withAuth = false, ...init } = options;
  const url = new URL(path, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...init.headers as Record<string, string>,
  };

  if (withAuth) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    if (sessionToken) {
      headers["Authorization"] = `Bearer ${sessionToken}`;
    }
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error ${response.status}: ${error}`);
  }

  return response.json() as Promise<T>;
}

export async function apiFetchInternal<T>(
  path: string,
  options: Omit<FetchOptions, "withAuth"> = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Furma-Internal": env.FURMA_INTERNAL_SECRET,
    ...options.headers as Record<string, string>,
  };

  return apiFetch<T>(env.NEXUS_API_URL ?? "http://localhost:4000", path, {
    ...options,
    headers,
  });
}

export async function apiFetchWithAuth<T>(
  path: string,
  options: Omit<FetchOptions, "withAuth"> = {}
): Promise<T> {
  return apiFetch<T>(env.NEXUS_API_URL ?? "http://localhost:4000", path, {
    ...options,
    withAuth: true,
  });
}

export const nexus = {
  post: <T>(path: string, body: unknown, withAuth = false) =>
    withAuth
      ? apiFetchWithAuth<T>(path, {
          method: "POST",
          body: JSON.stringify(body),
        })
      : apiFetchInternal<T>(path, {
          method: "POST",
          body: JSON.stringify(body),
        }),
  get: <T>(path: string, params?: Record<string, string>, withAuth = false) =>
    withAuth
      ? apiFetchWithAuth<T>(path, { params })
      : apiFetchInternal<T>(path, { params }),
};