import { Tabs } from "expo-router"
import { Home, Bookmark, Calendar, User } from "react-native-feather"
import Colors from "../../constants/Colors"
import { useTheme } from "../../context/ThemeContext"
import { View, StyleSheet } from "react-native"
import AppLogo from "../../components/AppLogo"

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
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
        headerLeft: () => (
          <View style={styles.headerLogo}>
            <AppLogo size="small" showText={false} />
          </View>
        ),
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

const styles = StyleSheet.create({
  headerLogo: {
    marginLeft: 16,
  }
})
