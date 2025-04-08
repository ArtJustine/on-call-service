"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { signInUser } from "../services/AuthService"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { getCurrentLocation, getLastKnownLocation } from "../services/LocationService"

export default function LoginScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationStatus, setLocationStatus] = useState<string | null>(null)

  const handleLogin = async () => {
    // Reset error state
    setError(null)

    // Validate inputs
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      console.log("Attempting to sign in...")
      const userData = await signInUser(email, password)

      if (!userData) {
        setError("User data not found. Please try again or create a new account.")
        setIsLoading(false)
        return
      }

      console.log("Login successful, user role:", userData.role)

      // Get location after successful login
      setLocationStatus("Getting your location...")

      // Try to get current location with a 10-second timeout
      let location = null
      try {
        location = await getCurrentLocation(10000)
      } catch (locationError) {
        console.error("Error getting current location:", locationError)
      }

      // If current location fails, try to get last known location
      if (!location) {
        console.log("Current location failed, trying last known location")
        try {
          location = await getLastKnownLocation()
        } catch (locationError) {
          console.error("Error getting last known location:", locationError)
        }
      }

      // Clear location status
      setLocationStatus(null)

      // Store location in user context or state management if needed
      // For example: updateUserLocation(location)

      // Navigate based on user role - proceed even if location fails
      if (userData.role === "worker") {
        router.replace("/worker-dashboard")
      } else {
        router.replace("/(tabs)/home")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      let errorMessage = "Failed to sign in"

      // Extract Firebase error message
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address"
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later"
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection and try again"
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
      setLocationStatus(null)
    }
  }

  const handleForgotPassword = () => {
    router.push("/forgot-password")
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>Sign in to continue</Text>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.error + "15" }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="john.doe@example.com"
            placeholderTextColor={colors.subtext}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: colors.text, marginTop: 15 }]}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, { borderColor: colors.border, color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.background} />
                {locationStatus && (
                  <Text style={[styles.locationStatus, { color: colors.background }]}>{locationStatus}</Text>
                )}
              </View>
            ) : (
              <Text style={[styles.loginButtonText, { color: colors.background }]}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: colors.subtext }]}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={[styles.signupLink, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  locationStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 5,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
  },
})
