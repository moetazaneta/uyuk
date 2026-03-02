import { useAuthActions } from '@convex-dev/auth/react'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'

import { api } from '~/../convex/_generated/api'

export function SettingsView() {
  const settings = useQuery(api.users.settings)
  const archivedHabits = useQuery(api.habits.archived)
  const deletedHabits = useQuery(api.habits.deleted)

  const updateSettings = useMutation(api.users.updateSettings)
  const updateDisplayName = useMutation(api.users.updateDisplayName)
  const unarchiveHabit = useMutation(api.habits.unarchive)
  const restoreHabit = useMutation(api.habits.restore)

  const { signOut } = useAuthActions()

  const [displayName, setDisplayName] = useState(settings?.name ?? '')
  const [isSavingName, setIsSavingName] = useState(false)

  // Sync internal state when settings load
  if (settings && displayName === '' && settings.name !== '') {
    setDisplayName(settings.name)
  }

  if (
    settings === undefined ||
    settings === null ||
    archivedHabits === undefined ||
    deletedHabits === undefined
  ) {
    return (
      <div
        className="flex-1 overflow-auto bg-bg p-4 md:p-6"
        data-testid="settings-loading"
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-20 font-mono text-sm">
          <h1 className="text-xl md:text-2xl font-bold font-mono text-text-primary uppercase">
            settings
          </h1>

          <div className="flex flex-col gap-4">
            <div className="h-6 w-24 bg-bg-subtle/50 animate-pulse border-b border-divider pb-1" />
            <div className="h-10 bg-bg-elevated animate-pulse border border-divider" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="h-6 w-32 bg-bg-subtle/50 animate-pulse border-b border-divider pb-1" />
            <div className="h-10 bg-bg-elevated animate-pulse border border-divider" />
            <div className="h-10 bg-bg-elevated animate-pulse border border-divider mt-2" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="h-6 w-40 bg-bg-subtle/50 animate-pulse border-b border-divider pb-1" />
            <div className="h-16 bg-bg-elevated animate-pulse border border-divider" />
          </div>
        </div>
      </div>
    )
  }

  const timezones = Intl.supportedValuesOf('timeZone')

  const handleSaveName = async () => {
    setIsSavingName(true)
    try {
      await updateDisplayName({ name: displayName })
    } finally {
      setIsSavingName(false)
    }
  }

  return (
    <div
      className="flex-1 overflow-auto bg-bg p-4 md:p-6"
      data-testid="settings-view"
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-20 font-mono text-sm">
        <h1 className="text-xl md:text-2xl font-bold font-mono text-text-primary uppercase">
          settings
        </h1>

        <section className="flex flex-col gap-4">
          <h2 className="text-text-secondary uppercase tracking-widest text-xs border-b border-divider pb-1">
            profile
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="display-name" className="text-text-secondary">
              Display name
            </label>
            <div className="flex gap-2">
              <input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 bg-bg-elevated text-text-primary px-3 py-2 border border-divider focus:outline-none focus:border-[#ededed] transition-colors"
                placeholder="Enter your name"
              />
              <button
                onClick={handleSaveName}
                disabled={isSavingName || displayName === settings.name}
                className="px-4 py-2 bg-[#ededed] text-[#0a0a0a] hover:bg-[#d4d4d4] disabled:opacity-50 transition-colors"
              >
                {isSavingName ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-text-secondary uppercase tracking-widest text-xs border-b border-divider pb-1">
            preferences
          </h2>

          <div className="flex flex-col gap-2">
            <div className="text-text-secondary">Week start</div>
            <div className="flex gap-2">
              <button
                onClick={() => updateSettings({ weekStartDay: 'monday' })}
                className={`flex-1 px-4 py-2 border border-divider transition-colors ${
                  settings.weekStartDay === 'monday'
                    ? 'bg-bg-subtle text-text-primary'
                    : 'bg-bg text-text-secondary hover:bg-bg-elevated'
                }`}
              >
                Monday ▾
              </button>
              <button
                onClick={() => updateSettings({ weekStartDay: 'sunday' })}
                className={`flex-1 px-4 py-2 border border-divider transition-colors ${
                  settings.weekStartDay === 'sunday'
                    ? 'bg-bg-subtle text-text-primary'
                    : 'bg-bg text-text-secondary hover:bg-bg-elevated'
                }`}
              >
                Sunday ▾
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="timezone" className="text-text-secondary">
              Timezone
            </label>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => updateSettings({ timezone: e.target.value })}
              className="w-full bg-bg-elevated text-text-primary px-3 py-2 border border-divider focus:outline-none focus:border-[#ededed] transition-colors appearance-none"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-text-secondary uppercase tracking-widest text-xs border-b border-divider pb-1">
            archived habits
          </h2>
          <div className="flex flex-col gap-2">
            {archivedHabits.length === 0 ? (
              <div className="text-text-secondary py-4 text-center">
                no archived habits
              </div>
            ) : (
              archivedHabits.map((habit) => (
                <div
                  key={habit._id}
                  className="flex items-center justify-between p-3 bg-bg-elevated border border-divider"
                >
                  <div className="flex items-center gap-3">
                    <span>
                      {habit.iconType === 'emoji' ? habit.iconValue : '🎯'}
                    </span>
                    <span className="text-text-primary">{habit.name}</span>
                  </div>
                  <button
                    onClick={() => unarchiveHabit({ id: habit._id })}
                    className="px-3 py-1 bg-bg-subtle text-text-primary border border-divider hover:bg-[#ededed] hover:text-[#0a0a0a] transition-colors"
                  >
                    Unarchive
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-text-secondary uppercase tracking-widest text-xs border-b border-divider pb-1">
            deleted habits
          </h2>
          <div className="flex flex-col gap-2">
            {deletedHabits.length === 0 ? (
              <div className="text-text-secondary py-4 text-center">
                no deleted habits
              </div>
            ) : (
              deletedHabits.map((habit) => (
                <div
                  key={habit._id}
                  className="flex items-center justify-between p-3 bg-bg-elevated border border-divider"
                >
                  <div className="flex items-center gap-3 opacity-50">
                    <span>
                      {habit.iconType === 'emoji' ? habit.iconValue : '🎯'}
                    </span>
                    <span className="text-text-primary line-through">
                      {habit.name}
                    </span>
                  </div>
                  <button
                    onClick={() => restoreHabit({ id: habit._id })}
                    className="px-3 py-1 bg-bg-subtle text-text-primary border border-divider hover:bg-[#ededed] hover:text-[#0a0a0a] transition-colors"
                  >
                    Restore
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-text-secondary uppercase tracking-widest text-xs border-b border-divider pb-1">
            account
          </h2>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to sign out?')) {
                  void signOut()
                }
              }}
              className="px-4 py-2 border border-divider text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
