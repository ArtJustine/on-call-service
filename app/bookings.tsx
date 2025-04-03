import { View, Text, StyleSheet, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Colors from "../constants/Colors"
import { bookings } from "../constants/Data"

export default function BookingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
      </View>

      <View style={styles.content}>
        {bookings.length > 0 ? (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.serviceName}>{item.service}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === "completed" ? styles.completedBadge : styles.upcomingBadge,
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.expertName}>Expert: {item.expertName}</Text>
                <Text style={styles.dateTime}>
                  {item.date} at {item.time}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.bookingsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No bookings yet</Text>
            <Text style={styles.emptyStateSubtext}>Your bookings will appear here once you schedule a service</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bookingsList: {
    paddingVertical: 16,
  },
  bookingCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: Colors.primary + "20", // 20% opacity
  },
  completedBadge: {
    backgroundColor: "#4CAF50" + "20", // 20% opacity
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  expertName: {
    fontSize: 14,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: "center",
  },
})

