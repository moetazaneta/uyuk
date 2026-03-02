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
      name: (user as Record<string, unknown>).name as string | undefined ?? '',
      timezone:
        ((user as Record<string, unknown>).timezone as string) ?? 'America/Los_Angeles',
      weekStartDay: (user as Record<string, unknown>).weekStartDay ?? 'monday',
      tableViewDayCount:
        (user as Record<string, unknown>).tableViewDayCount ?? 7,
    }
  },
})

// 2.15: user.updateSettings — update weekStartDay, timezone, etc.
export const updateSettings = mutation({
  args: {
    timezone: v.optional(v.string()),
    weekStartDay: v.optional(v.union(v.literal('monday'), v.literal('sunday'))),
    tableViewDayCount: v.optional(v.number()),
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

    const patch: Record<string, unknown> = {}
    if (args.timezone !== undefined) {
      patch.timezone = args.timezone
    }
    if (args.weekStartDay !== undefined) {
      patch.weekStartDay = args.weekStartDay
    }
    if (args.tableViewDayCount !== undefined) {
      patch.tableViewDayCount = args.tableViewDayCount
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

