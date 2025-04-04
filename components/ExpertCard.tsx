"use client"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Check, Star } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"
import type { Expert } from "../types"

interface ExpertCardProps {
  expert: Expert
}

export default function ExpertCard({ expert }: ExpertCardProps) {
  const router = useRouter()
  const { colors } = useTheme()

  const handleContact = () => {
    router.push(`/book-service/${expert.id}`)
  }

  const handleCardPress = () => {
    router.push(`/expert/${expert.id}`)
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
      onPress={handleCardPress}
    >
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.lightGray }]} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.name, { color: colors.text }]}>{expert.name}</Text>
            <Text style={[styles.profession, { color: colors.subtext }]}>{expert.profession}</Text>
            <Text style={[styles.location, { color: colors.subtext }]}>{expert.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.badgeContainer}>
          {expert.verified && (
            <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
              <Check width={12} height={12} stroke="#FFFFFF" />
            </View>
          )}
          <Text style={[styles.verifiedText, { color: colors.subtext }]}>
            {expert.verified ? "Verified" : "Unverified"}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Star width={16} height={16} fill={colors.primary} stroke="none" />
          <Text style={[styles.rating, { color: colors.text }]}>{expert.rating}</Text>
        </View>
        <Text style={[styles.price, { color: colors.text }]}>{expert.price}</Text>
      </View>

      <Text style={[styles.description, { color: colors.subtext }]} numberOfLines={3}>
        "{expert.description}"
      </Text>

      <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.secondary }]} onPress={handleContact}>
        <Text style={[styles.contactButtonText, { color: colors.background }]}>Book Service</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profession: {
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
})

