"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Bell, FileText, MapPin } from "react-native-feather"
import { useRouter } from "expo-router"
import { categories, experts, locations } from "../../constants/Data"
import type { Category, Expert, Location } from "../../types"
import LocationSelector from "../../components/LocationSelector"
import SearchBar from "../../components/SearchBar"
import CategoryItem from "../../components/CategoryItem"
import ExpertCard from "../../components/ExpertCard"
import { useTheme } from "../../context/ThemeContext"
import { getCurrentLocation } from "../../services/LocationService"

export default function HomeScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>(experts)
  const [userLocation, setUserLocation] = useState<string | null>(null)

  // Get user's current location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getCurrentLocation()
        if (location && location.city) {
          setUserLocation(location.city)

          // Find matching location in our predefined locations
          const matchedLocation = locations.find((loc) => loc.name.toLowerCase() === location.city?.toLowerCase())

          if (matchedLocation) {
            setSelectedLocation(matchedLocation)
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      }
    }

    fetchLocation()
  }, [])

  // Filter experts based on search query, selected category, and location
  useEffect(() => {
    const filtered = experts.filter((expert) => {
      // Filter by location
      if (selectedLocation && expert.location !== selectedLocation.name) {
        return false
      }

      // Filter by category
      if (selectedCategory && expert.profession !== selectedCategory.name) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        return (
          expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expert.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expert.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      return true
    })

    setFilteredExperts(filtered)
  }, [searchQuery, selectedCategory, selectedLocation])

  const handleSearch = (text: string) => {
    setSearchQuery(text)
  }

  const handleScanQR = () => {
    Alert.alert("QR Scanner", "QR Scanner would open here")
  }

  const handleCategoryPress = (category: Category) => {
    // If the same category is selected, deselect it
    if (selectedCategory && selectedCategory.id === category.id) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(category)
    }
  }

  const handleNotificationPress = () => {
    router.push("/notifications")
  }

  const handleServiceRequestsPress = () => {
    router.push("/worker-responses")
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <LocationSelector selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleServiceRequestsPress}>
            <FileText width={24} height={24} stroke={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleNotificationPress}>
            <Bell width={24} height={24} stroke={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        

        <SearchBar onSearch={handleSearch} onScanQR={handleScanQR} />

        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryItem
                category={item}
                onPress={handleCategoryPress}
                isSelected={selectedCategory?.id === item.id}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.expertsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedCategory ? `${selectedCategory.name} Experts` : "Top Experts"}
            </Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={[styles.clearFilter, { color: colors.primary }]}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => <ExpertCard key={expert.id} expert={expert} />)
          ) : (
            <View style={[styles.noExpertsContainer, { backgroundColor: colors.lightGray }]}>
              <Text style={[styles.noExpertsText, { color: colors.text }]}>No experts found</Text>
              <Text style={[styles.noExpertsSubtext, { color: colors.subtext }]}>
                Try changing your search criteria or location
              </Text>
            </View>
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
  headerButtons: {
    flexDirection: "row",
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  locationBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  clearFilter: {
    fontSize: 14,
  },
  categoriesList: {
    gap: 16,
  },
  expertsSection: {
    marginBottom: 24,
  },
  noExpertsContainer: {
    padding: 24,
    alignItems: "center",
    borderRadius: 8,
  },
  noExpertsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noExpertsSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
})

