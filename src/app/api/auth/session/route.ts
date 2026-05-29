/**
 * OpenSuite SDK - Session API Route
 * 
 * GET /api/auth/session
 * Returns whether the user has a valid session (checks cookie existence).
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIES } from "@/modules/opensuite-sdk/constants";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(COOKIES.AUTH_TOKEN)?.value;

    if (!authToken) {
      return NextResponse.json({
        success: true,
        data: { authenticated: false },
      });
    }

    return NextResponse.json({
      success: true,
      data: { authenticated: true },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: { authenticated: false },
    });
  }
}
