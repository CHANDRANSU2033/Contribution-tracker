'use client'

import { PieChart, Pie, Cell, Tooltip,ResponsiveContainer } from 'recharts'
import { useContributions } from '@/hooks/useContributions'
import { Skeleton } from '../ui/skeleton'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function RepositoryBreakdown() {
  const { data, isLoading } = useContributions()

  if (isLoading) return <Skeleton className="h-[300px] w-full" />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.repoDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="repo"
              >
                {data?.repoDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}