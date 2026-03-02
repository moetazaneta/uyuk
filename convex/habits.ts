import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'

import { mutation, query } from './_generated/server'

// 2.1: habits.create — validate input, calculate sortOrder, insert habit
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    iconType: v.union(v.literal('emoji'), v.literal('icon')),
    iconValue: v.string(),
    color: v.string(),
    type: v.union(v.literal('boolean'), v.literal('numeric')),
    target: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    // Calculate next sortOrder from existing active habits
    const existing = await ctx.db
      .query('habits')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', userId).eq('isDeleted', false).eq('isArchived', false),
      )
      .order('desc')
      .first()

    const sortOrder = existing ? existing.sortOrder + 1 : 0
    const now = Date.now()

    const habitId = await ctx.db.insert('habits', {
      userId,
      name: args.name,
      description: args.description,
      iconType: args.iconType,
      iconValue: args.iconValue,
      color: args.color,
      type: args.type,
      target: args.target,
      sortOrder,
      isArchived: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    })

    return habitId
  },
})

// 2.2: habits.list — filter active by user, sorted by sortOrder
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    return await ctx.db
      .query('habits')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', userId).eq('isDeleted', false).eq('isArchived', false),
      )
      .collect()
  },
})

// 2.2.5: habits.getById — get single habit by ID
export const getById = query({
  args: { id: v.id('habits') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return null
    }

    const habit = await ctx.db.get(args.id)
    if (!habit || habit.userId !== userId) {
      return null
    }

    return habit
  },
})

// 2.3: habits.update — partial update with updatedAt
export const update = mutation({
  args: {
    id: v.id('habits'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    iconType: v.optional(v.union(v.literal('emoji'), v.literal('icon'))),
    iconValue: v.optional(v.string()),
    color: v.optional(v.string()),
    type: v.optional(v.union(v.literal('boolean'), v.literal('numeric'))),
    target: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    const habit = await ctx.db.get(args.id)
    if (!habit || habit.userId !== userId) {
      throw new ConvexError('HABIT_NOT_FOUND')
    }

    const { id: _id, ...updates } = args
    // Remove undefined fields so patch only applies provided values
    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patch[key] = value
      }
    }

    await ctx.db.patch(args.id, patch)
  },
})

// 2.4: habits.reorder — batch sortOrder update
export const reorder = mutation({
  args: {
    ids: v.array(v.id('habits')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    const now = Date.now()
    for (let i = 0; i < args.ids.length; i++) {
      const habit = await ctx.db.get(args.ids[i])
      if (!habit || habit.userId !== userId) {
        throw new ConvexError('HABIT_NOT_FOUND')
      }
      await ctx.db.patch(args.ids[i], { sortOrder: i, updatedAt: now })
    }
  },
})

// 2.5: habits.archive / unarchive — toggle isArchived
export const archive = mutation({
  args: {
    id: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    const habit = await ctx.db.get(args.id)
    if (!habit || habit.userId !== userId) {
      throw new ConvexError('HABIT_NOT_FOUND')
    }

    await ctx.db.patch(args.id, {
      isArchived: true,
      updatedAt: Date.now(),
    })
  },
})

export const unarchive = mutation({
  args: {
    id: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    const habit = await ctx.db.get(args.id)
    if (!habit || habit.userId !== userId) {
      throw new ConvexError('HABIT_NOT_FOUND')
    }

    await ctx.db.patch(args.id, {
      isArchived: false,
      updatedAt: Date.now(),
    })
  },
})

// 2.6: habits.softDelete / restore — toggle isDeleted
export const softDelete = mutation({
  args: {
    id: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    const habit = await ctx.db.get(args.id)
    if (!habit || habit.userId !== userId) {
      throw new ConvexError('HABIT_NOT_FOUND')
    }

    await ctx.db.patch(args.id, {
      isDeleted: true,
      updatedAt: Date.now(),
    })
  },
})

export const restore = mutation({
  args: {
    id: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    const habit = await ctx.db.get(args.id)
    if (!habit || habit.userId !== userId) {
      throw new ConvexError('HABIT_NOT_FOUND')
    }

    await ctx.db.patch(args.id, {
      isDeleted: false,
      updatedAt: Date.now(),
    })
  },
})

// 2.7: habits.archived — list archived habits
export const archived = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    return await ctx.db
      .query('habits')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', userId).eq('isDeleted', false).eq('isArchived', true),
      )
      .collect()
  },
})

// 2.8: habits.deleted — list soft-deleted habits
export const deleted = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    return await ctx.db
      .query('habits')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', userId).eq('isDeleted', true),
      )
      .collect()
  },
})
