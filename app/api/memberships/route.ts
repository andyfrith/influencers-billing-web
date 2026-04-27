import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubMemberships, clubSubscriptionPlans, clubs } from "@/db/schema";
import { getAppSession } from "@/lib/session";

export async function GET(): Promise<Response> {
  try {
    const session = await getAppSession();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const memberships = await db
      .select({
        membershipId: clubMemberships.id,
        status: clubMemberships.status,
        currentPeriodEnd: clubMemberships.currentPeriodEnd,
        clubId: clubs.id,
        clubName: clubs.name,
        clubSlug: clubs.slug,
        planId: clubSubscriptionPlans.id,
        planName: clubSubscriptionPlans.name,
        interval: clubSubscriptionPlans.interval,
        amountCents: clubSubscriptionPlans.amountCents,
        currency: clubSubscriptionPlans.currency,
      })
      .from(clubMemberships)
      .innerJoin(clubs, eq(clubs.id, clubMemberships.clubId))
      .innerJoin(clubSubscriptionPlans, eq(clubSubscriptionPlans.id, clubMemberships.planId))
      .where(eq(clubMemberships.userId, userId));

    return NextResponse.json({ memberships });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load memberships." }, { status: 500 });
  }
}
