/**
 * OpenSuite SDK - Access API Route
 * 
 * GET /api/auth/access
 * Proxies the auth token (from httpOnly cookie) to fetch the access snapshot
 * from the authorization server. This keeps the auth token server-side only.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiFetchAccessSnapshot } from "@/modules/opensuite-sdk/api";
import { COOKIES } from "@/modules/opensuite-sdk/constants";
import { isAuthenticationFailure } from "@/modules/opensuite-sdk/auth-errors";
import { envConfig } from "@/config/env.config";
import { appConfig } from "@/config/app.config";

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

    const result = await apiFetchAccessSnapshot(authToken, {
      baseUrl: envConfig.authorizationCenterUrl,
      appCode: appConfig.appCode,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch access snapshot";

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
