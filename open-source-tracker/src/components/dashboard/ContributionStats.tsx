'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useContributions } from '@/hooks/useContributions'
import { Skeleton } from '../ui/skeleton'

export function ContributionStats() {
  const { data, isLoading } = useContributions()

  if (isLoading) return <StatsSkeleton />

  const stats = [
    { name: 'Total Contributions', value: data?.totalContributions || 0 },
    { name: 'Repositories', value: data?.uniqueRepos || 0 },
    { name: 'Active Days', value: data?.activeDays || 0 },
    { name: 'Streak', value: data?.currentStreak || 0 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-[50px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}