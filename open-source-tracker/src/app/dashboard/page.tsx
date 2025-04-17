import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/Layout'

export const metadata: Metadata = {
  title: 'Contribution Dashboard',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/signin')

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <WelcomeHeader />
        <ContributionStats />
        <ActivityTimeline />
        <RepositoryBreakdown />
      </div>
    </DashboardLayout>
  )
}