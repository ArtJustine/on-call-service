"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronRight, Settings, CreditCard, Bell, Shield, HelpCircle, LogOut } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../../context/ThemeContext"

export default function AccountScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const menuItems = [
    { icon: Settings, title: "Settings", onPress: () => router.push("/settings") },
    { icon: CreditCard, title: "Payment Methods", onPress: () => router.push("/payment-methods") },
    { icon: Bell, title: "Notifications", onPress: () => router.push("/notifications") },
    { icon: Shield, title: "Privacy & Security", onPress: () => alert("Privacy & Security pressed") },
    { icon: HelpCircle, title: "Help & Support", onPress: () => alert("Help & Support pressed") },
  ]

  const handleEditProfile = () => {
    router.push("/edit-profile")
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => router.push("/welcome"),
      },
    ])
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Account</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.profileSection, { borderBottomColor: colors.border }]}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { backgroundColor: colors.lightGray }]} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>John Smith</Text>
            <Text style={[styles.profileEmail, { color: colors.subtext }]}>john.smith@example.com</Text>
            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.menuSection,
            {
              borderTopColor: colors.border,
              borderBottomColor: colors.border,
            },
          ]}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <item.icon width={20} height={20} stroke={colors.subtext} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <ChevronRight width={20} height={20} stroke={colors.subtext} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut width={20} height={20} stroke={colors.primary} />
          <Text style={[styles.logoutText, { color: colors.primary }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  editProfileButton: {
    alignSelf: "flex-start",
  },
  editProfileText: {
    fontWeight: "500",
  },
  menuSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
})

