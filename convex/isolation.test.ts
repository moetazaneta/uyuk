import { convexTest } from 'convex-test'
import { describe, expect, it } from 'vitest'

import { api } from './_generated/api'
import schema from './schema'

const modules = import.meta.glob('./**/*.ts')

/**
 * Helper: create a test user in the users table and return
 * an identity-bound test context that getAuthUserId will resolve.
 */
async function createTestUser(
  t: ReturnType<typeof convexTest>,
  name: string,
) {
  // Insert a user record into the users table (authTables schema)
  const userId = await t.run(async (ctx) => {
    return await ctx.db.insert('users', {})
  })

  // withIdentity sets ctx.auth.getUserIdentity()
  // getAuthUserId extracts userId from subject.split('|')[0]
  const asUser = t.withIdentity({
    name,
    subject: `${userId}|session`,
    issuer: 'test',
    tokenIdentifier: `test|${userId}`,
  })

  return { userId, asUser }
}

const habitArgs = {
  name: 'Drink water',
  iconType: 'emoji' as const,
  iconValue: '💧',
  color: '#3B82F6',
  type: 'boolean' as const,
  target: 1,
}

describe('data isolation: habits', () => {
  it('User A cannot see User B habits via habits.list', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    // Alice creates a habit
    await asAlice.mutation(api.habits.create, habitArgs)

    // Alice sees her habit
    const aliceHabits = await asAlice.query(api.habits.list)
    expect(aliceHabits).toHaveLength(1)
    expect(aliceHabits[0].name).toBe('Drink water')

    // Bob sees nothing
    const bobHabits = await asBob.query(api.habits.list)
    expect(bobHabits).toHaveLength(0)
  })

  it('User A cannot see User B archived habits', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)
    await asAlice.mutation(api.habits.archive, { id: habitId })

    const aliceArchived = await asAlice.query(api.habits.archived)
    expect(aliceArchived).toHaveLength(1)

    const bobArchived = await asBob.query(api.habits.archived)
    expect(bobArchived).toHaveLength(0)
  })

  it('User A cannot see User B deleted habits', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)
    await asAlice.mutation(api.habits.softDelete, { id: habitId })

    const aliceDeleted = await asAlice.query(api.habits.deleted)
    expect(aliceDeleted).toHaveLength(1)

    const bobDeleted = await asBob.query(api.habits.deleted)
    expect(bobDeleted).toHaveLength(0)
  })

  it('User B cannot update User A habit', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)

    await expect(
      asBob.mutation(api.habits.update, { id: habitId, name: 'Hacked' }),
    ).rejects.toThrow('HABIT_NOT_FOUND')
  })

  it('User B cannot archive User A habit', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)

    await expect(
      asBob.mutation(api.habits.archive, { id: habitId }),
    ).rejects.toThrow('HABIT_NOT_FOUND')
  })

  it('User B cannot soft-delete User A habit', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)

    await expect(
      asBob.mutation(api.habits.softDelete, { id: habitId }),
    ).rejects.toThrow('HABIT_NOT_FOUND')
  })

  it('User B cannot reorder User A habits', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)

    await expect(
      asBob.mutation(api.habits.reorder, { ids: [habitId] }),
    ).rejects.toThrow('HABIT_NOT_FOUND')
  })
})

describe('data isolation: completions', () => {
  it('User A cannot log completion on User B habit', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)

    await expect(
      asBob.mutation(api.completions.upsert, {
        habitId,
        date: '2026-03-01',
        value: 1,
      }),
    ).rejects.toThrow('HABIT_NOT_FOUND')
  })

  it('User A cannot clear completion on User B habit', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)
    await asAlice.mutation(api.completions.upsert, {
      habitId,
      date: '2026-03-01',
      value: 1,
    })

    await expect(
      asBob.mutation(api.completions.clear, {
        habitId,
        date: '2026-03-01',
      }),
    ).rejects.toThrow('HABIT_NOT_FOUND')
  })

  it('User B cannot see User A completions via byDateRange', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)
    await asAlice.mutation(api.completions.upsert, {
      habitId,
      date: '2026-03-01',
      value: 1,
    })

    const aliceCompletions = await asAlice.query(api.completions.byDateRange, {
      startDate: '2026-03-01',
      endDate: '2026-03-01',
    })
    expect(aliceCompletions).toHaveLength(1)

    const bobCompletions = await asBob.query(api.completions.byDateRange, {
      startDate: '2026-03-01',
      endDate: '2026-03-01',
    })
    expect(bobCompletions).toHaveLength(0)
  })

  it('User B cannot see User A completions via byHabit', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)
    await asAlice.mutation(api.completions.upsert, {
      habitId,
      date: '2026-03-01',
      value: 1,
    })

    const aliceCompletions = await asAlice.query(api.completions.byHabit, {
      habitId,
    })
    expect(aliceCompletions).toHaveLength(1)

    const bobCompletions = await asBob.query(api.completions.byHabit, {
      habitId,
    })
    expect(bobCompletions).toHaveLength(0)
  })
})

describe('data isolation: stats', () => {
  it('User B cannot see User A stats', async () => {
    const t = convexTest(schema, modules)

    const { asUser: asAlice } = await createTestUser(t, 'Alice')
    const { asUser: asBob } = await createTestUser(t, 'Bob')

    const habitId = await asAlice.mutation(api.habits.create, habitArgs)
    await asAlice.mutation(api.completions.upsert, {
      habitId,
      date: '2026-03-01',
      value: 1,
    })

    const aliceStats = await asAlice.query(api.stats.forHabit, { habitId })
    expect(aliceStats).not.toBeNull()
    expect(aliceStats!.totalCompletions).toBe(1)

    const bobStats = await asBob.query(api.stats.forHabit, { habitId })
    expect(bobStats).toBeNull()
  })
})

describe('authentication required', () => {
  it('unauthenticated user gets empty results from queries', async () => {
    const t = convexTest(schema, modules)

    const habits = await t.query(api.habits.list)
    expect(habits).toEqual([])

    const archived = await t.query(api.habits.archived)
    expect(archived).toEqual([])

    const deleted = await t.query(api.habits.deleted)
    expect(deleted).toEqual([])

    const completions = await t.query(api.completions.byDateRange, {
      startDate: '2026-03-01',
      endDate: '2026-03-01',
    })
    expect(completions).toEqual([])
  })

  it('unauthenticated user cannot create habits', async () => {
    const t = convexTest(schema, modules)

    await expect(
      t.mutation(api.habits.create, habitArgs),
    ).rejects.toThrow('NOT_AUTHENTICATED')
  })
})
