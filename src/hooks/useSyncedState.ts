import { type Dispatch, type SetStateAction, useRef, useState } from 'react'

export function useSyncedState<T>(
  serverValue: T | undefined,
  fallback: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [local, setLocal] = useState<T>(serverValue ?? fallback)
  const prevRef = useRef(serverValue)
  if (prevRef.current !== serverValue) {
    prevRef.current = serverValue
    if (serverValue !== undefined) setLocal(serverValue)
  }
  return [local, setLocal]
}
