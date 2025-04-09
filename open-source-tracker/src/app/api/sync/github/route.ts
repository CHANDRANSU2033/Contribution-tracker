import { getServerSession, Session } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { fetchGitHubContributions } from "@/lib/github";
import prisma from '@/lib/prisma';

export async function POST(): Promise<NextResponse> {
    try {
        // Get the session
        const session = await getServerSession(authOptions) as Session & { user: { id: string } };
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Find the GitHub account linked to the user
        const account = await prisma.account.findFirst({
            where: {
                userId: session.user.id,
                provider: 'github',
            },
        });

        if (!account?.access_token) {
            return NextResponse.json(
                { error: 'GitHub account not linked' },
                { status: 400 }
            );
        }

        // Fetch GitHub contributions
        const result = await fetchGitHubContributions(
            account.access_token,
            session.user.id
        );

        // Return the result
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in api-sync-github:", error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}