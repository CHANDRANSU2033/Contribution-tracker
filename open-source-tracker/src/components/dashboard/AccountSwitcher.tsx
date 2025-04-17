'use client'

import { ChevronDown, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dashboard/dropdown-menu'
import { useSession, signIn } from 'next-auth/react'
import Image from 'next/image'

type Account = {
  provider: string
  username: string
}

export function AccountSwitcher() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const accounts: Account[] = session.user.accounts || []

  const handleAddGitHub = async () => {
    try {
      await signIn('github')
    } catch (error) {
      console.error('Error connecting GitHub account:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          {session.user.image && (
            <Image
              src={session.user.image}
              alt="User avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span>{session.user.name || session.user.email}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Connected Accounts
        </div>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <DropdownMenuItem key={account.provider}>
              <div className="flex items-center">
                {account.provider === 'github' && (
                  <Github className="mr-2 h-4 w-4" />
                )}
                <span>
                  {account.username} ({account.provider})
                </span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
            No connected accounts
          </div>
        )}
        <DropdownMenuItem>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleAddGitHub}
          >
            <Github className="mr-2 h-4 w-4" />
            Add GitHub
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}