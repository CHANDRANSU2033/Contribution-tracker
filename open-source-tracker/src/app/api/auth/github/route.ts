import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { getServerSession, Session } from "next-auth";
import { fetchGitHubContributions } from "@/lib/github";
import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions) as Session & { user: { id: string } };

        if (!session?.user?.id) {
            return NextResponse.redirect('/signin');
        }

        const account = await prisma.account.findFirst({
            where: {
                userId: session.user.id,
                provider: 'github',
            },
        });

        if (account?.access_token) {
            await fetchGitHubContributions(
                account.access_token,
                session.user.id
            );
        }

        return NextResponse.redirect('/dashboard');
    } catch (error) {
        console.error("Error in GitHub sync route:", error);
        return NextResponse.redirect('/signin?error=github_sync_failed');
    }
}