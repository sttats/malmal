import type { User } from "@supabase/supabase-js";

import type { ProfileRow, ProfileSummary } from "@/types/database";
import type { AppSupabaseClient } from "@/lib/supabase/server";

function getDisplayName(user: User) {
  const rawDisplayName =
    user.user_metadata.display_name ??
    user.user_metadata.name ??
    user.user_metadata.full_name;

  if (typeof rawDisplayName === "string" && rawDisplayName.trim().length > 0) {
    return rawDisplayName.trim();
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "Creator";
}

export function mapProfileSummary(profile: ProfileRow | null | undefined): ProfileSummary {
  return {
    userId: profile?.user_id ?? "",
    displayName: profile?.display_name ?? null,
    avatarUrl: profile?.avatar_url ?? null
  };
}

export async function ensureProfile(
  supabase: AppSupabaseClient,
  user: User
): Promise<ProfileRow> {
  const payload = {
    user_id: user.id,
    display_name: getDisplayName(user),
    avatar_url:
      typeof user.user_metadata.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload as never, { onConflict: "user_id" })
    .select("id, user_id, display_name, avatar_url, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const profile = data as ProfileRow | null;

  if (!profile) {
    throw new Error("プロフィール情報を取得できませんでした。");
  }

  return profile;
}

export async function getProfileByUserId(supabase: AppSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, display_name, avatar_url, created_at, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
