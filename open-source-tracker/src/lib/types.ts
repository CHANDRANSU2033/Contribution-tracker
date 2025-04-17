export type ContributionStats = {
    totalContributions: number
    uniqueRepos: number
    dailyActivity: Array<{ date: string; count: number }>
    repoDistribution: Array<{ repo: string; count: number }>
    activeDays?: number
    currentStreak?: number
  }