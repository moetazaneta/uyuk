import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { query } from './_generated/server'
import { calculateStats } from './lib/streaks'

// 2.13: stats.forHabit — streak, longest streak, total completions, completion rate
export const forHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return null
    }

    const habit = await ctx.db.get(args.habitId)
    if (!habit || habit.userId !== userId) {
      return null
    }

    // Get all completions for this habit, ordered by date ascending
    const completions = await ctx.db
      .query('completions')
      .withIndex('by_user_habit', (q) =>
        q.eq('userId', userId).eq('habitId', args.habitId),
      )
      .collect()

    // Build a set of completed dates (value > 0)
    const completedDates = new Set<string>()
    for (const c of completions) {
      if (c.value > 0) {
        completedDates.add(c.date)
      }
    }

    return calculateStats({
      completedDates,
      createdAt: habit.createdAt,
      today: new Date(),
    })
  },
})
