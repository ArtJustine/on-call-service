"use client"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"
import AppLogo from "../components/AppLogo"

export default function WelcomeScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* Keeping the logo on the welcome screen */}
          <AppLogo size="large" showText={false} />
          <Text style={[styles.tagline, { color: colors.subtext }]}>Expert help, just a tap away</Text>
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.featureText, { color: colors.text }]}>Find skilled professionals near you</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.featureText, { color: colors.text }]}>Book services at your convenience</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.featureText, { color: colors.text }]}>Secure payments and verified experts</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/login")}
          >
            <Text style={[styles.loginButtonText, { color: colors.background }]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signupButton, { borderColor: colors.primary }]}
            onPress={() => router.push("/signup")}
          >
            <Text style={[styles.signupButtonText, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
  },
  featureList: {
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 40,
    gap: 16,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signupButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
})

