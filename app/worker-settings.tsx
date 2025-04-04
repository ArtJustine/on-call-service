"use client"
import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Bell, Globe, Moon, Shield, HelpCircle, LogOut } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"

export default function WorkerSettingsScreen() {
  const router = useRouter()
  const { colors, toggleTheme, isDark } = useTheme()
  const [notifications, setNotifications] = React.useState(true)
  const [locationServices, setLocationServices] = React.useState(true)
  const [availableForWork, setAvailableForWork] = React.useState(true)

  const handleLogout = () => {
    router.push("/welcome")
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Globe width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.settingText, { color: colors.text }]}>Available for Work</Text>
            </View>
            <Switch
              value={availableForWork}
              onValueChange={setAvailableForWork}
              trackColor={{ false: colors.lightGray, true: colors.primary + "70" }}
              thumbColor={availableForWork ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Moon width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.lightGray, true: colors.primary + "70" }}
              thumbColor={isDark ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.settingText, { color: colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.lightGray, true: colors.primary + "70" }}
              thumbColor={notifications ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Globe width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.settingText, { color: colors.text }]}>Location Services</Text>
            </View>
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: colors.lightGray, true: colors.primary + "70" }}
              thumbColor={locationServices ? colors.primary : "#f4f3f4"}
            />
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.settingText, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <ArrowLeft width={20} height={20} stroke={colors.subtext} style={{ transform: [{ rotate: "180deg" }] }} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <HelpCircle width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.settingText, { color: colors.text }]}>Help Center</Text>
            </View>
            <ArrowLeft width={20} height={20} stroke={colors.subtext} style={{ transform: [{ rotate: "180deg" }] }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <HelpCircle width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.settingText, { color: colors.text }]}>Contact Support</Text>
            </View>
            <ArrowLeft width={20} height={20} stroke={colors.subtext} style={{ transform: [{ rotate: "180deg" }] }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { borderColor: colors.error }]} onPress={handleLogout}>
          <LogOut width={20} height={20} stroke={colors.error} />
          <Text style={[styles.logoutButtonText, { color: colors.error }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.subtext }]}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
  },
})

