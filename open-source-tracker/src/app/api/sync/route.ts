import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { syncService } from "@/services/sync";
import prisma from "@/lib/prisma";

export async function POST(): Promise<NextResponse> {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch accounts linked to the user
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id }, // Fixed typo: `Id` -> `id`
    });

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: "No linked accounts found" },
        { status: 400 }
      );
    }

    // Sync contributions for the user
    await syncService.syncUser(session.user.id, accounts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during sync:", error);
    return NextResponse.json({ error: "Sync Failed" }, { status: 500 });
  }
}
