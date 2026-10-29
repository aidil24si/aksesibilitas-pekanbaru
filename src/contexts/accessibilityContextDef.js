import { createContext, useContext } from 'react'

export const AccessibilityContext = createContext(null)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility harus digunakan di dalam AccessibilityProvider')
  }
  return context
}
