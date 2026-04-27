import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { membershipCancellationRequests } from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";
import { cancelMembershipSubscription } from "@/lib/stripe";
import { resolveCancellationRequestSchema } from "@/lib/validators/memberships";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { errorResponse, session } = await requireAdminSession();
  if (errorResponse || !session) {
    return errorResponse as Response;
  }

  try {
    const params = await context.params;
    const parsed = resolveCancellationRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const [cancellationRequest] = await db
      .select()
      .from(membershipCancellationRequests)
      .where(eq(membershipCancellationRequests.id, params.id))
      .limit(1);

    if (!cancellationRequest) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    if (parsed.data.action === "reject") {
      await db
        .update(membershipCancellationRequests)
        .set({
          status: "rejected",
          resolvedByAdminUserId: session.user.id,
          updatedAt: new Date(),
        })
        .where(eq(membershipCancellationRequests.id, params.id));

      return NextResponse.json({ message: "Cancellation request rejected." });
    }

    if (parsed.data.action === "approve") {
      await db
        .update(membershipCancellationRequests)
        .set({
          status: "approved",
          resolvedByAdminUserId: session.user.id,
          updatedAt: new Date(),
        })
        .where(eq(membershipCancellationRequests.id, params.id));

      return NextResponse.json({ message: "Cancellation request approved." });
    }

    await cancelMembershipSubscription({
      membershipId: cancellationRequest.membershipId,
      adminUserId: session.user.id,
      cancellationRequestId: cancellationRequest.id,
    });

    return NextResponse.json({ message: "Membership cancelled." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to resolve cancellation request." },
      { status: 500 },
    );
  }
}
