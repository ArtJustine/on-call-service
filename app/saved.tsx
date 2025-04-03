import { View, Text, StyleSheet, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Colors from "../constants/Colors"
import ExpertCard from "../components/ExpertCard"
import { experts } from "../constants/Data"

// For demo purposes, we'll just show the first expert as saved
const savedExperts = [experts[0]]

export default function SavedScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Experts</Text>
      </View>

      <View style={styles.content}>
        {savedExperts.length > 0 ? (
          <FlatList
            data={savedExperts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ExpertCard expert={item} />}
            contentContainerStyle={styles.expertsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No saved experts</Text>
            <Text style={styles.emptyStateSubtext}>Save your favorite experts for quick access</Text>
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
  expertsList: {
    paddingVertical: 16,
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

