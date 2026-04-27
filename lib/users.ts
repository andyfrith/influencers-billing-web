import { and, eq, gt } from "drizzle-orm";

import { db } from "@/db/client";
import {
  emailVerificationTokens,
  passwordResetTokens,
  users,
  type UserRecord,
} from "@/db/schema";
import { createToken, hashToken } from "@/lib/crypto";
import { hashPassword } from "@/lib/password";

const ONE_HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * ONE_HOUR_MS;

/**
 * Finds a user record by case-insensitive email.
 */
export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  const normalizedEmail = email.toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
  return user;
}

/**
 * Creates a user and returns a plain verification token.
 */
export async function createUser(input: {
  email: string;
  password: string;
}): Promise<{ user: UserRecord; verificationToken: string }> {
  const normalizedEmail = input.email.toLowerCase();
  const hashedPassword = await hashPassword(input.password);

  const [user] = await db
    .insert(users)
    .values({
      email: normalizedEmail,
      passwordHash: hashedPassword,
    })
    .returning();

  const verificationToken = createToken();

  await db.insert(emailVerificationTokens).values({
    userId: user.id,
    tokenHash: hashToken(verificationToken),
    expiresAt: new Date(Date.now() + DAY_MS),
  });

  return { user, verificationToken };
}

/**
 * Marks a user's email as verified if the token is valid.
 */
export async function verifyEmailToken(token: string): Promise<boolean> {
  const tokenHash = hashToken(token);
  const now = new Date();

  const [row] = await db
    .select()
    .from(emailVerificationTokens)
    .where(
      and(
        eq(emailVerificationTokens.tokenHash, tokenHash),
        gt(emailVerificationTokens.expiresAt, now),
      ),
    )
    .limit(1);

  if (!row) {
    return false;
  }

  await db
    .update(users)
    .set({
      emailVerifiedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, row.userId));

  await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, row.id));

  return true;
}

/**
 * Creates and stores a password reset token for a user.
 */
export async function createPasswordResetTokenForEmail(email: string): Promise<string | null> {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const token = createToken();
  const tokenHash = hashToken(token);

  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + ONE_HOUR_MS),
  });

  return token;
}

/**
 * Updates a user's password if reset token is valid.
 */
export async function resetPasswordByToken(
  token: string,
  nextPassword: string,
): Promise<boolean> {
  const tokenHash = hashToken(token);
  const now = new Date();

  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        gt(passwordResetTokens.expiresAt, now),
      ),
    )
    .limit(1);

  if (!row) {
    return false;
  }

  const hashedPassword = await hashPassword(nextPassword);

  await db
    .update(users)
    .set({
      passwordHash: hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(users.id, row.userId));

  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, row.id));

  return true;
}
