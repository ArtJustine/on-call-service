"use client"

import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { registerUser, type UserRole } from "../services/AuthService"
import { useTheme } from "../context/ThemeContext"
import { getCurrentLocation } from "../services/LocationService"

export default function SignupScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState<UserRole>("client")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Get user's location on component mount
  React.useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationData = await getCurrentLocation()
        if (locationData && locationData.city) {
          setLocation(locationData.city)
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      }
    }

    fetchLocation()
  }, [])

  const handleSignup = async () => {
    // Validate inputs
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await registerUser(email, password, displayName, role, phoneNumber, location)
      Alert.alert("Success", "Your account has been created successfully!", [
        { text: "OK", onPress: () => router.push("/login") },
      ])
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>

      <View style={styles.form}>
        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "client" && { backgroundColor: colors.primary },
              { borderColor: colors.primary },
            ]}
            onPress={() => setRole("client")}
          >
            <Text style={[styles.roleButtonText, { color: role === "client" ? colors.background : colors.primary }]}>
              Client
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "worker" && { backgroundColor: colors.primary },
              { borderColor: colors.primary },
            ]}
            onPress={() => setRole("worker")}
          >
            <Text style={[styles.roleButtonText, { color: role === "worker" ? colors.background : colors.primary }]}>
              Service Provider
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Full Name"
          placeholderTextColor={colors.subtext}
          value={displayName}
          onChangeText={setDisplayName}
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Email"
          placeholderTextColor={colors.subtext}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Phone Number"
          placeholderTextColor={colors.subtext}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Password"
          placeholderTextColor={colors.subtext}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Confirm Password"
          placeholderTextColor={colors.subtext}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={styles.locationContainer}>
          <Text style={[styles.locationLabel, { color: colors.subtext }]}>Your Location:</Text>
          <Text style={[styles.locationValue, { color: colors.text }]}>{location || "Detecting location..."}</Text>
        </View>

        <TouchableOpacity
          style={[styles.signupButton, { backgroundColor: colors.primary }, isLoading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.signupButtonText, { color: colors.background }]}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.subtext }]}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  roleSelector: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  roleButtonText: {
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  signupButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 5,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
})

