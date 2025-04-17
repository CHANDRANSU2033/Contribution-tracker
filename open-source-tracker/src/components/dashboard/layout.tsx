import { ReactNode } from 'react'
import DashboardNav from './Nav'
import { AccountSwitcher } from './AccountSwitcher'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardNav />
        <div className="flex-1 p-8">
          <div className="mb-6">
            <AccountSwitcher />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}