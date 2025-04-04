"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { MapPin } from "react-native-feather"
import { useTheme } from "../context/ThemeContext"
import { getCurrentLocation } from "../services/LocationService"

interface LocationSelectorProps {
  selectedLocation: { id: string; name: string }
  onSelectLocation: (location: { id: string; name: string }) => void
}

export default function LocationSelector({ selectedLocation, onSelectLocation }: LocationSelectorProps) {
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(true)

  // Get user's current location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoading(true)
        const location = await getCurrentLocation()
        if (location && location.city) {
          // Create a location object with the detected city
          const userLocation = {
            id: "current",
            name: location.city,
          }

          // Update the selected location
          onSelectLocation(userLocation)
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocation()
  }, [onSelectLocation])

  return (
    <View style={styles.container}>
      <MapPin width={20} height={20} stroke={colors.primary} />
      <Text style={[styles.locationText, { color: colors.text }]}>
        {isLoading ? "Detecting location..." : selectedLocation.name}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },
})

