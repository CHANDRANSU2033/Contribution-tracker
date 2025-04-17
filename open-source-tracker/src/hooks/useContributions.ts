'use client'

import { useEffect, useState } from 'react'
import { ContributionStats } from '@/lib/types'

export function useContributions() {
  const [data, setData] = useState<ContributionStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/contributions/stats')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error('Failed to fetch contributions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading }
}