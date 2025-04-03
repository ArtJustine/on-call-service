"use client"

import { Tabs } from "expo-router"
import { Home, Calendar, Bookmark, User } from "react-native-feather"
import { Platform } from "react-native"
import { useTheme } from "../../context/ThemeContext"

export default function TabLayout() {
  const { colors, isDark } = useTheme()

  // Add extra bottom padding for iPhone models with home indicator
  const extraBottomPadding = Platform.OS === "ios" ? 20 : 10

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          height: 60 + (Platform.OS === "ios" ? 10 : 0),
          paddingBottom: extraBottomPadding,
          paddingTop: 5,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home width={24} height={24} stroke={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => <Calendar width={24} height={24} stroke={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <Bookmark width={24} height={24} stroke={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <User width={24} height={24} stroke={color} />,
        }}
      />
    </Tabs>
  )
}

