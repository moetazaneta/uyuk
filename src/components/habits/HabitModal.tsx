import { useEffect, useRef } from 'react'

import { HabitForm } from './HabitForm'

export interface HabitModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function HabitModal({ isOpen, onClose, onSuccess }: HabitModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    const previousFocus = document.activeElement as HTMLElement

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleTab)
    document.addEventListener('mousedown', handleClickOutside)
    document.body.style.overflow = 'hidden' // Prevent scrolling behind modal

    // Focus first element initially
    setTimeout(() => {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements && focusableElements.length > 0) {
        ;(focusableElements[0] as HTMLElement).focus()
      }
    }, 10)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTab)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
      previousFocus?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-[fadeIn_200ms_ease-out]"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[480px] bg-bg border border-divider p-6 shadow-2xl animate-[slideUp_200ms_ease-out] max-h-[90vh] overflow-y-auto"
      >
        <h2 id="modal-title" className="text-xl font-bold mb-6 font-mono text-text-primary">
          new habit
        </h2>
        <HabitForm
          onCancel={onClose}
          onSuccess={() => {
            onSuccess?.()
            onClose()
          }}
        />
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
