"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Star, Phone, Mail, MapPin, Briefcase, Clock } from "react-native-feather"
import { useLocalSearchParams, useRouter } from "expo-router"
import { experts } from "../../constants/Data"
import { useTheme } from "../../context/ThemeContext"

export default function ExpertProfileScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()

  // Find the expert with the matching ID
  const expert = experts.find((e) => e.id === id)

  if (!expert) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft width={24} height={24} stroke={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Expert Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.subtext }]}>Expert not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const handleContact = () => {
    alert(`Contacting ${expert.name} at ${expert.contactNumber}`)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Expert Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.profileHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.lightGray }]} />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{expert.name}</Text>
          <Text style={[styles.profession, { color: colors.subtext }]}>{expert.profession}</Text>
          <View style={styles.ratingContainer}>
            <Star width={16} height={16} fill={colors.primary} stroke="none" />
            <Text style={[styles.rating, { color: colors.subtext }]}>{expert.rating} Rating</Text>
          </View>
        </View>

        <View style={[styles.infoSection, { borderBottomColor: colors.border }]}>
          <View style={styles.infoItem}>
            <MapPin width={20} height={20} stroke={colors.subtext} />
            <Text style={[styles.infoText, { color: colors.text }]}>{expert.location}</Text>
          </View>
          <View style={styles.infoItem}>
            <Briefcase width={20} height={20} stroke={colors.subtext} />
            <Text style={[styles.infoText, { color: colors.text }]}>{expert.experience} Experience</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock width={20} height={20} stroke={colors.subtext} />
            <Text style={[styles.infoText, { color: colors.text }]}>{expert.completedJobs} Jobs Completed</Text>
          </View>
        </View>

        <View style={[styles.descriptionSection, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.description, { color: colors.text }]}>{expert.description}</Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Phone width={20} height={20} stroke={colors.subtext} />
            <Text style={[styles.contactText, { color: colors.text }]}>{expert.contactNumber}</Text>
          </View>
          <View style={styles.contactItem}>
            <Mail width={20} height={20} stroke={colors.subtext} />
            <Text style={[styles.contactText, { color: colors.text }]}>{expert.email}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.secondary }]} onPress={handleContact}>
          <Text style={[styles.contactButtonText, { color: colors.background }]}>Contact</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profession: {
    fontSize: 16,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  descriptionSection: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  contactSection: {
    padding: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  contactText: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
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

