import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'

import { mutation, query } from './_generated/server'

// 2.14: user.settings — get current user preferences
export const settings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return null
    }

    const user = await ctx.db.get(userId)
    if (!user) {
      return null
    }

    return {
      name: user.name ?? '',
      timezone: user.timezone ?? 'America/Los_Angeles',
      weekStartDay: user.weekStartDay ?? 'monday',
      tableViewDayCount: user.tableViewDayCount ?? 7,
      showStatsInTable: user.showStatsInTable ?? false,
      mobileTableViewDayCount: user.mobileTableViewDayCount ?? 7,
    }
  },
})

// 2.15: user.updateSettings — update weekStartDay, timezone, etc.
export const updateSettings = mutation({
  args: {
    timezone: v.optional(v.string()),
    weekStartDay: v.optional(v.union(v.literal('monday'), v.literal('sunday'))),
    tableViewDayCount: v.optional(v.number()),
    showStatsInTable: v.optional(v.boolean()),
    mobileTableViewDayCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    const user = await ctx.db.get(userId)
    if (!user) {
      throw new ConvexError('USER_NOT_FOUND')
    }

    const patch: {
      timezone?: string
      weekStartDay?: 'monday' | 'sunday'
      tableViewDayCount?: number
      showStatsInTable?: boolean
      mobileTableViewDayCount?: number
    } = {}
    if (args.timezone !== undefined) {
      patch.timezone = args.timezone
    }
    if (args.weekStartDay !== undefined) {
      patch.weekStartDay = args.weekStartDay
    }
    if (args.tableViewDayCount !== undefined) {
      patch.tableViewDayCount = args.tableViewDayCount
    }
    if (args.showStatsInTable !== undefined) {
      patch.showStatsInTable = args.showStatsInTable
    }
    if (args.mobileTableViewDayCount !== undefined) {
      patch.mobileTableViewDayCount = args.mobileTableViewDayCount
    }

    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(userId, patch)
    }
  },
})

export const updateDisplayName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    await ctx.db.patch(userId, { name: args.name })
  },
})
