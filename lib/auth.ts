import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { getSupabaseUser } from "@/lib/supabase/server";

export async function getCurrentUser() {
  return getSupabaseUser();
}

export async function requireUser(redirectTo = "/login"): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export function getSafeRedirectPath(path: string | null | undefined, fallback = "/") {
  if (!path || !path.startsWith("/")) {
    return fallback;
  }

  return path;
}
