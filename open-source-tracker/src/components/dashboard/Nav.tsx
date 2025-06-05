'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, GitPullRequest, Settings, Github } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Contributions',
    href: '/dashboard/contributions',
    icon: GitPullRequest,
  },
  {
    name: 'Repositories',
    href: '/dashboard/repositories',
    icon: Github,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="hidden w-64 border-r bg-white md:block">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Contribution Tracker</h2>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium',
              pathname === item.href
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default DashboardNav;