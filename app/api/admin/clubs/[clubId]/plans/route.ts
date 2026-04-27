import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubSubscriptionPlans, clubs } from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";
import { createStripePriceForClubPlan } from "@/lib/stripe";
import { createClubPlanSchema } from "@/lib/validators/memberships";

export async function GET(
  _request: Request,
  context: { params: Promise<{ clubId: string }> },
): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const params = await context.params;
    const plans = await db
      .select()
      .from(clubSubscriptionPlans)
      .where(eq(clubSubscriptionPlans.clubId, params.clubId));

    return NextResponse.json({ plans });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load plans." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ clubId: string }> },
): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const params = await context.params;
    const parsed = createClubPlanSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const [club] = await db.select().from(clubs).where(eq(clubs.id, params.clubId)).limit(1);
    if (!club) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    const stripePriceId = await createStripePriceForClubPlan({
      clubName: club.name,
      planName: parsed.data.name,
      interval: parsed.data.interval,
      amountCents: parsed.data.amountCents,
      currency: parsed.data.currency,
    });

    const [plan] = await db
      .insert(clubSubscriptionPlans)
      .values({
        clubId: params.clubId,
        name: parsed.data.name,
        interval: parsed.data.interval,
        amountCents: parsed.data.amountCents,
        currency: parsed.data.currency,
        stripePriceId,
      })
      .returning();

    return NextResponse.json({ plan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create plan." }, { status: 500 });
  }
}
