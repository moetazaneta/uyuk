import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

export function useSyncedState<T>(
  serverValue: T | undefined,
  fallback: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [local, setLocal] = useState<T>(serverValue ?? fallback)
  useEffect(() => {
    if (serverValue !== undefined) setLocal(serverValue)
  }, [serverValue])
  return [local, setLocal]
}
