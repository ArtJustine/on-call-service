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
import { ArrowLeft, User, Mail, Lock, Phone, Briefcase, MapPin, Calendar, Eye, EyeOff } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"
import { categories } from "../constants/Data"

export default function SignupScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [accountType, setAccountType] = useState<"client" | "worker">("client")
  const [showPassword, setShowPassword] = useState(false)

  // Form fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")

  // Worker-specific fields
  const [profession, setProfession] = useState("")
  const [experience, setExperience] = useState("")
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false)

  const handleSignup = () => {
    // Basic validation
    if (!fullName || !email || !phone || !password) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    if (accountType === "worker" && !profession) {
      Alert.alert("Error", "Please select your profession")
      return
    }

    // In a real app, you would send this data to your backend
    Alert.alert("Account Created", `Your ${accountType} account has been created successfully!`, [
      {
        text: "Continue",
        onPress: () => {
          // Navigate to login screen
          router.push("/login")
        },
      },
    ])
  }

  const selectProfession = (profession: string) => {
    setProfession(profession)
    setShowProfessionDropdown(false)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft width={24} height={24} stroke={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Sign Up</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeText, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.welcomeSubtext, { color: colors.subtext }]}>
              Join our community and start using our services
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
                style={[styles.accountTypeText, { color: accountType === "client" ? colors.background : colors.text }]}
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
                style={[styles.accountTypeText, { color: accountType === "worker" ? colors.background : colors.text }]}
              >
                Service Provider
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
                <User width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Full Name"
                  placeholderTextColor={colors.subtext}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
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

            {/* Phone */}
            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
                <Phone width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Phone Number"
                  placeholderTextColor={colors.subtext}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
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

            {/* Address */}
            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
                <MapPin width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Address"
                  placeholderTextColor={colors.subtext}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </View>

            {/* Worker-specific fields */}
            {accountType === "worker" && (
              <>
                {/* Profession */}
                <View style={styles.inputGroup}>
                  <View
                    style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                  >
                    <Briefcase width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setShowProfessionDropdown(!showProfessionDropdown)}
                    >
                      <Text style={[styles.dropdownButtonText, { color: profession ? colors.text : colors.subtext }]}>
                        {profession || "Select Profession"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {showProfessionDropdown && (
                    <View
                      style={[styles.dropdownMenu, { backgroundColor: colors.background, borderColor: colors.border }]}
                    >
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                        {categories.map((category) => (
                          <TouchableOpacity
                            key={category.id}
                            style={[styles.dropdownItem, { borderBottomColor: colors.border }]}
                            onPress={() => selectProfession(category.name)}
                          >
                            <Text style={[styles.dropdownItemText, { color: colors.text }]}>{category.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Experience */}
                <View style={styles.inputGroup}>
                  <View
                    style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                  >
                    <Calendar width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Years of Experience"
                      placeholderTextColor={colors.subtext}
                      value={experience}
                      onChangeText={setExperience}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity style={[styles.signupButton, { backgroundColor: colors.primary }]} onPress={handleSignup}>
            <Text style={[styles.signupButtonText, { color: colors.background }]}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.subtext }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
            </TouchableOpacity>
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
    marginBottom: 24,
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
  dropdownButton: {
    flex: 1,
    paddingVertical: 12,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  signupButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
})

