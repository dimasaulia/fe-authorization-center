/**
 * OpenSuite SDK - Logout API Route
 * 
 * POST /api/auth/logout
 * Invalidates the refresh token on the authorization server, then clears cookies.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiLogout } from "@/modules/opensuite-sdk/api";
import { COOKIES } from "@/modules/opensuite-sdk/constants";
import { envConfig } from "@/config/env.config";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(COOKIES.REFRESH_TOKEN)?.value;

    // Invalidate refresh token on authorization server
    if (refreshToken) {
      try {
        await apiLogout(refreshToken, {
          baseUrl: envConfig.authorizationCenterUrl,
        });
      } catch {
        // Best effort - still clear cookies even if server call fails
      }
    }

    cookieStore.delete(COOKIES.AUTH_TOKEN);
    cookieStore.delete(COOKIES.REFRESH_TOKEN);

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Logout failed";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
