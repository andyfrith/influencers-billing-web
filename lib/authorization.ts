import { NextResponse } from "next/server";

import { getAppSession } from "@/lib/session";

/**
 * Returns an authenticated session for admin users only.
 */
export async function requireAdminSession() {
  const session = await getAppSession();
  if (!session?.user?.id) {
    return { errorResponse: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }
  if (session.user.role !== "admin") {
    return { errorResponse: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  }

  return { session };
}
