"use client"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Check, X } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"

// Mock data for worker responses
const workerResponses = [
  {
    id: "1",
    expertName: "John Doe",
    expertProfession: "Mechanic",
    serviceType: "meetup",
    paymentModel: "fixed",
    price: 300,
    date: "05/15/2023",
    time: "10:00 AM",
    status: "pending",
    description: "Need help with car engine repair",
  },
  {
    id: "2",
    expertName: "Jane Smith",
    expertProfession: "Electrician",
    serviceType: "visit",
    paymentModel: "hourly",
    price: 150,
    date: "05/18/2023",
    time: "2:30 PM",
    status: "accepted",
    description: "Electrical wiring installation for new room",
  },
  {
    id: "3",
    expertName: "Robert Johnson",
    expertProfession: "Plumber",
    serviceType: "meetup",
    paymentModel: "fixed",
    price: 250,
    date: "05/20/2023",
    time: "9:00 AM",
    status: "declined",
    description: "Fix leaking bathroom pipes",
  },
]

export default function WorkerResponsesScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return colors.success
      case "declined":
        return colors.error
      default:
        return colors.primary
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted"
      case "declined":
        return "Declined"
      default:
        return "Pending"
    }
  }

  const renderResponseItem = ({ item }: { item: (typeof workerResponses)[0] }) => (
    <View style={[styles.responseCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.responseHeader}>
        <View>
          <Text style={[styles.expertName, { color: colors.text }]}>{item.expertName}</Text>
          <Text style={[styles.expertProfession, { color: colors.subtext }]}>{item.expertProfession}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.responseDetails}>
        <Text style={[styles.detailLabel, { color: colors.subtext }]}>Service Type:</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>
          {item.serviceType === "meetup" ? "Expert comes to you" : "Visit expert location"}
        </Text>
      </View>

      <View style={styles.responseDetails}>
        <Text style={[styles.detailLabel, { color: colors.subtext }]}>Payment:</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>
          ₱{item.price}
          {item.paymentModel === "hourly" ? "/hour" : " fixed price"}
        </Text>
      </View>

      <View style={styles.responseDetails}>
        <Text style={[styles.detailLabel, { color: colors.subtext }]}>Schedule:</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>
          {item.date} at {item.time}
        </Text>
      </View>

      <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
        {item.description}
      </Text>

      {item.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.declineButton, { borderColor: colors.error }]}
            onPress={() => alert("Booking cancelled")}
          >
            <X width={16} height={16} stroke={colors.error} />
            <Text style={[styles.declineButtonText, { color: colors.error }]}>Cancel Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.messageButton, { backgroundColor: colors.primary }]}
            onPress={() => alert("Message sent")}
          >
            <Text style={[styles.messageButtonText, { color: colors.background }]}>Message</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === "accepted" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.messageButton, { backgroundColor: colors.primary }]}
            onPress={() => alert("Message sent")}
          >
            <Text style={[styles.messageButtonText, { color: colors.background }]}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: colors.success }]}
            onPress={() => alert("Booking confirmed")}
          >
            <Check width={16} height={16} stroke={colors.background} />
            <Text style={[styles.confirmButtonText, { color: colors.background }]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === "declined" && (
        <TouchableOpacity
          style={[styles.retryButton, { borderColor: colors.primary }]}
          onPress={() => alert("New request sent")}
        >
          <Text style={[styles.retryButtonText, { color: colors.primary }]}>Make New Request</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Service Requests</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={workerResponses}
        keyExtractor={(item) => item.id}
        renderItem={renderResponseItem}
        contentContainerStyle={styles.responsesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No service requests</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
              Your service requests and worker responses will appear here
            </Text>
          </View>
        }
      />
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
  responsesList: {
    padding: 16,
  },
  responseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  responseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  expertName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expertProfession: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  responseDetails: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    gap: 8,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  messageButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  retryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
})

