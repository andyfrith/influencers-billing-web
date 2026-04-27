import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import {
  clubMemberships,
  membershipCancellationRequests,
  users,
} from "@/db/schema";
import { requireAdminSession } from "@/lib/authorization";

export async function GET(): Promise<Response> {
  const { errorResponse } = await requireAdminSession();
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const requests = await db
      .select({
        id: membershipCancellationRequests.id,
        status: membershipCancellationRequests.status,
        reason: membershipCancellationRequests.reason,
        createdAt: membershipCancellationRequests.createdAt,
        membershipId: membershipCancellationRequests.membershipId,
        requestedByUserId: membershipCancellationRequests.requestedByUserId,
        requestedByEmail: users.email,
      })
      .from(membershipCancellationRequests)
      .innerJoin(users, eq(users.id, membershipCancellationRequests.requestedByUserId))
      .innerJoin(
        clubMemberships,
        eq(clubMemberships.id, membershipCancellationRequests.membershipId),
      )
      .where(eq(membershipCancellationRequests.status, "requested"));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load cancellation requests." },
      { status: 500 },
    );
  }
}
