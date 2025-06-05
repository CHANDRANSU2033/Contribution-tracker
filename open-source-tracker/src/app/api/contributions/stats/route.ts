import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get raw contributions - use session.id instead of session.user.id
    const contributions = await prisma.contribution.findMany({
      where: { userId: session.id }, // Fixed: using session.id instead of session.user.id
      orderBy: { contributionDate: 'desc' },
    })

    // Calculate stats
    const totalContributions = contributions.length
    const uniqueRepos = new Set(contributions.map(c => c.repoName)).size

    // Daily activity (last 30 days)
    const dailyActivity = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const dateString = date.toISOString().split('T')[0]

      const count = contributions.filter(c => {
        const contribDate = c.contributionDate.toISOString().split('T')[0]
        return contribDate === dateString
      }).length

      return { date: dateString, count }
    })

    // Repository distribution - changed property name to match component
    const repoDistribution = Array.from(
      contributions.reduce((map, c) => {
        map.set(c.repoName, (map.get(c.repoName) || 0) + 1)
        return map
      }, new Map<string, number>())
    ).map(([repoName, count]) => ({ repoName, count }))  // Changed from 'repo' to 'repoName'
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json({
      totalContributions,
      uniqueRepos,
      dailyActivity,
      repoDistribution,
    })
  } catch (error) {
    logger.error('Error fetching contribution stats: ', error);
    return NextResponse.json(
      { error: 'Failed to fetch contribution statistics' },
      { status: 500 }
    )
  }
}