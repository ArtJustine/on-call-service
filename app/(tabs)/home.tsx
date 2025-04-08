"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CategoryList from "../../components/CategoryList"
import ExpertsList from "../../components/ExpertsList"
import SearchBar from "../../components/SearchBar"
import { categories } from "../../constants/Data"
import type { Category } from "../../types"
import { useTheme } from "../../context/ThemeContext"
import { useRouter } from "expo-router"
import { Bell, Filter } from "react-native-feather"

export default function HomeScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  const handleSearch = (text: string) => {
    setSearchQuery(text)
  }

  const handleScanQR = () => {
    alert("QR Scan functionality would be implemented here")
  }

  const handleNotifications = () => {
    router.push("/notifications")
  }

  const handleFilter = () => {
    alert("Filter functionality would be implemented here")
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Find Experts</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.lightGray }]} onPress={handleFilter}>
            <Filter width={20} height={20} stroke={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.lightGray }]}
            onPress={handleNotifications}
          >
            <Bell width={20} height={20} stroke={colors.text} />
            <View style={[styles.notificationBadge, { backgroundColor: colors.primary }]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SearchBar onSearch={handleSearch} onScanQR={handleScanQR} />

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <CategoryList categories={categories} onCategoryPress={handleCategoryPress} />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedCategory ? selectedCategory.name : "Popular Experts"}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <ExpertsList searchQuery={searchQuery} selectedCategory={selectedCategory} />
        </View>

        <View style={styles.featuredContainer}>
          <View style={[styles.featuredCard, { backgroundColor: colors.primary + "15" }]}>
            <View style={styles.featuredContent}>
              <Text style={[styles.featuredTitle, { color: colors.text }]}>Need help right away?</Text>
              <Text style={[styles.featuredSubtitle, { color: colors.subtext }]}>Connect with an expert instantly</Text>
              <TouchableOpacity
                style={[styles.featuredButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/instant-connect")}
              >
                <Text style={[styles.featuredButtonText, { color: colors.background }]}>Connect Now</Text>
              </TouchableOpacity>
            </View>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  featuredContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  featuredCard: {
    borderRadius: 12,
    padding: 20,
    overflow: "hidden",
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  featuredSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  featuredButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  featuredButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
})
