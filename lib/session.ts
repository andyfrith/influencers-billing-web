import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

/**
 * Returns authenticated session or null.
 */
export async function getAppSession() {
  return getServerSession(authOptions);
}
