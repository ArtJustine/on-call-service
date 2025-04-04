"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, MessageCircle, Star, X } from "react-native-feather"
import { useLocalSearchParams, useRouter } from "expo-router"
import { bookings, experts } from "../../constants/Data"
import { useTheme } from "../../context/ThemeContext"

export default function BookingDetailsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()

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
          <Text style={[styles.title, { color: colors.text }]}>Booking Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.subtext }]}>Booking not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const handleCancelBooking = () => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: () => {
          Alert.alert("Booking Cancelled", "Your booking has been cancelled successfully", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ])
        },
      },
    ])
  }

  const handleContactExpert = () => {
    router.push(`/chat/${expert.id}`)
  }

  const handleRateService = () => {
    if (booking.status === "completed") {
      router.push(`/rate-service/${booking.id}`)
    } else {
      Alert.alert("Not Completed", "You can only rate services that have been completed")
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Booking Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.bookingCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.bookingHeader}>
            <Text style={[styles.serviceName, { color: colors.text }]}>{booking.service}</Text>
            <View
              style={[
                styles.statusBadge,
                booking.status === "completed"
                  ? [styles.completedBadge, { backgroundColor: colors.success + "20" }]
                  : [styles.upcomingBadge, { backgroundColor: colors.primary + "20" }],
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: booking.status === "completed" ? colors.success : colors.primary,
                  },
                ]}
              >
                {booking.status}
              </Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <Calendar width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.detailText, { color: colors.text }]}>{booking.date}</Text>
            </View>

            <View style={styles.detailItem}>
              <Clock width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.detailText, { color: colors.text }]}>{booking.time}</Text>
            </View>

            <View style={styles.detailItem}>
              <MapPin width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.detailText, { color: colors.text }]}>{expert.location}</Text>
            </View>

            <View style={styles.detailItem}>
              <DollarSign width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.detailText, { color: colors.text }]}>{expert.price}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.expertSection, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Provider</Text>

          <View style={styles.expertInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.lightGray }]} />
            <View style={styles.expertDetails}>
              <Text style={[styles.expertName, { color: colors.text }]}>{expert.name}</Text>
              <Text style={[styles.expertProfession, { color: colors.subtext }]}>{expert.profession}</Text>
              <View style={styles.ratingContainer}>
                <Star width={16} height={16} fill={colors.primary} stroke="none" />
                <Text style={[styles.ratingText, { color: colors.subtext }]}>{expert.rating}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleContactExpert}
          >
            <MessageCircle width={20} height={20} stroke={colors.background} />
            <Text style={[styles.actionButtonText, { color: colors.background }]}>Contact Expert</Text>
          </TouchableOpacity>

          {booking.status === "upcoming" ? (
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.error }]}
              onPress={handleCancelBooking}
            >
              <X width={20} height={20} stroke={colors.error} />
              <Text style={[styles.cancelButtonText, { color: colors.error }]}>Cancel Booking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.rateButton,
                {
                  backgroundColor: booking.status === "completed" ? colors.success : colors.lightGray,
                  opacity: booking.status === "completed" ? 1 : 0.6,
                },
              ]}
              onPress={handleRateService}
              disabled={booking.status !== "completed"}
            >
              <Star width={20} height={20} stroke={colors.background} />
              <Text style={[styles.rateButtonText, { color: colors.background }]}>Rate Service</Text>
            </TouchableOpacity>
          )}
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
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
  },
  bookingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    // Color applied dynamically
  },
  completedBadge: {
    // Color applied dynamically
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  detailsSection: {
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 16,
  },
  expertSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  expertInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  expertDetails: {
    flex: 1,
  },
  expertName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  expertProfession: {
    fontSize: 14,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  rateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  rateButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
})

