"use client"

import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { registerUser, type UserRole } from "../services/AuthService"
import { useTheme } from "../context/ThemeContext"
import { getCurrentLocation } from "../services/LocationService"
import { Ionicons } from "@expo/vector-icons"

export default function SignupScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState<UserRole>("client")
  const [location, setLocation] = useState("")
  const [profession, setProfession] = useState("")
  const [experience, setExperience] = useState("")

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showProfessionOptions, setShowProfessionOptions] = useState(false)
  const [showExperienceOptions, setShowExperienceOptions] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Profession options
  const professionOptions = ["Plumber", "Electrician", "Carpenter", "Mechanic", "Painter", "Other"]

  // Experience options
  const experienceOptions = [
    "Entry Level (0-2 years)",
    "Intermediate (3-5 years)",
    "Experienced (6-10 years)",
    "Expert (10+ years)",
  ]

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

  // Validate form
  const validateForm = () => {
    // Reset error state
    setError(null)

    // Check required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields")
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return false
    }

    // Check password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    // Check terms acceptance
    if (!termsAccepted) {
      setError("You must agree to the terms and conditions")
      return false
    }

    // If worker role, check profession
    if (role === "worker" && !profession) {
      setError("Please select your profession")
      return false
    }

    // If worker role, check experience
    if (role === "worker" && !experience) {
      setError("Please select your experience level")
      return false
    }

    return true
  }

  const handleSignup = async () => {
    // Validate form
    if (!validateForm()) return

    setIsLoading(true)

    try {
      console.log("Starting registration process...")

      // Register user with all fields
      await registerUser(email, password, firstName, lastName, role, phoneNumber, location, profession, experience)

      console.log("Registration successful")

      Alert.alert("Success", "Your account has been created successfully!", [
        { text: "OK", onPress: () => router.push("/login") },
      ])
    } catch (error: any) {
      console.error("Registration error:", error)

      let errorMessage = "Failed to create account"

      // Extract Firebase error message
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use. Please try another email or login."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password."
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection and try again."
      } else if (error.code === "auth/configuration-not-found") {
        errorMessage = "Authentication service is not properly configured. Please contact support."
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.error + "15" }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

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

          <View style={styles.nameContainer}>
            <View style={styles.nameField}>
              <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="John"
                placeholderTextColor={colors.subtext}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.nameField}>
              <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="Doe"
                placeholderTextColor={colors.subtext}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

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

          <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="(123) 456-7890"
            placeholderTextColor={colors.subtext}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          {role === "worker" && (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Profession</Text>
              <TouchableOpacity
                style={[styles.selectInput, { borderColor: colors.border }]}
                onPress={() => setShowProfessionOptions(!showProfessionOptions)}
              >
                <Text style={{ color: profession ? colors.text : colors.subtext }}>
                  {profession || "Select your profession"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.subtext} />
              </TouchableOpacity>

              {showProfessionOptions && (
                <View style={[styles.optionsContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  {professionOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.optionItem}
                      onPress={() => {
                        setProfession(option)
                        setShowProfessionOptions(false)
                      }}
                    >
                      <Text style={{ color: colors.text }}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={[styles.label, { color: colors.text, marginTop: 15 }]}>Experience Level</Text>
              <TouchableOpacity
                style={[styles.selectInput, { borderColor: colors.border }]}
                onPress={() => setShowExperienceOptions(!showExperienceOptions)}
              >
                <Text style={{ color: experience ? colors.text : colors.subtext }}>
                  {experience || "Select your experience level"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.subtext} />
              </TouchableOpacity>

              {showExperienceOptions && (
                <View style={[styles.optionsContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  {experienceOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.optionItem}
                      onPress={() => {
                        setExperience(option)
                        setShowExperienceOptions(false)
                      }}
                    >
                      <Text style={{ color: colors.text }}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

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
          <Text style={[styles.passwordHint, { color: colors.subtext }]}>
            Password must be at least 8 characters long
          </Text>

          <Text style={[styles.label, { color: colors.text, marginTop: 10 }]}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, { borderColor: colors.border, color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor={colors.subtext}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                { borderColor: colors.primary },
                termsAccepted && { backgroundColor: colors.primary },
              ]}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              {termsAccepted && <Ionicons name="checkmark" size={16} color={colors.background} />}
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: colors.text }]}>
              I agree to the{" "}
              <Text
                style={[styles.termsLink, { color: colors.primary }]}
                onPress={() => Alert.alert("Terms", "Terms and conditions will be displayed here.")}
              >
                terms and conditions
              </Text>{" "}
              and{" "}
              <Text
                style={[styles.termsLink, { color: colors.primary }]}
                onPress={() => Alert.alert("Privacy", "Privacy policy will be displayed here.")}
              >
                privacy policy
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, { backgroundColor: colors.primary }, isLoading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.signupButtonText, { color: colors.background }]}>
                Create {role === "worker" ? "Professional" : ""} Account
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.subtext }]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  nameContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  nameField: {
    flex: 1,
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
  selectInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 5,
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
  passwordHint: {
    fontSize: 12,
    marginBottom: 15,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: "600",
  },
  signupButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
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

