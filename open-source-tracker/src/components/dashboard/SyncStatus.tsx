'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useToast } from '@/components/ui/useToast'

export function SyncStatus() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load last sync time from localStorage
    const savedTime = localStorage.getItem('lastSynced')
    if (savedTime) setLastSynced(savedTime)
  }, [])

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      if (res.ok) {
        const now = new Date().toLocaleString()
        setLastSynced(now)
        localStorage.setItem('lastSynced', now)
        toast({ title: 'Sync completed successfully' })
      } else {
        throw new Error('Sync failed')
      }
    } catch (error) {
      toast({
        title: 'Sync failed',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSync}
        disabled={isSyncing}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing...' : 'Sync Now'}
      </Button>
      {lastSynced && <span>Last synced: {lastSynced}</span>}
    </div>
  )
}