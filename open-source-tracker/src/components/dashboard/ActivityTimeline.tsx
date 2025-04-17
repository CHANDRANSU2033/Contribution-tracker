'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { useContributions } from '@/hooks/useContributions'
import { Skeleton } from '../ui/skeleton'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
export function ActivityTimeline() {
  const { data, isLoading } = useContributions()

  if (isLoading) return <Skeleton className="h-[300px] w-full" />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.dailyActivity}>
              <XAxis dataKey="date" />
              <YAxis />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}