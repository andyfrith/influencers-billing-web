import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { clubMemberships, membershipCancellationRequests } from "@/db/schema";
import { getAppSession } from "@/lib/session";
import { createCancellationRequestSchema } from "@/lib/validators/memberships";

export async function POST(
  request: Request,
  context: { params: Promise<{ membershipId: string }> },
): Promise<Response> {
  try {
    const session = await getAppSession();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const params = await context.params;
    const parsed = createCancellationRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const [membership] = await db
      .select()
      .from(clubMemberships)
      .where(and(eq(clubMemberships.id, params.membershipId), eq(clubMemberships.userId, userId)))
      .limit(1);

    if (!membership) {
      return NextResponse.json({ error: "Membership not found." }, { status: 404 });
    }

    await db.insert(membershipCancellationRequests).values({
      membershipId: membership.id,
      requestedByUserId: userId,
      reason: parsed.data.reason,
    });

    return NextResponse.json({ message: "Cancellation request submitted." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to submit cancellation request." },
      { status: 500 },
    );
  }
}
