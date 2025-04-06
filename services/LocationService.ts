import * as Location from "expo-location"

// Interface for location data
export interface LocationData {
  latitude: number
  longitude: number
  city?: string
  region?: string
  country?: string
  formattedAddress?: string
}

// Get the current location of the user
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== "granted") {
      console.error("Permission to access location was denied")
      return null
    }

    // Get the current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })

    // Get the address information from coordinates
    const geocode = await reverseGeocode(location.coords.latitude, location.coords.longitude)

    // Get a nicely formatted address for display
    const formattedAddress = await getFormattedAddress(location.coords.latitude, location.coords.longitude)

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...geocode,
      formattedAddress,
    }
  } catch (error) {
    console.error("Error getting location:", error)
    return null
  }
}

// Reverse geocode coordinates to get address information
export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<{ city?: string; region?: string; country?: string }> => {
  try {
    const geocodeResult = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    })

    if (geocodeResult && geocodeResult.length > 0) {
      const address = geocodeResult[0]
      return {
        city: address.city,
        region: address.region,
        country: address.country,
      }
    }
    return {}
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    return {}
  }
}

// Calculate distance between two coordinates in kilometers
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

// Convert degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180)
}

// Filter workers by proximity to a location
export const filterWorkersByLocation = (
  workers: any[],
  userLocation: LocationData,
  maxDistance = 20, // Default max distance in kilometers
): any[] => {
  if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
    return workers
  }

  return workers.filter((worker) => {
    // Skip if worker doesn't have location data
    if (!worker.latitude || !worker.longitude) {
      return false
    }

    const distance = calculateDistance(userLocation.latitude, userLocation.longitude, worker.latitude, worker.longitude)

    return distance <= maxDistance
  })
}

// Add a new function to get a formatted address
export const getFormattedAddress = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const geocodeResult = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    })

    if (geocodeResult && geocodeResult.length > 0) {
      const address = geocodeResult[0]

      // Format the address based on available data
      if (address.city) {
        return address.city
      } else if (address.region) {
        return address.region
      } else if (address.subregion) {
        return address.subregion
      } else if (address.district) {
        return address.district
      } else {
        return "Unknown location"
      }
    }
    return "Unknown location"
  } catch (error) {
    console.error("Error getting formatted address:", error)
    return "Unknown location"
  }
}

