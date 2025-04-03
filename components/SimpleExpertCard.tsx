import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Colors from "../constants/Colors"
import type { Expert } from "../types"

interface SimpleExpertCardProps {
  expert: Expert
}

export default function SimpleExpertCard({ expert }: SimpleExpertCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.name}>{expert.name}</Text>
            <Text style={styles.profession}>{expert.profession}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
        <Text style={styles.price}>{expert.price}</Text>
      </View>

      <Text style={styles.description}>"{expert.description}"</Text>

      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactButtonText}>Contact</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profession: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  price: {
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.darkGray,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  contactButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "500",
  },
})

