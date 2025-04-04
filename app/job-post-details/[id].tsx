"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  ArrowLeft,
  Star,
  Check,
  X,
  MessageCircle,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  AlertTriangle,
} from "react-native-feather"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useTheme } from "../../context/ThemeContext"

// Mock data for job post details
const jobPostsData = [
  {
    id: "1",
    service: "Car Engine Repair",
    budget: "₱250 - ₱350",
    date: "05/20/2023",
    time: "Flexible",
    isUrgent: true,
    description:
      "Need help with car engine that won't start. Possibly battery or starter issue. I've tried jumping the battery but it still won't start. The car is a 2015 Toyota Corolla. Looking for someone who can diagnose and fix the issue at my location.",
    status: "active",
    applicants: 3,
    location: "Angeles City",
    postedOn: "05/15/2023",
  },
  {
    id: "2",
    service: "Plumbing Repair",
    budget: "₱200 - ₱300",
    date: "05/25/2023",
    time: "Morning",
    isUrgent: false,
    description:
      "Leaking pipe under kitchen sink needs repair. The leak is getting worse and causing water damage. Need someone experienced with household plumbing repairs.",
    status: "active",
    applicants: 1,
    location: "Manila",
    postedOn: "05/18/2023",
  },
]

// Mock data for job post applicants
const applicantsData = {
  "1": [
    {
      id: "1",
      name: "John Doe",
      profession: "Mechanic",
      rating: 4.8,
      experience: "10 years",
      price: "₱300",
      message:
        "I have extensive experience with car engine repairs and can help with your issue. Available at your preferred time.",
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
    },
  ],
  "2": [
    {
      id: "4",
      name: "Robert Johnson",
      profession: "Plumber",
      rating: 4.7,
      experience: "8 years",
      price: "₱250",
      message: "I can fix your leaking pipe quickly. I have all the necessary tools and parts.",
    },
  ],
}

export default function JobPostDetailsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [jobPost, setJobPost] = useState<any>(null)
  const [applicants, setApplicants] = useState<any[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const post = jobPostsData.find((post) => post.id === id)
    if (post) {
      setJobPost(post)
      setApplicants(applicantsData[id as keyof typeof applicantsData] || [])
    }
  }, [id])

  const handleHire = (applicantId: string) => {
    const applicant = applicants.find((a) => a.id === applicantId)
    if (applicant) {
      Alert.alert("Hire Confirmation", `Are you sure you want to hire ${applicant.name}?`, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            // Remove applicant from list
            setApplicants((current) => current.filter((a) => a.id !== applicantId))

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
                  },
                },
              ],
            )
          },
        },
      ])
    }
  }

  const handleDecline = (applicantId: string) => {
    const applicant = applicants.find((a) => a.id === applicantId)
    if (applicant) {
      Alert.alert("Decline Confirmation", `Are you sure you want to decline ${applicant.name}'s application?`, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Decline",
          style: "destructive",
          onPress: () => {
            // Remove applicant from list
            setApplicants((current) => current.filter((a) => a.id !== applicantId))

            Alert.alert("Application Declined", "The applicant has been notified about your decision")
          },
        },
      ])
    }
  }

  const handleMessage = (applicantId: string) => {
    router.push(`/chat/${applicantId}`)
  }

  const renderApplicantItem = ({ item }: { item: any }) => (
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

  if (!jobPost) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft width={24} height={24} stroke={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Job Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.text }]}>Job post not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Job Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Job Post Details Section */}
        <View style={[styles.jobPostCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.jobPostHeader}>
            <Text style={[styles.jobPostService, { color: colors.text }]}>{jobPost.service}</Text>
            {jobPost.isUrgent && (
              <View style={[styles.urgentBadge, { backgroundColor: colors.error + "20" }]}>
                <AlertTriangle width={12} height={12} stroke={colors.error} />
                <Text style={[styles.urgentText, { color: colors.error }]}>Urgent</Text>
              </View>
            )}
          </View>

          <View style={styles.jobPostDetails}>
            <View style={styles.jobPostDetailItem}>
              <DollarSign width={16} height={16} stroke={colors.subtext} />
              <Text style={[styles.jobPostDetailText, { color: colors.subtext }]}>Budget: {jobPost.budget}</Text>
            </View>

            <View style={styles.jobPostDetailItem}>
              <Calendar width={16} height={16} stroke={colors.subtext} />
              <Text style={[styles.jobPostDetailText, { color: colors.subtext }]}>Date: {jobPost.date}</Text>
            </View>

            <View style={styles.jobPostDetailItem}>
              <Clock width={16} height={16} stroke={colors.subtext} />
              <Text style={[styles.jobPostDetailText, { color: colors.subtext }]}>Time: {jobPost.time}</Text>
            </View>

            <View style={styles.jobPostDetailItem}>
              <MapPin width={16} height={16} stroke={colors.subtext} />
              <Text style={[styles.jobPostDetailText, { color: colors.subtext }]}>Location: {jobPost.location}</Text>
            </View>
          </View>

          <Text style={[styles.descriptionLabel, { color: colors.text }]}>Description:</Text>
          <Text style={[styles.jobPostDescription, { color: colors.text }]}>{jobPost.description}</Text>

          <Text style={[styles.postedDate, { color: colors.subtext }]}>Posted on: {jobPost.postedOn}</Text>
        </View>

        {/* Applicants Section */}
        <View style={styles.applicantsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Applicants ({applicants.length})</Text>

          {applicants.length > 0 ? (
            applicants.map((applicant) => renderApplicantItem({ item: applicant }))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>No applicants yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
                Check back later for applicants to your job post
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
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  jobPostCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  jobPostHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  jobPostService: {
    fontSize: 18,
    fontWeight: "bold",
  },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: "500",
  },
  jobPostDetails: {
    marginBottom: 16,
    gap: 8,
  },
  jobPostDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  jobPostDetailText: {
    fontSize: 14,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  jobPostDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  postedDate: {
    fontSize: 12,
    fontStyle: "italic",
  },
  applicantsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
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

