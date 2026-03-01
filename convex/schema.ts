import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ...authTables,

  habits: defineTable({
    userId: v.id('users'),
    name: v.string(),
    description: v.optional(v.string()),
    iconType: v.union(v.literal('emoji'), v.literal('icon')),
    iconValue: v.string(),
    color: v.string(),
    type: v.union(v.literal('boolean'), v.literal('numeric')),
    target: v.number(),
    sortOrder: v.number(),
    isArchived: v.boolean(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user_active', [
    'userId',
    'isDeleted',
    'isArchived',
    'sortOrder',
  ]),

  completions: defineTable({
    userId: v.id('users'),
    habitId: v.id('habits'),
    date: v.string(),
    value: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_habit_date', ['habitId', 'date'])
    .index('by_user_date', ['userId', 'date'])
    .index('by_user_habit', ['userId', 'habitId']),
})
