// src/app/api/credits/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { creditLedger } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get latest balance from credit ledger
    const latestTransaction = await db
      .select()
      .from(creditLedger)
      .where(eq(creditLedger.userId, session.user.id))
      .orderBy(desc(creditLedger.createdAt))
      .limit(1);

    const balance = latestTransaction[0]?.balance ?? 0;

    // Get recent transactions
    const transactions = await db
      .select()
      .from(creditLedger)
      .where(eq(creditLedger.userId, session.user.id))
      .orderBy(desc(creditLedger.createdAt))
      .limit(20);

    return NextResponse.json({
      balance,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}