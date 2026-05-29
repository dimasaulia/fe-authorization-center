/**
 * OpenSuite SDK - Refresh API Route
 * 
 * POST /api/auth/refresh
 * Refreshes auth tokens using the refresh token from httpOnly cookie.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiRefreshToken } from "@/modules/opensuite-sdk/api";
import { COOKIES, COOKIE_OPTIONS } from "@/modules/opensuite-sdk/constants";
import { envConfig } from "@/config/env.config";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(COOKIES.REFRESH_TOKEN)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh token available" },
        { status: 401 },
      );
    }

    const result = await apiRefreshToken(refreshToken, {
      baseUrl: envConfig.authorizationCenterUrl,
    });

    if (!result.success) {
      // Clear cookies on refresh failure
      cookieStore.delete(COOKIES.AUTH_TOKEN);
      cookieStore.delete(COOKIES.REFRESH_TOKEN);

      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 },
      );
    }

    const { data } = result;

    // Update cookies with new tokens
    cookieStore.set(COOKIES.AUTH_TOKEN, data.access_token, {
      ...COOKIE_OPTIONS.base,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
    });

    cookieStore.set(COOKIES.REFRESH_TOKEN, data.refresh_token, {
      ...COOKIE_OPTIONS.base,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.refresh_expires_in,
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        access_token: data.access_token,
        expires_in: data.expires_in,
        session_state: data.session_state,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Token refresh failed";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
