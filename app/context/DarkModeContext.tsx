'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type DarkModeContextType = {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(saved ? JSON.parse(saved) : prefersDark)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (!context) throw new Error('useDarkMode must be used within DarkModeProvider')
  return context
}
