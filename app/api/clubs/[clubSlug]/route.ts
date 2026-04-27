import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubMemberships, clubSubscriptionPlans, clubs, users } from "@/db/schema";

export async function GET(
  _request: Request,
  context: { params: Promise<{ clubSlug: string }> },
): Promise<Response> {
  try {
    const params = await context.params;

    const [club] = await db.select().from(clubs).where(eq(clubs.slug, params.clubSlug)).limit(1);
    if (!club) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    const plans = await db
      .select()
      .from(clubSubscriptionPlans)
      .where(and(eq(clubSubscriptionPlans.clubId, club.id), eq(clubSubscriptionPlans.isActive, true)));

    const members = await db
      .select({
        userId: users.id,
        email: users.email,
        status: clubMemberships.status,
      })
      .from(clubMemberships)
      .innerJoin(users, eq(users.id, clubMemberships.userId))
      .where(eq(clubMemberships.clubId, club.id));

    return NextResponse.json({ club, plans, members });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load club details." }, { status: 500 });
  }
}
