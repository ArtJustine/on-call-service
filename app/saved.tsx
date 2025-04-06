"use client"
import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Trash2 } from "react-native-feather"
import { useRouter } from "expo-router"
import ExpertCard from "../components/ExpertCard"
import { experts } from "../constants/Data"
import { useTheme } from "../context/ThemeContext"
import type { Expert } from "../types"

export default function SavedScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  // For demo purposes, we'll use state to manage saved experts
  const [savedExperts, setSavedExperts] = useState<Expert[]>([experts[0], experts[1]])

  const handleDeleteExpert = (expertId: string) => {
    Alert.alert("Remove Expert", "Are you sure you want to remove this expert from your saved list?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setSavedExperts(savedExperts.filter((expert) => expert.id !== expertId))
        },
      },
    ])
  }

  const renderExpertItem = ({ item }: { item: Expert }) => (
    <View style={styles.expertItemContainer}>
      <ExpertCard expert={item} />
      <TouchableOpacity style={[styles.deleteButton]} onPress={() => handleDeleteExpert(item.id)}>
        <Trash2 width={20} height={20} stroke={colors.error} />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Saved Experts</Text>
      </View>

      <View style={styles.content}>
        {savedExperts.length > 0 ? (
          <FlatList
            data={savedExperts}
            keyExtractor={(item) => item.id}
            renderItem={renderExpertItem}
            contentContainerStyle={styles.expertsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No saved experts</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
              Save your favorite experts for quick access
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textAlign: "center",
  },
  expertItemContainer: {
    position: "relative",
    marginBottom: 16,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "rgba(244, 67, 54, 0.2)",
  },
})

