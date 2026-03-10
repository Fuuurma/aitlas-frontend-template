// src/server/get-session.ts
import "server-only";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { cache } from "react";

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export const requireSession = cache(async () => {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
});