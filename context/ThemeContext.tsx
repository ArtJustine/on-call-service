"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import Colors from "../constants/Colors"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  colors: typeof Colors.light | typeof Colors.dark
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme() as Theme
  const [theme, setTheme] = useState<Theme>(deviceTheme || "light")

  // Update theme if device theme changes
  useEffect(() => {
    if (deviceTheme) {
      setTheme(deviceTheme)
    }
  }, [deviceTheme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const colors = theme === "light" ? Colors.light : Colors.dark
  const isDark = theme === "dark"

  return <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

