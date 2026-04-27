import { NextResponse } from "next/server";

import { getAppSession } from "@/lib/session";
import { createMembershipSubscription } from "@/lib/stripe";
import { subscribeToClubSchema } from "@/lib/validators/memberships";

export async function POST(
  request: Request,
  context: { params: Promise<{ clubId: string }> },
): Promise<Response> {
  try {
    const session = await getAppSession();
    const userId = session?.user?.id;
    const email = session?.user?.email;
    if (!userId || !email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const params = await context.params;
    const parsed = subscribeToClubSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const result = await createMembershipSubscription({
      userId,
      email,
      planId: parsed.data.planId,
      clubId: params.clubId,
    });

    return NextResponse.json({
      message: "Subscription created.",
      subscriptionId: result.subscriptionId,
      status: result.status,
      currentPeriodEnd: result.currentPeriodEnd,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create subscription." }, { status: 500 });
  }
}
