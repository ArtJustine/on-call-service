"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { getCurrentUserData, signOutUser } from "../../services/AuthService"
import { firestoreService } from "../../services/FirebaseService"
import * as Linking from "expo-linking"

export default function AccountScreen() {
  const router = useRouter()
  const { colors, isDark, toggleTheme } = useTheme()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [savedExperts, setSavedExperts] = useState<any[]>([])

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUserData()
        setUserData(user)

        // Fetch saved experts if user exists
        if (user) {
          const experts = await firestoreService.queryCollection("savedExperts", [
            firestoreService.where("userId", user.uid),
          ])
          setSavedExperts(experts)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await signOutUser()
            router.replace("/welcome")
          } catch (error) {
            console.error("Error logging out:", error)
            Alert.alert("Error", "Failed to logout. Please try again.")
          }
        },
      },
    ])
  }

  const handleDeleteSavedExpert = async (expertId: string) => {
    try {
      await firestoreService.deleteDocument("savedExperts", expertId)
      setSavedExperts(savedExperts.filter((expert) => expert.id !== expertId))
    } catch (error) {
      console.error("Error deleting saved expert:", error)
      Alert.alert("Error", "Failed to remove expert from saved list")
    }
  }

  const handleChangePassword = () => {
    Alert.prompt(
      "Change Password",
      "Enter your current password",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Next",
          onPress: (currentPassword) => {
            if (!currentPassword) {
              Alert.alert("Error", "Current password is required")
              return
            }

            Alert.prompt(
              "New Password",
              "Enter your new password",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Next",
                  onPress: (newPassword) => {
                    if (!newPassword) {
                      Alert.alert("Error", "New password is required")
                      return
                    }

                    if (newPassword.length < 6) {
                      Alert.alert("Error", "Password must be at least 6 characters")
                      return
                    }

                    Alert.prompt(
                      "Confirm Password",
                      "Confirm your new password",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Change Password",
                          onPress: (confirmPassword) => {
                            if (newPassword !== confirmPassword) {
                              Alert.alert("Error", "Passwords do not match")
                              return
                            }

                            // Implement password change logic here
                            Alert.alert("Success", "Password changed successfully")
                          },
                        },
                      ],
                      "secure-text",
                    )
                  },
                },
              ],
              "secure-text",
            )
          },
        },
      ],
      "secure-text",
    )
  }

  const openPrivacyPolicy = () => {
    Linking.openURL("https://v0-revit-landing-page.vercel.app/privacy")
  }

  const openUserGuide = () => {
    Linking.openURL("https://v0-revit-landing-page.vercel.app/guide")
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileSection}>
        <View style={[styles.profileImageContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.profileImagePlaceholder}>{userData?.displayName?.charAt(0) || "U"}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{userData?.displayName || "User"}</Text>
        <Text style={[styles.userEmail, { color: colors.subtext }]}>{userData?.email || "user@example.com"}</Text>
        <TouchableOpacity
          style={[styles.editProfileButton, { borderColor: colors.border }]}
          onPress={() => router.push("/edit-profile")}
        >
          <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/payment-methods")}
        >
          <Ionicons name="card-outline" size={24} color={colors.primary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Payment Methods</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={openPrivacyPolicy}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/help-support")}
        >
          <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={openUserGuide}>
          <Ionicons name="book-outline" size={24} color={colors.primary} />
          <Text style={[styles.settingText, { color: colors.text }]}>User Guide</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
        </TouchableOpacity>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <Ionicons name="moon-outline" size={24} color={colors.primary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={handleChangePassword}
        >
          <Ionicons name="key-outline" size={24} color={colors.primary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
        </TouchableOpacity>
      </View>

      {savedExperts.length > 0 && (
        <View style={styles.savedExpertsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Saved Experts</Text>

          {savedExperts.map((expert) => (
            <View key={expert.id} style={[styles.savedExpertItem, { borderBottomColor: colors.border }]}>
              <View style={styles.expertInfo}>
                <Text style={[styles.expertName, { color: colors.text }]}>{expert.expertName}</Text>
                <Text style={[styles.expertProfession, { color: colors.subtext }]}>{expert.expertProfession}</Text>
              </View>
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: colors.error + "20" }]}
                onPress={() => handleDeleteSavedExpert(expert.id)}
              >
                <Ionicons name="close" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.error }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "500",
  },
  settingsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  savedExpertsSection: {
    marginTop: 24,
  },
  savedExpertItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: 16,
    fontWeight: "500",
  },
  expertProfession: {
    fontSize: 14,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    marginTop: 32,
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

