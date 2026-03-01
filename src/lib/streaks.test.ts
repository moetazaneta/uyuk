import { describe, it, expect } from 'vitest'

import { calculateStats, formatDate } from '../../convex/lib/streaks'
import type { StatsInput } from '../../convex/lib/streaks'

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(formatDate(new Date(2026, 2, 1))).toBe('2026-03-01')
  })

  it('pads single-digit month and day', () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('handles Dec 31', () => {
    expect(formatDate(new Date(2025, 11, 31))).toBe('2025-12-31')
  })

  it('handles leap day', () => {
    expect(formatDate(new Date(2024, 1, 29))).toBe('2024-02-29')
  })
})

describe('calculateStats', () => {
  const makeInput = (
    dates: Array<string>,
    createdAt: string,
    today: string,
  ): StatsInput => ({
    completedDates: new Set(dates),
    createdAt: new Date(createdAt + 'T00:00:00').getTime(),
    today: new Date(today + 'T00:00:00'),
  })

  it('returns zeros for no completions', () => {
    const result = calculateStats(makeInput([], '2026-01-01', '2026-03-01'))
    expect(result).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completionRate: 0,
    })
  })

  it('returns streak of 1 when only today is completed', () => {
    const result = calculateStats(
      makeInput(['2026-03-01'], '2026-03-01', '2026-03-01'),
    )
    expect(result.currentStreak).toBe(1)
    expect(result.longestStreak).toBe(1)
    expect(result.totalCompletions).toBe(1)
    expect(result.completionRate).toBe(100)
  })

  it('counts consecutive days as a streak', () => {
    const result = calculateStats(
      makeInput(
        ['2026-02-27', '2026-02-28', '2026-03-01'],
        '2026-02-27',
        '2026-03-01',
      ),
    )
    expect(result.currentStreak).toBe(3)
    expect(result.longestStreak).toBe(3)
    expect(result.totalCompletions).toBe(3)
  })

  it('starts current streak from yesterday if today is not completed', () => {
    const result = calculateStats(
      makeInput(
        ['2026-02-27', '2026-02-28'],
        '2026-02-27',
        '2026-03-01',
      ),
    )
    expect(result.currentStreak).toBe(2)
  })

  it('current streak is 0 if neither today nor yesterday is completed', () => {
    const result = calculateStats(
      makeInput(['2026-02-25'], '2026-02-25', '2026-03-01'),
    )
    expect(result.currentStreak).toBe(0)
  })

  it('handles a gap in the middle — separate streaks', () => {
    const result = calculateStats(
      makeInput(
        ['2026-02-25', '2026-02-26', '2026-02-28', '2026-03-01'],
        '2026-02-25',
        '2026-03-01',
      ),
    )
    // Current streak: Feb 28 + Mar 1 (gap on Feb 27 breaks earlier streak)
    expect(result.currentStreak).toBe(2)
    // Longest streak: Feb 25-26 = 2 (same as current, tied)
    expect(result.totalCompletions).toBe(4)
  })

  it('tracks longest streak even if current is shorter', () => {
    const result = calculateStats(
      makeInput(
        [
          '2026-02-20',
          '2026-02-21',
          '2026-02-22',
          '2026-02-23',
          '2026-02-24',
          // gap
          '2026-02-28',
          '2026-03-01',
        ],
        '2026-02-20',
        '2026-03-01',
      ),
    )
    expect(result.currentStreak).toBe(2) // Feb 28 + Mar 1
    expect(result.longestStreak).toBe(5) // Feb 20-24
  })

  it('handles new habit with no gap (created today, completed today)', () => {
    const result = calculateStats(
      makeInput(['2026-03-01'], '2026-03-01', '2026-03-01'),
    )
    expect(result.currentStreak).toBe(1)
    expect(result.longestStreak).toBe(1)
    expect(result.totalCompletions).toBe(1)
    expect(result.completionRate).toBe(100)
  })

  it('calculates completion rate based on days since creation', () => {
    // Created 10 days ago, completed 5 of them
    const result = calculateStats(
      makeInput(
        [
          '2026-02-20',
          '2026-02-22',
          '2026-02-24',
          '2026-02-26',
          '2026-02-28',
        ],
        '2026-02-20',
        '2026-03-01',
      ),
    )
    // daysSinceCreation = (Mar 1 - Feb 20) + 1 = 10
    // completionRate = round(5/10 * 100) = 50
    expect(result.totalCompletions).toBe(5)
    expect(result.completionRate).toBe(50)
  })

  it('handles completion before createdAt (edge case)', () => {
    // Completion on a date before the habit's createdAt
    const result = calculateStats(
      makeInput(['2026-02-15', '2026-03-01'], '2026-02-20', '2026-03-01'),
    )
    // firstDate should be the earlier one (Feb 15)
    // daysSinceCreation = (Mar 1 - Feb 15) + 1 = 15
    expect(result.totalCompletions).toBe(2)
    expect(result.completionRate).toBe(Math.round((2 / 15) * 100))
  })

  it('handles single completion in the past — current streak 0', () => {
    const result = calculateStats(
      makeInput(['2026-01-15'], '2026-01-15', '2026-03-01'),
    )
    expect(result.currentStreak).toBe(0)
    expect(result.longestStreak).toBe(1)
    expect(result.totalCompletions).toBe(1)
  })

  it('handles leap year boundary streak', () => {
    // Feb 28 -> Feb 29 -> Mar 1 in a leap year
    const result = calculateStats(
      makeInput(
        ['2024-02-28', '2024-02-29', '2024-03-01'],
        '2024-02-28',
        '2024-03-01',
      ),
    )
    expect(result.currentStreak).toBe(3)
    expect(result.longestStreak).toBe(3)
  })

  it('handles non-leap year boundary (Feb 28 -> Mar 1)', () => {
    // In 2025 (non-leap year), Feb 28 -> Mar 1 is a gap (Feb 29 doesn't exist)
    const result = calculateStats(
      makeInput(
        ['2025-02-28', '2025-03-01'],
        '2025-02-28',
        '2025-03-01',
      ),
    )
    expect(result.currentStreak).toBe(2)
    expect(result.longestStreak).toBe(2)
  })
})
