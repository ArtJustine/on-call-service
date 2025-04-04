"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Star } from "react-native-feather"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useTheme } from "../../context/ThemeContext"
import { bookings, experts } from "../../constants/Data"

export default function RateServiceScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  // Find the booking with the matching ID
  const booking = bookings.find((b) => b.id === id)

  // Find the expert associated with this booking
  const expert = experts.find((e) => e.id === booking?.expertId)

  if (!booking || !expert) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft width={24} height={24} stroke={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Rate Service</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.subtext }]}>Booking not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating")
      return
    }

    Alert.alert("Thank You", "Your rating has been submitted successfully!", [
      {
        text: "OK",
        onPress: () => router.push("/(tabs)/bookings"),
      },
    ])
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starContainer}>
          <Star width={36} height={36} fill={i <= rating ? colors.primary : "none"} stroke={colors.primary} />
        </TouchableOpacity>,
      )
    }
    return stars
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Rate Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.serviceInfo}>
          <Text style={[styles.serviceName, { color: colors.text }]}>{booking.service}</Text>
          <Text style={[styles.expertName, { color: colors.subtext }]}>by {expert.name}</Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={[styles.ratingTitle, { color: colors.text }]}>How would you rate this service?</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
          <Text style={[styles.ratingDescription, { color: colors.subtext }]}>
            {rating === 1
              ? "Poor"
              : rating === 2
                ? "Fair"
                : rating === 3
                  ? "Good"
                  : rating === 4
                    ? "Very Good"
                    : rating === 5
                      ? "Excellent"
                      : "Tap a star to rate"}
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={[styles.reviewTitle, { color: colors.text }]}>Write a review (optional)</Text>
          <View
            style={[styles.reviewInputContainer, { backgroundColor: colors.lightGray, borderColor: colors.border }]}
          >
            <TextInput
              style={[styles.reviewInput, { color: colors.text }]}
              placeholder="Share your experience with this service..."
              placeholderTextColor={colors.subtext}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmitRating}
        >
          <Text style={[styles.submitButtonText, { color: colors.background }]}>Submit Rating</Text>
        </TouchableOpacity>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
  },
  serviceInfo: {
    alignItems: "center",
    marginBottom: 32,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  expertName: {
    fontSize: 16,
  },
  ratingSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  starContainer: {
    padding: 4,
  },
  ratingDescription: {
    fontSize: 16,
  },
  reviewSection: {
    marginBottom: 32,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  reviewInputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  reviewInput: {
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
})

