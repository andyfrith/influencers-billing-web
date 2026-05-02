import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { getAppSession } from "@/lib/session";

/**
 * Ensures the visitor is signed in; redirects to sign-in otherwise.
 * Intended for Server Components and `app/` layouts (not Route Handlers).
 */
export async function requireSignedInPageSession() {
  const session = await getAppSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  return session;
}

/**
 * Returns an authenticated session for admin users only (Route Handlers).
 * For pages and layouts, use {@link requireAdminPageSession} instead.
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

/**
 * Ensures the visitor is a signed-in admin; redirects to sign-in or home otherwise.
 * Intended for Server Components and `app/` layouts (not Route Handlers).
 */
export async function requireAdminPageSession() {
  const session = await getAppSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }
  return session;
}
