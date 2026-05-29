/**
 * OpenSuite SDK - Logout API Route
 * 
 * POST /api/auth/logout
 * Clears all auth cookies.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIES } from "@/modules/opensuite-sdk/constants";

export async function POST() {
  try {
    const cookieStore = await cookies();

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
