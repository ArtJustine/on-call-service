"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Star, Check, X, MessageCircle } from "react-native-feather"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useTheme } from "../../context/ThemeContext"

// Mock data for job post applicants
const initialApplicants = [
  {
    id: "1",
    name: "John Doe",
    profession: "Mechanic",
    rating: 4.8,
    experience: "10 years",
    price: "₱300",
    message: "I have extensive experience with car engine repairs and can help with your issue. Available at your preferred time.",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    profession: "Mechanic",
    rating: 4.5,
    experience: "7 years",
    price: "₱280",
    message: "I specialize in engine diagnostics and repairs. I can bring all necessary tools and parts.",
  },
  {
    id: "3",
    name: "Michael Brown",
    profession: "Mechanic",
    rating: 4.2,
    experience: "5 years",
    price: "₱250",
    message: "I can help with your car engine problem. I've worked on similar issues many times before.",
  }
]

export default function JobPostApplicantsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [applicants, setApplicants] = useState(initialApplicants)

  const handleHire = (applicantId: string) => {
    const applicant = applicants.find(a => a.id === applicantId)
    if (applicant) {
      Alert.alert(
        "Hire Confirmation",
        `Are you sure you want to hire ${applicant.name}?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Confirm",
            onPress: () => {
              // Remove applicant from list
              setApplicants(current => current.filter(a => a.id !== applicantId))
              
              Alert.alert(
                "Expert Hired",
                `You have successfully hired ${applicant.name}. They will be notified about your decision.`,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      if (applicants.length <= 1) {
                        router.push("/(tabs)/bookings")
                      }
                    }
                  }
                ]
              )
            }
          }
        ]
      )
    }
  }

  const handleDecline = (applicantId: string) => {
    const applicant = applicants.find(a => a.id === applicantId)
    if (applicant) {
      Alert.alert(
        "Decline Confirmation",
        `Are you sure you want to decline ${applicant.name}'s application?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Decline",
            style: "destructive",
            onPress: () => {
              // Remove applicant from list
              setApplicants(current => current.filter(a => a.id !== applicantId))
              
              Alert.alert("Application Declined", "The applicant has been notified about your decision")
            }
          }
        ]
      )
    }
  }

  const handleMessage = (applicantId: string) => {
    router.push(`/chat/${applicantId}`)
  }

  const renderApplicantItem = ({ item }: { item: typeof initialApplicants[0] }) => (
    <View style={[styles.applicantCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.applicantHeader}>
        <View style={styles.applicantInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.lightGray }]} />
          <View>
            <Text style={[styles.applicantName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.applicantProfession, { color: colors.subtext }]}>{item.profession}</Text>
            <View style={styles.ratingContainer}>
              <Star width={16} height={16} fill={colors.primary} stroke="none" />
              <Text style={[styles.ratingText, { color: colors.subtext }]}>{item.rating}</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.applicantPrice, { color: colors.primary }]}>{item.price}</Text>
      </View>

      <View style={styles.applicantDetails}>
        <Text style={[styles.experienceText, { color: colors.text }]}>Experience: {item.experience}</Text>
        <Text style={[styles.messageLabel, { color: colors.text }]}>Message:</Text>
        <Text style={[styles.messageText, { color: colors.subtext }]}>{item.message}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.messageButton, { backgroundColor: colors.primary + "20" }]}
          onPress={() => handleMessage(item.id)}
        >
          <MessageCircle width={20} height={20} stroke={colors.primary} />
          <Text style={[styles.messageButtonText, { color: colors.primary }]}>Message</Text>
        </TouchableOpacity>
        
        <View style={styles.hireDeclineContainer}>
          <TouchableOpacity 
            style={[styles.declineButton, { borderColor: colors.error }]}
            onPress={() => handleDecline(item.id)}
          >
            <X width={16} height={16} stroke={colors.error} />
            <Text style={[styles.declineButtonText, { color: colors.error }]}>Decline</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.hireButton, { backgroundColor: colors.success }]}
            onPress={() => handleHire(item.id)}
          >
            <Check width={16} height={16} stroke={colors.background} />
            <Text style={[styles.hireButtonText, { color: colors.background }]}>Hire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Applicants</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={applicants}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicantItem}
        contentContainerStyle={styles.applicantsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No applicants yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
              Check back later for applicants to your job post
            </Text>
          </View>
        }
      />
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
  applicantsList: {
    padding: 16,
  },
  applicantCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  applicantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  applicantInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  applicantProfession: {
    fontSize: 14,
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
  },
  applicantPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  applicantDetails: {
    marginBottom: 16,
  },
  experienceText: {
    fontSize: 14,
    marginBottom: 8,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  hireDeclineContainer: {
    flexDirection: "row",
    gap: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 8,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  hireButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    gap: 8,
  },
  hireButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
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
})

