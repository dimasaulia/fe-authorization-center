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
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
