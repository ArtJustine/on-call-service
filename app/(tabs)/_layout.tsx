"use client"

import { Tabs } from "expo-router"
import { Home, Bookmark, Calendar, User } from "react-native-feather"
import { useTheme } from "../../context/ThemeContext"

export default function TabsLayout() {
  const { colors } = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        // Hide the header completely
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home stroke={color} width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => <Calendar stroke={color} width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <Bookmark stroke={color} width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <User stroke={color} width={24} height={24} />,
        }}
      />
    </Tabs>
  )
}

