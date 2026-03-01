import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'

import { mutation, query } from './_generated/server'

// 2.9: completions.upsert — create or update completion per habit+date
export const upsert = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(), // YYYY-MM-DD
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    // Verify the habit belongs to this user
    const habit = await ctx.db.get(args.habitId)
    if (!habit || habit.userId !== userId) {
      throw new ConvexError('HABIT_NOT_FOUND')
    }

    const now = Date.now()

    // Check for existing completion on this habit+date
    const existing = await ctx.db
      .query('completions')
      .withIndex('by_habit_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date),
      )
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: now,
      })
      return existing._id
    }

    const completionId = await ctx.db.insert('completions', {
      userId,
      habitId: args.habitId,
      date: args.date,
      value: args.value,
      createdAt: now,
      updatedAt: now,
    })

    return completionId
  },
})

// 2.10: completions.clear — reset value to 0 (never delete records)
export const clear = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    const habit = await ctx.db.get(args.habitId)
    if (!habit || habit.userId !== userId) {
      throw new ConvexError('HABIT_NOT_FOUND')
    }

    const existing = await ctx.db
      .query('completions')
      .withIndex('by_habit_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date),
      )
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: 0,
        updatedAt: Date.now(),
      })
    }
  },
})

// 2.11: completions.byDateRange — fetch completions within date range
export const byDateRange = query({
  args: {
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    // Use by_user_date index, then filter on date range
    // The index is on [userId, date], so we can use gte/lte on date
    return await ctx.db
      .query('completions')
      .withIndex('by_user_date', (q) =>
        q
          .eq('userId', userId)
          .gte('date', args.startDate)
          .lte('date', args.endDate),
      )
      .collect()
  },
})

// 2.12: completions.byHabit — all completions for one habit
export const byHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    // Verify ownership
    const habit = await ctx.db.get(args.habitId)
    if (!habit || habit.userId !== userId) {
      return []
    }

    return await ctx.db
      .query('completions')
      .withIndex('by_user_habit', (q) =>
        q.eq('userId', userId).eq('habitId', args.habitId),
      )
      .collect()
  },
})
