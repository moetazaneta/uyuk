import { useMutation } from 'convex/react'
import { Controller, useForm } from 'react-hook-form'

import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { ColorPicker } from './ColorPicker'
import { IconPicker } from './IconPicker'
import { TypeToggle } from './TypeToggle'

export interface HabitFormData {
  name: string
  description: string
  iconType: 'emoji' | 'icon'
  iconValue: string
  color: string
  type: 'boolean' | 'numeric'
  target: number
}

export interface HabitFormProps {
  habitId?: Id<'habits'>
  initialValues?: Partial<HabitFormData>
  onSuccess?: () => void
  onCancel?: () => void
}

const DEFAULT_VALUES: HabitFormData = {
  name: '',
  description: '',
  iconType: 'emoji',
  iconValue: '🎯',
  color: '#3b82f6',
  type: 'boolean',
  target: 1,
}

export function HabitForm({
  habitId,
  initialValues,
  onSuccess,
  onCancel,
}: HabitFormProps) {
  const createHabit = useMutation(api.habits.create)
  const updateHabit = useMutation(api.habits.update)

  const isEdit = !!habitId

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormData>({
    defaultValues: { ...DEFAULT_VALUES, ...initialValues },
  })

  const watchType = watch('type')

  const onSubmit = async (data: HabitFormData) => {
    try {
      if (isEdit) {
        await updateHabit({
          id: habitId,
          ...data,
          description: data.description || undefined,
        })
      } else {
        await createHabit({
          ...data,
          description: data.description || undefined,
        })
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save habit', error) // eslint-disable-line no-console
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full font-sans text-text-primary"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm text-text-secondary">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="bg-bg-subtle text-text-primary px-3 py-2 border-b border-divider focus:outline-none focus:border-focus transition-colors"
          placeholder="Drink water"
          {...register('name', {
            required: 'Name is required',
            maxLength: { value: 100, message: 'Max 100 characters' },
          })}
        />
        {errors.name && (
          <span className="text-xs text-[#ef4444] mt-1">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm text-text-secondary">
          Description <span className="text-text-disabled">(optional)</span>
        </label>
        <input
          id="description"
          type="text"
          className="bg-bg-subtle text-text-primary px-3 py-2 border-b border-divider focus:outline-none focus:border-focus transition-colors"
          placeholder="At least 2 liters a day"
          {...register('description')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm text-text-secondary">Icon</div>
        <Controller
          name="iconType"
          control={control}
          render={({ field: { value: iconType, onChange: onTypeChange } }) => (
            <Controller
              name="iconValue"
              control={control}
              render={({
                field: { value: iconValue, onChange: onValueChange },
              }) => (
                <IconPicker
                  value={{ type: iconType, value: iconValue }}
                  onChange={(val) => {
                    onTypeChange(val.type)
                    onValueChange(val.value)
                  }}
                />
              )}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm text-text-secondary">Color</div>
        <Controller
          name="color"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ColorPicker value={value} onChange={onChange} />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm text-text-secondary">Type</div>
        <Controller
          name="type"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TypeToggle value={value} onChange={onChange} />
          )}
        />
      </div>

      {watchType === 'numeric' && (
        <div className="flex flex-col gap-1 transition-all duration-200">
          <label htmlFor="target" className="text-sm text-text-secondary">
            Target
          </label>
          <input
            id="target"
            type="number"
            min="1"
            step="any"
            className="bg-bg-subtle text-text-primary font-mono px-3 py-2 border-b border-divider focus:outline-none focus:border-focus transition-colors"
            {...register('target', {
              required: 'Target is required',
              min: { value: 0.00001, message: 'Target must be > 0' },
              valueAsNumber: true,
            })}
          />
          {errors.target && (
            <span className="text-xs text-[#ef4444] mt-1">
              {errors.target.message}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-6 bg-bg-subtle text-text-primary hover:bg-bg-elevated transition-colors flex-1"
          >
            cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-6 bg-[#ededed] text-[#0a0a0a] hover:bg-[#d4d4d4] transition-colors flex-1 disabled:opacity-50"
        >
          {isSubmitting
            ? 'saving...'
            : isEdit
              ? 'save changes'
              : 'create habit'}
        </button>
      </div>
    </form>
  )
}
