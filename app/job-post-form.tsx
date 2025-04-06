"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import * as Location from "expo-location"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"

const JobPostForm = () => {
  const { colors } = useTheme()
  const navigation = useNavigation()

  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [salary, setSalary] = useState("")
  const [userLocation, setUserLocation] = useState("")
  const [locationError, setLocationError] = useState("")

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setLocationError("Permission to access location was denied")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })

      if (address && address.length > 0) {
        setUserLocation(address[0].city || address[0].name || "Unknown Location")
      } else {
        setUserLocation("Location not found")
      }
    })()
  }, [])

  const handleSubmit = () => {
    if (!jobTitle || !jobDescription || !salary || !userLocation) {
      Alert.alert("Error", "Please fill in all fields.")
      return
    }

    // Basic validation for salary (should be a number)
    if (isNaN(Number.parseFloat(salary))) {
      Alert.alert("Error", "Salary must be a number.")
      return
    }

    // Here you would typically send the data to your backend
    const jobData = {
      jobTitle,
      jobDescription,
      salary,
      location: userLocation,
    }

    console.log("Job Data:", jobData)

    // For now, just navigate back
    navigation.goBack()
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>Job Title</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
        value={jobTitle}
        onChangeText={setJobTitle}
        placeholder="Enter job title"
        placeholderTextColor={colors.placeholder}
      />

      <Text style={[styles.label, { color: colors.text }]}>Job Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput, { backgroundColor: colors.inputBackground, color: colors.text }]}
        value={jobDescription}
        onChangeText={setJobDescription}
        placeholder="Enter job description"
        placeholderTextColor={colors.placeholder}
        multiline={true}
        numberOfLines={4}
      />

      <Text style={[styles.label, { color: colors.text }]}>Salary</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
        value={salary}
        onChangeText={setSalary}
        placeholder="Enter salary"
        placeholderTextColor={colors.placeholder}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: colors.text }]}>Location</Text>
      <View style={styles.locationContainer}>
        <Text style={[styles.locationValue, { color: colors.text }]}>{userLocation || "Detecting location..."}</Text>
        {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post Job</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationValue: {
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
})

export default JobPostForm

