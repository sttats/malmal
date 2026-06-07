import { NextResponse, type NextRequest } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth";
import { createSupabaseRouteHandlerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeRedirectPath(requestUrl.searchParams.get("next"), "/mypage");
  const response = NextResponse.redirect(new URL(next, requestUrl.origin));

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL(`/login?redirectTo=${encodeURIComponent(next)}`, requestUrl.origin));
  }

  if (code) {
    const supabase = createSupabaseRouteHandlerClient(request, response);

    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return response;
}
