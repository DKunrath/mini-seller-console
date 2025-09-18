"use client"

import { useEffect, useState } from "react"

/**
 * Hook to handle client-side hydration safely
 * Prevents hydration mismatches when using localStorage
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}