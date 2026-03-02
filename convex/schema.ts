import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ...authTables,

  // Override users table to add app-specific settings fields
  users: defineTable({
    // Auth fields (from authTables.users)
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // App settings fields
    timezone: v.optional(v.string()),
    weekStartDay: v.optional(v.union(v.literal('monday'), v.literal('sunday'))),
    tableViewDayCount: v.optional(v.number()),
    showStatsInTable: v.optional(v.boolean()),
    mobileTableViewDayCount: v.optional(v.number()),
  })
    .index('email', ['email'])
    .index('phone', ['phone']),

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
