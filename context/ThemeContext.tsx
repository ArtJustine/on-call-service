"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import Colors from "../constants/Colors"
import { useColorScheme } from "react-native"

interface ThemeContextProps {
  isDark: boolean
  colors: typeof Colors.light
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  colors: Colors.light,
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme()
  const [isDark, setIsDark] = useState(colorScheme === "dark")

  useEffect(() => {
    setIsDark(colorScheme === "dark")
  }, [colorScheme])

  const toggleTheme = () => {
    setIsDark((previousState) => !previousState)
  }

  const colors = isDark ? Colors.dark : Colors.light

  const value: ThemeContextProps = {
    isDark,
    colors,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

