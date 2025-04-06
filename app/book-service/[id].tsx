"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Calendar, Clock, MessageCircle } from "react-native-feather"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useTheme } from "../../context/ThemeContext"
import { experts } from "../../constants/Data"
import ServiceTypeSelector, { type ServiceType } from "../../components/ServiceTypeSelector"
import PaymentModelSelector, { type PaymentModel } from "../../components/PaymentModelSelector"
import PriceOfferModal from "../../components/PriceOfferModal"
import { getCurrentLocation } from "../../services/LocationService"
import { createPaymentIntent, confirmPayment } from "../../services/PaymentService"
import { firestore } from "../../services/FirebaseService"

export default function BookServiceScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()

  // Find the expert with the matching ID
  const expert = experts.find((e) => e.id === id)

  const [serviceType, setServiceType] = useState<ServiceType>("meetup")
  const [paymentModel, setPaymentModel] = useState<PaymentModel>("fixed")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [offeredPrice, setOfferedPrice] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Get user's current location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getCurrentLocation()
        if (location && location.city) {
          setUserLocation(location.city)
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      }
    }

    fetchLocation()
  }, [])

  if (!expert) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft width={24} height={24} stroke={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Book Service</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.subtext }]}>Expert not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const handleSubmitOffer = (price: number) => {
    setOfferedPrice(price)
    setShowPriceModal(false)
  }

  const handleBookService = async () => {
    if (!date || !time || !description || !offeredPrice) {
      Alert.alert("Missing Information", "Please fill in all fields and set a price offer.")
      return
    }

    try {
      setIsProcessingPayment(true)

      // Create a booking document in Firestore
      const bookingData = {
        expertId: expert.id,
        expertName: expert.name,
        service: expert.profession,
        serviceType,
        paymentModel,
        price: offeredPrice,
        date,
        time,
        description,
        location: userLocation || expert.location,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      const bookingId = await firestore.createDocument("bookings", bookingData)

      if (!bookingId) {
        throw new Error("Failed to create booking")
      }

      // Create a payment intent with Stripe
      const paymentIntent = await createPaymentIntent(offeredPrice * 100) // Convert to cents

      if (!paymentIntent) {
        throw new Error("Failed to create payment intent")
      }

      // In a real app, you would now show a payment sheet to collect payment details
      // For this demo, we'll simulate a successful payment
      const paymentSuccess = await confirmPayment(paymentIntent.id, "pm_card_visa")

      if (!paymentSuccess) {
        throw new Error("Payment failed")
      }

      // Update booking status to "upcoming" after successful payment
      await firestore.updateDocument("bookings", bookingId, {
        status: "upcoming",
        paymentIntentId: paymentIntent.id,
        paidAt: new Date().toISOString(),
      })

      setIsProcessingPayment(false)

      // Show success message and navigate back
      Alert.alert(
        "Booking Request Sent",
        `Your ${paymentModel === "hourly" ? "hourly rate" : "fixed price"} offer of ₱${offeredPrice}${paymentModel === "hourly" ? "/hour" : ""} has been sent to ${expert.name}. You'll be notified when they respond.`,
        [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/bookings"),
          },
        ],
      )
    } catch (error) {
      setIsProcessingPayment(false)
      console.error("Booking error:", error)
      Alert.alert("Error", "There was a problem processing your booking. Please try again.")
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Book Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.expertCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.expertInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.lightGray }]} />
            <View>
              <Text style={[styles.expertName, { color: colors.text }]}>{expert.name}</Text>
              <Text style={[styles.expertProfession, { color: colors.subtext }]}>{expert.profession}</Text>
              {userLocation && <Text style={[styles.locationText, { color: colors.primary }]}>{userLocation}</Text>}
            </View>
          </View>
          <Text style={[styles.expertPrice, { color: colors.primary }]}>{expert.price}</Text>
        </View>

        <ServiceTypeSelector selectedType={serviceType} onSelectType={setServiceType} />

        <PaymentModelSelector selectedModel={paymentModel} onSelectModel={setPaymentModel} />

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Schedule</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Calendar width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.label, { color: colors.text }]}>Date</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={date}
              onChangeText={setDate}
              placeholder="Select date (MM/DD/YYYY)"
              placeholderTextColor={colors.subtext}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Clock width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.label, { color: colors.text }]}>Time</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={time}
              onChangeText={setTime}
              placeholder="Select time (HH:MM AM/PM)"
              placeholderTextColor={colors.subtext}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Job Details</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <MessageCircle width={20} height={20} stroke={colors.subtext} />
              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            </View>
            <TextInput
              style={[
                styles.textArea,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what you need help with..."
              placeholderTextColor={colors.subtext}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Offer</Text>

          {offeredPrice ? (
            <View style={[styles.priceDisplay, { backgroundColor: colors.primary + "10" }]}>
              <Text style={[styles.priceDisplayText, { color: colors.text }]}>
                Your offer: ₱{offeredPrice}
                {paymentModel === "hourly" ? "/hour" : ""}
              </Text>
              <TouchableOpacity onPress={() => setShowPriceModal(true)}>
                <Text style={[styles.changeOfferText, { color: colors.primary }]}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.setPriceButton, { borderColor: colors.primary }]}
              onPress={() => setShowPriceModal(true)}
            >
              <Text style={[styles.setPriceButtonText, { color: colors.primary }]}>Set Price Offer</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            { backgroundColor: colors.primary },
            (!date || !time || !description || !offeredPrice || isProcessingPayment) && { opacity: 0.6 },
          ]}
          onPress={handleBookService}
          disabled={!date || !time || !description || !offeredPrice || isProcessingPayment}
        >
          <Text style={[styles.bookButtonText, { color: colors.background }]}>
            {isProcessingPayment ? "Processing..." : "Send Booking Request"}
          </Text>
        </TouchableOpacity>
      </View>

      {expert && (
        <PriceOfferModal
          visible={showPriceModal}
          onClose={() => setShowPriceModal(false)}
          onSubmit={handleSubmitOffer}
          paymentModel={paymentModel}
          expert={expert}
        />
      )}
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
  expertCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  expertInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  expertName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expertProfession: {
    fontSize: 14,
  },
  locationText: {
    fontSize: 12,
    marginTop: 4,
  },
  expertPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
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
    minHeight: 100,
  },
  priceSection: {
    marginBottom: 24,
  },
  setPriceButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  setPriceButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  priceDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
  },
  priceDisplayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  changeOfferText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  bookButton: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
})

