/**
 * OpenSuite SDK - Login API Route
 * 
 * POST /api/auth/login
 * Authenticates user via authorization server, stores tokens in httpOnly cookies.
 */

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { apiLogin } from "@/modules/opensuite-sdk/api";
import { COOKIES, COOKIE_OPTIONS } from "@/modules/opensuite-sdk/constants";
import { envConfig } from "@/config/env.config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 },
      );
    }

    const result = await apiLogin(username, password, {
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

    // Store access token in httpOnly secure cookie
    cookieStore.set(COOKIES.AUTH_TOKEN, data.access_token, {
      ...COOKIE_OPTIONS.base,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
    });

    // Store refresh token in httpOnly secure cookie
    cookieStore.set(COOKIES.REFRESH_TOKEN, data.refresh_token, {
      ...COOKIE_OPTIONS.base,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.refresh_expires_in,
    });

    // Return session info + access token to the client
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
      error instanceof Error ? error.message : "Login failed";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
