/**
 * OpenSuite SDK - SSO Exchange API Route
 *
 * POST /api/auth/sso/exchange
 * Exchanges Authorization Center one-time SSO code, stores tokens in httpOnly cookies.
 */

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { apiExchangeKeycloakSsoCode } from "@/modules/opensuite-sdk/api";
import { COOKIES, COOKIE_OPTIONS } from "@/modules/opensuite-sdk/constants";
import { envConfig } from "@/config/env.config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: "SSO code is required" },
        { status: 400 },
      );
    }

    const result = await apiExchangeKeycloakSsoCode(code, {
      baseUrl: envConfig.authorizationCenterUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 },
      );
    }

    const { data } = result;
    const cookieStore = await cookies();

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
        id_token: data.id_token,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "SSO code exchange failed";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
