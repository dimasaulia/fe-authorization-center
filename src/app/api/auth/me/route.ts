/**
 * OpenSuite SDK - User Profile API Route
 * 
 * GET /api/auth/me
 * Proxies the auth token (from httpOnly cookie) to fetch the current user profile.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiFetchUserProfile } from "@/modules/opensuite-sdk/api";
import { COOKIES } from "@/modules/opensuite-sdk/constants";
import { isAuthenticationFailure } from "@/modules/opensuite-sdk/auth-errors";
import { envConfig } from "@/config/env.config";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(COOKIES.AUTH_TOKEN)?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const result = await apiFetchUserProfile(authToken, {
      baseUrl: envConfig.authorizationCenterUrl,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch user profile";

    if (isAuthenticationFailure(error)) {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIES.AUTH_TOKEN);
      cookieStore.delete(COOKIES.REFRESH_TOKEN);

      return NextResponse.json(
        { success: false, message },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
