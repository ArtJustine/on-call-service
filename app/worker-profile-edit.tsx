"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Camera } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"

export default function WorkerProfileEditScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [name, setName] = useState("Bob Worker")
  const [profession, setProfession] = useState("Mechanic")
  const [phone, setPhone] = useState("+63 912 345 6789")
  const [email, setEmail] = useState("bob.worker@example.com")
  const [address, setAddress] = useState("123 Main St, Angeles City")
  const [bio, setBio] = useState(
    "Experienced mechanic specializing in engine repairs and diagnostics with over 10 years of experience. Available for emergency repairs and regular maintenance.",
  )
  const [rate, setRate] = useState("300")

  const handleSave = () => {
    // Validate inputs
    if (!name.trim() || !profession.trim() || !phone.trim() || !email.trim() || !rate.trim()) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    // Save profile changes
    Alert.alert("Success", "Profile updated successfully", [{ text: "OK", onPress: () => router.back() }])
  }

  const handleChangePhoto = () => {
    Alert.alert("Change Photo", "Choose an option", [
      { text: "Take Photo", onPress: () => console.log("Take Photo") },
      { text: "Choose from Gallery", onPress: () => console.log("Choose from Gallery") },
      { text: "Cancel", style: "cancel" },
    ])
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveButton, { color: colors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.photoSection}>
          <View style={[styles.profileImage, { backgroundColor: colors.lightGray }]} />
          <TouchableOpacity
            style={[styles.changePhotoButton, { backgroundColor: colors.primary }]}
            onPress={handleChangePhoto}
          >
            <Camera width={20} height={20} stroke={colors.background} />
          </TouchableOpacity>
          <Text style={[styles.changePhotoText, { color: colors.primary }]}>Change Photo</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>Full Name *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.subtext}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>Profession *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={profession}
              onChangeText={setProfession}
              placeholder="Enter your profession"
              placeholderTextColor={colors.subtext}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>Phone Number *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.subtext}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>Email *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.subtext}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>Address</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              placeholderTextColor={colors.subtext}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>Rate (₱) *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={rate}
              onChangeText={setRate}
              placeholder="Enter your rate per job"
              placeholderTextColor={colors.subtext}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>Bio</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell clients about yourself and your services"
              placeholderTextColor={colors.subtext}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
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
  saveButton: {
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  photoSection: {
    alignItems: "center",
    padding: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changePhotoButton: {
    position: "absolute",
    top: 24 + 70, // Positioned at the bottom edge of the profile image
    right: "50%",
    marginRight: -50,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoText: {
    marginTop: 16,
  },
  formSection: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 120,
  },
})

