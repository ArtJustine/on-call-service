"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Lock, Eye, Shield, Trash2 } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"

export default function PrivacySecurityScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  // State for toggles
  const [biometricLogin, setBiometricLogin] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [locationTracking, setLocationTracking] = useState(true)
  const [dataSharing, setDataSharing] = useState(true)

  const handleChangePassword = () => {
    Alert.alert("Change Password", "You'll receive an email with instructions to change your password.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Send Email",
        onPress: () => Alert.alert("Success", "Password reset email sent!"),
      },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure you want to delete your account? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Account Deletion Requested",
            "Your account will be deleted within 30 days. You can cancel this request by logging in during this period.",
            [
              {
                text: "OK",
                onPress: () => router.push("/welcome"),
              },
            ],
          )
        },
      },
    ])
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Privacy & Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Security</Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleChangePassword}
          >
            <View style={styles.menuItemLeft}>
              <Lock width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Change Password</Text>
            </View>
            <ArrowLeft width={20} height={20} stroke={colors.subtext} style={{ transform: [{ rotate: "180deg" }] }} />
          </TouchableOpacity>

          <View style={[styles.toggleItem, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleItemLeft}>
              <Eye width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.toggleItemText, { color: colors.text }]}>Biometric Login</Text>
            </View>
            <Switch
              value={biometricLogin}
              onValueChange={setBiometricLogin}
              trackColor={{ false: colors.lightGray, true: colors.primary + "70" }}
              thumbColor={biometricLogin ? colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.toggleItem, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleItemLeft}>
              <Shield width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.toggleItemText, { color: colors.text }]}>Two-Factor Authentication</Text>
            </View>
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              trackColor={{ false: colors.lightGray, true: colors.primary + "70" }}
              thumbColor={twoFactorAuth ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy</Text>

          <View style={[styles.toggleItem, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleItemLeft}>
              <Lock width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.toggleItemText, { color: colors.text }]}>Location Tracking</Text>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              trackColor={{ false: colors.lightGray, true: colors.primary + "70" }}
              thumbColor={locationTracking ? colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.toggleItem, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleItemLeft}>
              <Shield width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.toggleItemText, { color: colors.text }]}>Data Sharing</Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: colors.lightGray, true: colors.primary + "70" }}
              thumbColor={dataSharing ? colors.primary : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => Alert.alert("Privacy Policy", "This would open the privacy policy.")}
          >
            <View style={styles.menuItemLeft}>
              <Lock width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <ArrowLeft width={20} height={20} stroke={colors.subtext} style={{ transform: [{ rotate: "180deg" }] }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => Alert.alert("Terms of Service", "This would open the terms of service.")}
          >
            <View style={styles.menuItemLeft}>
              <Shield width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Terms And Conditions</Text>
            </View>
            <ArrowLeft width={20} height={20} stroke={colors.subtext} style={{ transform: [{ rotate: "180deg" }] }} />
          </TouchableOpacity>
        </View>

        <View style={styles.dangerSection}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>

          <TouchableOpacity style={[styles.dangerButton, { borderColor: colors.error }]} onPress={handleDeleteAccount}>
            <Trash2 width={20} height={20} stroke={colors.error} />
            <Text style={[styles.dangerButtonText, { color: colors.error }]}>Delete Account</Text>
          </TouchableOpacity>

          <Text style={[styles.dangerText, { color: colors.subtext }]}>
            Deleting your account will remove all your data from our servers. This action cannot be undone.
          </Text>
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
    marginTop: 8,
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
    fontSize: 16,
    marginLeft: 12,
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  toggleItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  dangerSection: {
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 12,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dangerText: {
    fontSize: 14,
    textAlign: "center",
  },
})

