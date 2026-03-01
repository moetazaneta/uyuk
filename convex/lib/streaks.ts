/**
 * Pure helper functions for streak calculation and date formatting.
 * Extracted from convex/stats.ts for testability.
 */

/** Format a Date as YYYY-MM-DD string */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export type StatsInput = {
  /** Set of YYYY-MM-DD date strings with value > 0 */
  completedDates: Set<string>
  /** ISO timestamp (ms) when the habit was created */
  createdAt: number
  /** The "today" date to calculate against (for testability) */
  today: Date
}

export type StatsResult = {
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  completionRate: number
}

/** Calculate streak stats from a set of completed date strings */
export function calculateStats(input: StatsInput): StatsResult {
  const { completedDates, createdAt, today } = input
  const total = completedDates.size

  if (total === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completionRate: 0,
    }
  }

  // Sort dates chronologically
  const sortedDates = Array.from(completedDates).sort()

  const todayStr = formatDate(today)

  // Current streak: count consecutive days ending at today (or yesterday)
  let currentStreak = 0
  const checkDate = new Date(today)

  // If today is not completed, start checking from yesterday
  if (!completedDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  while (completedDates.has(formatDate(checkDate))) {
    currentStreak++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  // Longest streak: walk through sorted dates
  let longestStreak = 0
  let streak = 1
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1] + 'T00:00:00')
    const curr = new Date(sortedDates[i] + 'T00:00:00')
    const diffMs = curr.getTime() - prev.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      streak++
    } else {
      longestStreak = Math.max(longestStreak, streak)
      streak = 1
    }
  }
  longestStreak = Math.max(longestStreak, streak)

  // Completion rate: completed days / total days since habit creation
  const createdDate = new Date(createdAt)
  const createdStr = formatDate(createdDate)
  const firstDate =
    sortedDates[0] < createdStr ? sortedDates[0] : createdStr
  const daysSinceCreation = Math.max(
    1,
    Math.round(
      (today.getTime() - new Date(firstDate + 'T00:00:00').getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1,
  )
  const completionRate = Math.round((total / daysSinceCreation) * 100)

  return {
    currentStreak,
    longestStreak,
    totalCompletions: total,
    completionRate,
  }
}
