import { createHash, randomBytes } from "crypto";

/**
 * Generates a random token for one-time user actions.
 */
export function createToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Hashes one-time tokens for secure DB storage.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
