"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Modal, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  Bell,
  Calendar,
  DollarSign,
  Star,
  MessageCircle,
  Settings,
  LogOut,
  User,
  ArrowLeft,
  Check,
  X,
  MapPin,
  Info,
  ExternalLink,
  Clock,
  HelpCircle,
} from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"
import { getCurrentLocation } from "../services/LocationService"

// Dummy data for worker dashboard
const upcomingJobs = [
  {
    id: "1",
    clientName: "John Smith",
    service: "Car Engine Repair",
    date: "May 15, 2023",
    time: "10:00 AM",
    location: "123 Main St, Angeles City",
    price: 300,
    description: "Car engine won't start. Possibly battery or starter issue.",
    clientPhone: "+63 912 345 6789",
    clientEmail: "john.smith@example.com",
  },
  {
    id: "2",
    clientName: "Sarah Johnson",
    service: "Electrical Wiring",
    date: "May 18, 2023",
    time: "2:30 PM",
    location: "456 Oak Ave, Angeles City",
    price: 250,
    description: "Need to install new electrical outlets in the kitchen.",
    clientPhone: "+63 912 345 6790",
    clientEmail: "sarah.johnson@example.com",
  },
]

// Available jobs based on worker's profession (Mechanic)
const availableJobs = [
  {
    id: "3",
    clientName: "Michael Brown",
    service: "Car Battery Replacement",
    date: "May 20, 2023",
    time: "9:00 AM",
    location: "789 Pine St, Angeles City",
    price: 200,
    description: "Need a new car battery installed. Current one is dead.",
    clientPhone: "+63 912 345 6791",
    clientEmail: "michael.brown@example.com",
    distance: "2.3 km away",
    postedTime: "Posted 2 hours ago",
  },
  {
    id: "4",
    clientName: "Emily Davis",
    service: "Car Oil Change",
    date: "May 21, 2023",
    time: "11:00 AM",
    location: "321 Elm St, Angeles City",
    price: 150,
    description: "Regular oil change for Toyota Corolla.",
    clientPhone: "+63 912 345 6792",
    clientEmail: "emily.davis@example.com",
    distance: "3.5 km away",
    postedTime: "Posted 5 hours ago",
  },
  {
    id: "5",
    clientName: "David Wilson",
    service: "Engine Diagnostics",
    date: "May 22, 2023",
    time: "3:00 PM",
    location: "654 Maple Ave, Angeles City",
    price: 250,
    description: "Car making strange noises. Need diagnostic check.",
    clientPhone: "+63 912 345 6793",
    clientEmail: "david.wilson@example.com",
    distance: "1.8 km away",
    postedTime: "Posted 30 minutes ago",
  },
]

const pendingRequests = [
  {
    id: "1",
    clientName: "Michael Brown",
    service: "Car Battery Replacement",
    date: "May 20, 2023",
    time: "9:00 AM",
    location: "789 Pine St, Angeles City",
    price: 200,
    description: "Need a new car battery installed. Current one is dead.",
    clientPhone: "+63 912 345 6791",
    clientEmail: "michael.brown@example.com",
  },
]

const completedJobs = [
  {
    id: "1",
    clientName: "Emily Davis",
    service: "Car Oil Change",
    date: "May 10, 2023",
    time: "11:00 AM",
    location: "321 Elm St, Angeles City",
    price: 150,
    rating: 5,
    review: "Great service! Very professional and quick.",
    description: "Regular oil change for Toyota Corolla.",
    clientPhone: "+63 912 345 6792",
    clientEmail: "emily.davis@example.com",
  },
  {
    id: "2",
    clientName: "David Wilson",
    service: "Brake Pad Replacement",
    date: "May 5, 2023",
    time: "3:00 PM",
    location: "654 Maple Ave, Angeles City",
    price: 350,
    rating: 4,
    review: "Good job, but took a bit longer than expected.",
    description: "Replace front and rear brake pads on Honda Civic.",
    clientPhone: "+63 912 345 6793",
    clientEmail: "david.wilson@example.com",
  },
]

// Earnings data
const earningsData = {
  currentMonth: 4250,
  lastMonth: 3800,
  pending: 550,
  transactions: [
    {
      id: "1",
      clientName: "Emily Davis",
      service: "Car Oil Change",
      date: "May 10, 2023",
      amount: 150,
      status: "completed",
      paymentMethod: "Credit Card",
      serviceFee: 15,
      netAmount: 135,
      transactionId: "TRX-12345678",
      time: "11:30 AM",
    },
    {
      id: "2",
      clientName: "David Wilson",
      service: "Brake Pad Replacement",
      date: "May 5, 2023",
      amount: 350,
      status: "completed",
      paymentMethod: "PayPal",
      serviceFee: 35,
      netAmount: 315,
      transactionId: "TRX-87654321",
      time: "4:15 PM",
    },
    {
      id: "3",
      clientName: "John Smith",
      service: "Car Engine Repair",
      date: "May 15, 2023",
      amount: 300,
      status: "pending",
      paymentMethod: "Credit Card",
      serviceFee: 30,
      netAmount: 270,
      transactionId: "TRX-23456789",
      time: "1:45 PM",
    },
    {
      id: "4",
      clientName: "Sarah Johnson",
      service: "Electrical Wiring",
      date: "May 18, 2023",
      amount: 250,
      status: "pending",
      paymentMethod: "Bank Transfer",
      serviceFee: 25,
      netAmount: 225,
      transactionId: "TRX-34567890",
      time: "3:20 PM",
    },
  ],
}

// Ratings data
const ratingsData = {
  average: 4.8,
  total: 24,
  breakdown: {
    5: 18,
    4: 4,
    3: 2,
    2: 0,
    1: 0,
  },
  reviews: [
    {
      id: "1",
      clientName: "Emily Davis",
      service: "Car Oil Change",
      date: "May 10, 2023",
      rating: 5,
      review: "Great service! Very professional and quick.",
    },
    {
      id: "2",
      clientName: "David Wilson",
      service: "Brake Pad Replacement",
      date: "May 5, 2023",
      rating: 4,
      review: "Good job, but took a bit longer than expected.",
    },
    {
      id: "3",
      clientName: "Alex Johnson",
      service: "Tire Rotation",
      date: "April 28, 2023",
      rating: 5,
      review: "Excellent service, very thorough and explained everything clearly.",
    },
    {
      id: "4",
      clientName: "Maria Garcia",
      service: "Battery Replacement",
      date: "April 20, 2023",
      rating: 5,
      review: "Fast and efficient service. Highly recommended!",
    },
    {
      id: "5",
      clientName: "Robert Lee",
      service: "Engine Diagnostics",
      date: "April 15, 2023",
      rating: 3,
      review: "Service was okay, but could have been more thorough with the explanation.",
    },
  ],
}

export default function WorkerDashboardScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [activeTab, setActiveTab] = useState<"available" | "pending" | "completed">("available")
  const [activeSection, setActiveSection] = useState<"jobs" | "earnings" | "ratings" | "profile">("jobs")
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false)
  const [showTransactionDetailsModal, setShowTransactionDetailsModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  // State for job lists
  const [pendingJobsList, setPendingJobsList] = useState(pendingRequests)
  const [upcomingJobsList, setUpcomingJobsList] = useState(upcomingJobs)
  const [availableJobsList, setAvailableJobsList] = useState(availableJobs)
  const [completedJobsList, setCompletedJobsList] = useState(completedJobs)

  const [userLocation, setUserLocation] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getCurrentLocation()
        if (location) {
          setUserLocation(location.formattedAddress || location.city || "Unknown location")
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      }
    }

    fetchLocation()
  }, [])

  const handleLogout = () => {
    router.push("/welcome")
  }

  const handleAcceptJob = (jobId: string) => {
    // Find the job in pending requests
    const jobToAccept = pendingJobsList.find((job) => job.id === jobId)

    if (jobToAccept) {
      // Remove from pending
      setPendingJobsList((current) => current.filter((job) => job.id !== jobId))

      // Add to upcoming
      setUpcomingJobsList((current) => [...current, jobToAccept])

      // Show success message
      alert(`Job ${jobId} accepted!`)

      // Close modal if open
      setShowJobDetailsModal(false)

      // Switch to upcoming tab
      setActiveTab("available")
    }
  }

  const handleDeclineJob = (jobId: string) => {
    // Remove from pending
    setPendingJobsList((current) => current.filter((job) => job.id !== jobId))

    // Show success message
    alert(`Job ${jobId} declined!`)

    // Close modal if open
    setShowJobDetailsModal(false)
  }

  const handleJobPress = (job: any) => {
    setSelectedJob(job)
    setShowJobDetailsModal(true)
  }

  const handleMessageClient = (job: any) => {
    router.push(`/chat/${job.id}`)
  }

  const handleTransactionPress = (transaction: any) => {
    setSelectedTransaction(transaction)
    setShowTransactionDetailsModal(true)
  }

  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.jobCard, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={() => handleJobPress(item)}
    >
      <View style={styles.jobHeader}>
        <Text style={[styles.clientName, { color: colors.text }]}>{item.clientName}</Text>
        <Text style={[styles.jobPrice, { color: colors.primary }]}>₱{item.price}</Text>
      </View>

      <Text style={[styles.jobService, { color: colors.text }]}>{item.service}</Text>

      <View style={styles.jobDetails}>
        <View style={styles.jobDetailItem}>
          <Calendar width={16} height={16} stroke={colors.subtext} />
          <Text style={[styles.jobDetailText, { color: colors.subtext }]}>
            {item.date} at {item.time}
          </Text>
        </View>

        <View style={styles.jobDetailItem}>
          <MapPin width={16} height={16} stroke={colors.subtext} />
          <Text style={[styles.jobDetailText, { color: colors.subtext }]}>{item.location}</Text>
        </View>

        {activeTab === "available" && item.distance && (
          <View style={styles.jobDetailItem}>
            <MapPin width={16} height={16} stroke={colors.primary} />
            <Text style={[styles.jobDetailText, { color: colors.primary }]}>{item.distance}</Text>
          </View>
        )}

        {activeTab === "available" && item.postedTime && (
          <View style={styles.jobDetailItem}>
            <Clock width={16} height={16} stroke={colors.subtext} />
            <Text style={[styles.jobDetailText, { color: colors.subtext }]}>{item.postedTime}</Text>
          </View>
        )}
      </View>

      {activeTab === "pending" && (
        <View style={styles.pendingActions}>
          <TouchableOpacity
            style={[styles.declineButton, { borderColor: colors.error }]}
            onPress={() => handleDeclineJob(item.id)}
          >
            <X width={16} height={16} stroke={colors.error} />
            <Text style={[styles.declineButtonText, { color: colors.error }]}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: colors.success }]}
            onPress={() => handleAcceptJob(item.id)}
          >
            <Check width={16} height={16} stroke={colors.background} />
            <Text style={[styles.acceptButtonText, { color: colors.background }]}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === "available" && (
        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: colors.primary }]}
          onPress={() => handleAcceptJob(item.id)}
        >
          <Text style={[styles.applyButtonText, { color: colors.background }]}>Apply for Job</Text>
        </TouchableOpacity>
      )}

      {activeTab === "completed" && item.rating && (
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                width={16}
                height={16}
                fill={i < item.rating ? colors.primary : "none"}
                stroke={colors.primary}
              />
            ))}
          </View>
          <Text style={[styles.reviewText, { color: colors.subtext }]} numberOfLines={1}>
            "{item.review}"
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )

  const renderEarningsSection = () => (
    <ScrollView style={styles.sectionContent}>
      <View style={[styles.earningsSummary, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.earningsItem}>
          <Text style={[styles.earningsLabel, { color: colors.subtext }]}>This Month</Text>
          <Text style={[styles.earningsValue, { color: colors.text }]}>₱{earningsData.currentMonth}</Text>
        </View>

        <View style={styles.earningsItem}>
          <Text style={[styles.earningsLabel, { color: colors.subtext }]}>Last Month</Text>
          <Text style={[styles.earningsValue, { color: colors.text }]}>₱{earningsData.lastMonth}</Text>
        </View>

        <View style={styles.earningsItem}>
          <Text style={[styles.earningsLabel, { color: colors.subtext }]}>Pending</Text>
          <Text style={[styles.earningsValue, { color: colors.primary }]}>₱{earningsData.pending}</Text>
        </View>
      </View>

      <Text style={[styles.transactionsTitle, { color: colors.text }]}>Recent Transactions</Text>

      {earningsData.transactions.map((transaction) => (
        <TouchableOpacity
          key={transaction.id}
          style={[styles.transactionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => handleTransactionPress(transaction)}
        >
          <View style={styles.transactionHeader}>
            <Text style={[styles.transactionService, { color: colors.text }]}>{transaction.service}</Text>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color: transaction.status === "completed" ? colors.success : colors.primary,
                },
              ]}
            >
              ₱{transaction.amount}
            </Text>
          </View>

          <Text style={[styles.transactionClient, { color: colors.subtext }]}>{transaction.clientName}</Text>
          <Text style={[styles.transactionDate, { color: colors.subtext }]}>{transaction.date}</Text>

          <View
            style={[
              styles.transactionStatus,
              {
                backgroundColor: transaction.status === "completed" ? colors.success + "20" : colors.primary + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.transactionStatusText,
                {
                  color: transaction.status === "completed" ? colors.success : colors.primary,
                },
              ]}
            >
              {transaction.status === "completed" ? "Completed" : "Pending"}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  const renderRatingsSection = () => (
    <ScrollView style={styles.sectionContent}>
      <View style={[styles.ratingSummary, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.averageRating}>
          <Text style={[styles.averageRatingValue, { color: colors.text }]}>{ratingsData.average}</Text>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                width={20}
                height={20}
                fill={i < Math.round(ratingsData.average) ? colors.primary : "none"}
                stroke={colors.primary}
              />
            ))}
          </View>
          <Text style={[styles.totalRatings, { color: colors.subtext }]}>Based on {ratingsData.total} ratings</Text>
        </View>

        <View style={styles.ratingBreakdown}>
          {[5, 4, 3, 2, 1].map((star) => (
            <View key={star} style={styles.ratingBar}>
              <Text style={[styles.ratingBarLabel, { color: colors.subtext }]}>{star}</Text>
              <View style={[styles.ratingBarBackground, { backgroundColor: colors.lightGray }]}>
                <View
                  style={[
                    styles.ratingBarFill,
                    {
                      backgroundColor: colors.primary,
                      width: `${(ratingsData.breakdown[star as keyof typeof ratingsData.breakdown] / ratingsData.total) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.ratingBarCount, { color: colors.subtext }]}>
                {ratingsData.breakdown[star as keyof typeof ratingsData.breakdown]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={[styles.reviewsTitle, { color: colors.text }]}>Recent Reviews</Text>

      {ratingsData.reviews.map((review) => (
        <View
          key={review.id}
          style={[styles.reviewCard, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
          <View style={styles.reviewHeader}>
            <Text style={[styles.reviewClientName, { color: colors.text }]}>{review.clientName}</Text>
            <View style={styles.reviewRating}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  width={16}
                  height={16}
                  fill={i < review.rating ? colors.primary : "none"}
                  stroke={colors.primary}
                />
              ))}
            </View>
          </View>

          <Text style={[styles.reviewServiceDate, { color: colors.subtext }]}>
            {review.service} • {review.date}
          </Text>

          <Text style={[styles.reviewText, { color: colors.text }]}>"{review.review}"</Text>
        </View>
      ))}
    </ScrollView>
  )

  const renderProfileSection = () => (
    <ScrollView style={styles.sectionContent}>
      <View style={[styles.profileCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.profileHeader}>
          <View style={[styles.profileAvatar, { backgroundColor: colors.lightGray }]} />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>Bob Worker</Text>
            <Text style={[styles.profileProfession, { color: colors.subtext }]}>Mechanic</Text>
            <TouchableOpacity
              style={[styles.editProfileButton, { borderColor: colors.primary }]}
              onPress={() => router.push("/worker-profile-edit")}
            >
              <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => router.push("/worker-settings")}
        >
          <Settings width={20} height={20} stroke={colors.subtext} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => router.push("/worker-certifications")}
        >
          <Star width={20} height={20} stroke={colors.subtext} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Certifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => router.push("/worker-payment-methods")}
        >
          <DollarSign width={20} height={20} stroke={colors.subtext} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Payment Methods</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => router.push("/worker-help-support")}
        >
          <HelpCircle width={20} height={20} stroke={colors.subtext} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <LogOut width={20} height={20} stroke={colors.error} />
          <Text style={[styles.menuItemText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello, Bob</Text>
          <View style={styles.locationContainer}>
            <MapPin width={16} height={16} stroke={colors.primary} />
            <Text style={[styles.locationText, { color: colors.subtext }]}>
              {userLocation || "Detecting location..."}
            </Text>
          </View>
          <Text style={[styles.profession, { color: colors.subtext }]}>Mechanic</Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={() => alert("Notifications")}>
            <Bell width={24} height={24} stroke={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: activeSection === "jobs" ? colors.primary : colors.background,
              borderColor: colors.primary,
              borderWidth: 1,
              borderRadius: 50,
            },
          ]}
          onPress={() => setActiveSection("jobs")}
        >
          <Calendar width={20} height={20} stroke={activeSection === "jobs" ? colors.background : colors.primary} />
          <Text style={[styles.statLabel, { color: activeSection === "jobs" ? colors.background : colors.primary }]}>
            Jobs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: activeSection === "earnings" ? colors.primary : colors.background,
              borderColor: colors.primary,
              borderWidth: 1,
              borderRadius: 50,
            },
          ]}
          onPress={() => setActiveSection("earnings")}
        >
          <DollarSign
            width={20}
            height={20}
            stroke={activeSection === "earnings" ? colors.background : colors.primary}
          />
          <Text
            style={[styles.statLabel, { color: activeSection === "earnings" ? colors.background : colors.primary }]}
          >
            Earnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: activeSection === "ratings" ? colors.primary : colors.background,
              borderColor: colors.primary,
              borderWidth: 1,
              borderRadius: 50,
            },
          ]}
          onPress={() => setActiveSection("ratings")}
        >
          <Star width={20} height={20} stroke={activeSection === "ratings" ? colors.background : colors.primary} />
          <Text style={[styles.statLabel, { color: activeSection === "ratings" ? colors.background : colors.primary }]}>
            Ratings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: activeSection === "profile" ? colors.primary : colors.background,
              borderColor: colors.primary,
              borderWidth: 1,
              borderRadius: 50,
            },
          ]}
          onPress={() => setActiveSection("profile")}
        >
          <User width={20} height={20} stroke={activeSection === "profile" ? colors.background : colors.primary} />
          <Text style={[styles.statLabel, { color: activeSection === "profile" ? colors.background : colors.primary }]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {activeSection === "jobs" && (
        <>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "available" && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab("available")}
            >
              <Text style={[styles.tabText, { color: activeTab === "available" ? colors.primary : colors.subtext }]}>
                Available
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "pending" && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab("pending")}
            >
              <Text style={[styles.tabText, { color: activeTab === "pending" ? colors.primary : colors.subtext }]}>
                Pending
              </Text>
              {pendingJobsList.length > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.badgeText, { color: colors.background }]}>{pendingJobsList.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "completed" && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab("completed")}
            >
              <Text style={[styles.tabText, { color: activeTab === "completed" ? colors.primary : colors.subtext }]}>
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={
              activeTab === "available"
                ? availableJobsList
                : activeTab === "pending"
                  ? pendingJobsList
                  : completedJobsList
            }
            keyExtractor={(item) => item.id}
            renderItem={renderJobItem}
            contentContainerStyle={styles.jobsList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: colors.text }]}>No jobs found</Text>
                <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
                  {activeTab === "pending"
                    ? "You don't have any pending job requests"
                    : activeTab === "available"
                      ? "No available jobs matching your skills at the moment"
                      : "You haven't completed any jobs yet"}
                </Text>
              </View>
            }
          />
        </>
      )}

      {activeSection === "earnings" && renderEarningsSection()}
      {activeSection === "ratings" && renderRatingsSection()}
      {activeSection === "profile" && renderProfileSection()}

      {/* Job Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showJobDetailsModal}
        onRequestClose={() => setShowJobDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowJobDetailsModal(false)}>
                <ArrowLeft width={24} height={24} stroke={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Job Details</Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedJob && (
              <ScrollView style={styles.modalBody}>
                <View style={[styles.detailCard, { borderColor: colors.border }]}>
                  <Text style={[styles.detailCardTitle, { color: colors.text }]}>{selectedJob.service}</Text>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Client:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedJob.clientName}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Date & Time:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedJob.date} at {selectedJob.time}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Location:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedJob.location}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Price:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>₱{selectedJob.price}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Description:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedJob.description}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Contact:</Text>
                    <View>
                      <Text style={[styles.detailValue, { color: colors.text }]}>{selectedJob.clientPhone}</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>{selectedJob.clientEmail}</Text>
                    </View>
                  </View>

                  {activeTab === "completed" && selectedJob.rating && (
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.subtext }]}>Rating:</Text>
                      <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              width={16}
                              height={16}
                              fill={i < selectedJob.rating ? colors.primary : "none"}
                              stroke={colors.primary}
                            />
                          ))}
                        </View>
                        <Text style={[styles.reviewText, { color: colors.text }]}>"{selectedJob.review}"</Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalActionButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setShowJobDetailsModal(false)
                      handleMessageClient(selectedJob)
                    }}
                  >
                    <MessageCircle width={20} height={20} stroke={colors.background} />
                    <Text style={[styles.modalActionButtonText, { color: colors.background }]}>Message Client</Text>
                  </TouchableOpacity>

                  {activeTab === "pending" && (
                    <View style={styles.pendingModalActions}>
                      <TouchableOpacity
                        style={[styles.declineButton, { borderColor: colors.error }]}
                        onPress={() => {
                          setShowJobDetailsModal(false)
                          handleDeclineJob(selectedJob.id)
                        }}
                      >
                        <X width={16} height={16} stroke={colors.error} />
                        <Text style={[styles.declineButtonText, { color: colors.error }]}>Decline</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.acceptButton, { backgroundColor: colors.success }]}
                        onPress={() => {
                          setShowJobDetailsModal(false)
                          handleAcceptJob(selectedJob.id)
                        }}
                      >
                        <Check width={16} height={16} stroke={colors.background} />
                        <Text style={[styles.acceptButtonText, { color: colors.background }]}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeTab === "available" && (
                    <TouchableOpacity
                      style={[styles.applyButton, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        setShowJobDetailsModal(false)
                        handleAcceptJob(selectedJob.id)
                      }}
                    >
                      <Text style={[styles.applyButtonText, { color: colors.background }]}>Apply for Job</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTransactionDetailsModal}
        onRequestClose={() => setShowTransactionDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowTransactionDetailsModal(false)}>
                <ArrowLeft width={24} height={24} stroke={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Transaction Details</Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedTransaction && (
              <ScrollView style={styles.modalBody}>
                <View style={[styles.detailCard, { borderColor: colors.border }]}>
                  <View style={styles.transactionDetailHeader}>
                    <Text style={[styles.detailCardTitle, { color: colors.text }]}>{selectedTransaction.service}</Text>
                    <View
                      style={[
                        styles.transactionStatus,
                        {
                          backgroundColor:
                            selectedTransaction.status === "completed" ? colors.success + "20" : colors.primary + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.transactionStatusText,
                          {
                            color: selectedTransaction.status === "completed" ? colors.success : colors.primary,
                          },
                        ]}
                      >
                        {selectedTransaction.status === "completed" ? "Completed" : "Pending"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Transaction ID:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedTransaction.transactionId}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Client:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedTransaction.clientName}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Date & Time:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedTransaction.date} at {selectedTransaction.time}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.subtext }]}>Payment Method:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedTransaction.paymentMethod}
                    </Text>
                  </View>

                  <View style={[styles.amountBreakdown, { backgroundColor: colors.lightGray }]}>
                    <View style={styles.amountItem}>
                      <Text style={[styles.amountLabel, { color: colors.text }]}>Total Amount:</Text>
                      <Text style={[styles.amountValue, { color: colors.text }]}>₱{selectedTransaction.amount}</Text>
                    </View>
                    <View style={styles.amountItem}>
                      <Text style={[styles.amountLabel, { color: colors.subtext }]}>Service Fee:</Text>
                      <Text style={[styles.amountValue, { color: colors.subtext }]}>
                        -₱{selectedTransaction.serviceFee}
                      </Text>
                    </View>
                    <View style={[styles.amountDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.amountItem}>
                      <Text style={[styles.amountLabel, { color: colors.primary, fontWeight: "bold" }]}>
                        Net Amount:
                      </Text>
                      <Text style={[styles.amountValue, { color: colors.primary, fontWeight: "bold" }]}>
                        ₱{selectedTransaction.netAmount}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.receiptButton, { borderColor: colors.primary }]}
                    onPress={() => {
                      Alert.alert("Receipt", "Download receipt functionality would be implemented here")
                    }}
                  >
                    <Text style={[styles.receiptButtonText, { color: colors.primary }]}>Download Receipt</Text>
                    <ExternalLink width={16} height={16} stroke={colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalActions}>
                  {selectedTransaction.status === "pending" && (
                    <View style={styles.transactionNote}>
                      <Info width={20} height={20} stroke={colors.primary} />
                      <Text style={[styles.transactionNoteText, { color: colors.subtext }]}>
                        This payment is still being processed and will be available in your account once completed.
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.modalActionButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setShowTransactionDetailsModal(false)
                    }}
                  >
                    <Text style={[styles.modalActionButtonText, { color: colors.background }]}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profession: {
    fontSize: 14,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  jobsList: {
    padding: 16,
  },
  jobCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  jobService: {
    fontSize: 14,
    marginBottom: 12,
  },
  jobDetails: {
    gap: 8,
    marginBottom: 16,
  },
  jobDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  jobDetailText: {
    fontSize: 14,
  },
  pendingActions: {
    flexDirection: "row",
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  declineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  ratingContainer: {
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    fontStyle: "italic",
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
  sectionContent: {
    flex: 1,
    padding: 16,
  },
  earningsSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  earningsItem: {
    alignItems: "center",
  },
  earningsLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  transactionService: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionClient: {
    fontSize: 14,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  transactionStatus: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  transactionStatusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  ratingSummary: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  averageRating: {
    alignItems: "center",
    marginBottom: 16,
  },
  averageRatingValue: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },
  totalRatings: {
    fontSize: 14,
    marginTop: 8,
  },
  ratingBreakdown: {
    gap: 8,
  },
  ratingBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingBarLabel: {
    fontSize: 14,
    width: 20,
    textAlign: "center",
  },
  ratingBarBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  ratingBarFill: {
    height: 8,
    borderRadius: 4,
  },
  ratingBarCount: {
    fontSize: 14,
    width: 20,
    textAlign: "center",
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewClientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewServiceDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  profileCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileProfession: {
    fontSize: 16,
    marginBottom: 12,
  },
  editProfileButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "500",
  },
  menuSection: {
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 16,
  },
  detailCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  detailCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  modalActions: {
    gap: 12,
    marginBottom: 24,
  },
  modalActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  modalActionButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  pendingModalActions: {
    flexDirection: "row",
    gap: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  transactionDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  amountBreakdown: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  amountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
  },
  amountValue: {
    fontSize: 14,
  },
  amountDivider: {
    height: 1,
    marginVertical: 8,
  },
  receiptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 8,
  },
  receiptButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  transactionNote: {
    flexDirection: "row",
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "flex-start",
    gap: 8,
  },
  transactionNoteText: {
    fontSize: 14,
    flex: 1,
  },
})

