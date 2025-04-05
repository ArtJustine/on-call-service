"use client"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"

// Dummy accounts
const dummyAccounts = {
  clients: [
    { email: "client@example.com", password: "password123", name: "John Client" },
    { email: "user@example.com", password: "password123", name: "Jane User" },
  ],
  workers: [
    { email: "worker@example.com", password: "password123", name: "Bob Worker", profession: "Mechanic" },
    { email: "expert@example.com", password: "password123", name: "Alice Expert", profession: "Electrician" },
  ],
}

export default function LoginScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState<"client" | "worker">("client")

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    // Check if the credentials match any dummy account
    const accounts = accountType === "client" ? dummyAccounts.clients : dummyAccounts.workers
    const account = accounts.find((acc) => acc.email === email && acc.password === password)

    if (account) {
      // In a real app, you would store the user session/token
      Alert.alert("Success", `Welcome back, ${account.name}!`, [
        {
          text: "Continue",
          onPress: () => {
            // Navigate to the appropriate home screen based on account type
            if (accountType === "client") {
              router.push("/(tabs)/home")
            } else {
              // For now, we'll navigate to the same home screen
              // In a real app, you would have a separate worker dashboard
              router.push("/worker-dashboard")
            }
          },
        },
      ])
    } else {
      Alert.alert("Error", "Invalid email or password")
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft width={24} height={24} stroke={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Login</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <View style={styles.welcomeSection}>
              <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome Back!</Text>
              <Text style={[styles.welcomeSubtext, { color: colors.subtext }]}>
                Please sign in to continue using our services
              </Text>
            </View>

            <View style={styles.accountTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  { borderColor: colors.border },
                  accountType === "client" && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setAccountType("client")}
              >
                <Text
                  style={[
                    styles.accountTypeText,
                    { color: accountType === "client" ? colors.background : colors.text },
                  ]}
                >
                  Client
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  { borderColor: colors.border },
                  accountType === "worker" && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setAccountType("worker")}
              >
                <Text
                  style={[
                    styles.accountTypeText,
                    { color: accountType === "worker" ? colors.background : colors.text },
                  ]}
                >
                  Service Provider
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <Mail width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Email"
                    placeholderTextColor={colors.subtext}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <Lock width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Password"
                  placeholderTextColor={colors.subtext}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    {showPassword ? (
                      <EyeOff width={20} height={20} stroke={colors.subtext} />
                    ) : (
                      <Eye width={20} height={20} stroke={colors.subtext} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary }]} onPress={handleLogin}>
              <Text style={[styles.loginButtonText, { color: colors.background }]}>Login</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: colors.subtext }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={[styles.signupLink, { color: colors.primary }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.demoAccountsContainer}>
              <Text style={[styles.demoAccountsTitle, { color: colors.text }]}>Demo Accounts:</Text>
              <Text style={[styles.demoAccountText, { color: colors.subtext }]}>
                Client: client@example.com / password123
              </Text>
              <Text style={[styles.demoAccountText, { color: colors.subtext }]}>
                Worker: worker@example.com / password123
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 24,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
  },
  accountTypeSelector: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  accountTypeButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  accountTypeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  demoAccountsContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  demoAccountsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  demoAccountText: {
    fontSize: 12,
    marginBottom: 4,
  },
})

