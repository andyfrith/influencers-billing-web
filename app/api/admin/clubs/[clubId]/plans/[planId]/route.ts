import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubSubscriptionPlans } from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";
import { updateClubPlanStatusSchema } from "@/lib/validators/memberships";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ clubId: string; planId: string }> },
): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const params = await context.params;
    const parsed = updateClubPlanStatusSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const [plan] = await db
      .select()
      .from(clubSubscriptionPlans)
      .where(
        and(
          eq(clubSubscriptionPlans.id, params.planId),
          eq(clubSubscriptionPlans.clubId, params.clubId),
        ),
      )
      .limit(1);

    if (!plan) {
      return NextResponse.json({ error: "Plan not found." }, { status: 404 });
    }

    const [updatedPlan] = await db
      .update(clubSubscriptionPlans)
      .set({
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(clubSubscriptionPlans.id, plan.id))
      .returning();

    return NextResponse.json({ plan: updatedPlan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update plan." }, { status: 500 });
  }
}
