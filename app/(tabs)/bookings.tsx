"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Switch, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Plus, X, Calendar, Clock, DollarSign, AlertTriangle, ChevronDown } from "react-native-feather"
import { useRouter } from "expo-router"
import { bookings } from "../../constants/Data"
import { useTheme } from "../../context/ThemeContext"
import { getCurrentLocation } from "../../services/LocationService"

export default function BookingsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [showPostJobModal, setShowPostJobModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"bookings" | "posts">("bookings")
  const [showServiceTypeDropdown, setShowServiceTypeDropdown] = useState(false)
  const [selectedServiceType, setSelectedServiceType] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)
  const [jobDate, setJobDate] = useState("")
  const [jobTime, setJobTime] = useState("")
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [userLocation, setUserLocation] = useState<string | null>(null)

  // Service type options
  const serviceTypes = [
    "Mechanic",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Painter",
    "HVAC Technician",
    "Landscaper",
    "Appliance Repair",
    "Locksmith",
  ]

  // Get user's current location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getCurrentLocation()
        if (location && location.city) {
          setUserLocation(location.city)
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      }
    }

    fetchLocation()
  }, [])

  // Mock job posts data
  const [jobPosts, setJobPosts] = useState([
    {
      id: "1",
      service: "Car Engine Repair",
      budget: "₱250 - ₱350",
      date: "05/20/2023",
      time: "Flexible",
      isUrgent: true,
      description: "Need help with car engine that won't start. Possibly battery or starter issue.",
      status: "active",
      applicants: 3,
      location: "Angeles City",
    },
    {
      id: "2",
      service: "Plumbing Repair",
      budget: "₱200 - ₱300",
      date: "05/25/2023",
      time: "Morning",
      isUrgent: false,
      description: "Leaking pipe under kitchen sink needs repair.",
      status: "active",
      applicants: 1,
      location: "Manila",
    },
  ])

  // Handle date input with auto-formatting
  const handleDateChange = (text: string) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, "")

    // Format the date with slashes
    let formattedDate = ""

    if (numericValue.length <= 2) {
      formattedDate = numericValue
    } else if (numericValue.length <= 4) {
      formattedDate = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`
    } else {
      formattedDate = `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`
    }

    setJobDate(formattedDate)
  }

  const handleAddJobPost = () => {
    if (!selectedServiceType || !minBudget || !maxBudget || !jobDate || !jobDescription) {
      // In a real app, you'd show validation errors
      alert("Please fill in all required fields")
      return
    }

    const newJobPostId = (jobPosts.length + 1).toString()

    // Create job post object
    const newJobPost = {
      id: newJobPostId,
      service: selectedServiceType,
      budget: `₱${minBudget} - ₱${maxBudget}`,
      date: jobDate,
      time: jobTime || "Flexible",
      isUrgent: isUrgent,
      description: jobDescription,
      status: "active",
      applicants: 0,
      location: userLocation || "Unknown Location",
    }

    // Create a corresponding booking entry
    const newBooking = {
      id: newJobPostId,
      service: selectedServiceType,
      expertName: "Pending Assignment",
      date: jobDate,
      time: jobTime || "Flexible",
      status: "upcoming",
      price: `₱${maxBudget}`,
      location: userLocation || "Unknown Location",
      duration: "TBD",
      notes: jobDescription,
    }

    // Update both arrays
    setJobPosts([newJobPost, ...jobPosts])

    // Add to bookings array if it's a state variable, otherwise we'd use the imported bookings array
    // For this example, we'll just simulate adding to bookings
    // In a real app, you would update your data source

    // Reset form
    setSelectedServiceType("")
    setMinBudget("")
    setMaxBudget("")
    setJobDate("")
    setJobTime("")
    setIsUrgent(false)
    setJobDescription("")
    setShowPostJobModal(false)

    // Switch to the bookings tab to show the new booking
    setActiveTab("bookings")

    // Alert to simulate notification to workers in the area
    alert(`Your job has been posted! Workers in ${userLocation || "your area"} will be notified.`)
  }

  const handleViewApplicants = (postId: string) => {
    router.push(`/job-post-details/${postId}`)
  }

  const renderJobPostItem = ({ item }: { item: any }) => (
    <View style={[styles.jobPostCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.jobPostHeader}>
        <Text style={[styles.jobPostService, { color: colors.text }]}>{item.service}</Text>
        {item.isUrgent && (
          <View style={[styles.urgentBadge, { backgroundColor: colors.error + "20" }]}>
            <AlertTriangle width={12} height={12} stroke={colors.error} />
            <Text style={[styles.urgentText, { color: colors.error }]}>Urgent</Text>
          </View>
        )}
      </View>

      <View style={styles.jobPostDetails}>
        <View style={styles.jobPostDetailItem}>
          <DollarSign width={16} height={16} stroke={colors.subtext} />
          <Text style={[styles.jobPostDetailText, { color: colors.subtext }]}>{item.budget}</Text>
        </View>

        <View style={styles.jobPostDetailItem}>
          <Calendar width={16} height={16} stroke={colors.subtext} />
          <Text style={[styles.jobPostDetailText, { color: colors.subtext }]}>{item.date}</Text>
        </View>

        <View style={styles.jobPostDetailItem}>
          <Clock width={16} height={16} stroke={colors.subtext} />
          <Text style={[styles.jobPostDetailText, { color: colors.subtext }]}>{item.time}</Text>
        </View>
      </View>

      <Text style={[styles.jobPostDescription, { color: colors.text }]} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.jobPostFooter}>
        <View style={[styles.applicantsBadge, { backgroundColor: colors.primary + "20" }]}>
          <Text style={[styles.applicantsText, { color: colors.primary }]}>
            {item.applicants} {item.applicants === 1 ? "Applicant" : "Applicants"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.viewApplicantsButton, { backgroundColor: colors.primary }]}
          onPress={() => handleViewApplicants(item.id)}
        >
          <Text style={[styles.viewApplicantsText, { color: colors.background }]}>
            View {item.applicants > 0 ? "Applicants" : "Details"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Bookings</Text>
        <TouchableOpacity
          style={[styles.postJobButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowPostJobModal(true)}
        >
          <Plus width={16} height={16} stroke={colors.background} />
          <Text style={[styles.postJobButtonText, { color: colors.background }]}>Post Job</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "bookings" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab("bookings")}
        >
          <Text style={[styles.tabText, { color: activeTab === "bookings" ? colors.primary : colors.subtext }]}>
            My Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "posts" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab("posts")}
        >
          <Text style={[styles.tabText, { color: activeTab === "posts" ? colors.primary : colors.subtext }]}>
            My Job Posts
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === "bookings" ? (
          bookings.length > 0 ? (
            <FlatList
              data={bookings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.bookingCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={styles.bookingHeader}>
                    <Text style={[styles.serviceName, { color: colors.text }]}>{item.service}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        item.status === "completed"
                          ? [styles.completedBadge, { backgroundColor: colors.success + "20" }]
                          : [styles.upcomingBadge, { backgroundColor: colors.primary + "20" }],
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: item.status === "completed" ? colors.success : colors.primary,
                          },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.expertName, { color: colors.text }]}>Expert: {item.expertName}</Text>
                  <Text style={[styles.dateTime, { color: colors.subtext }]}>
                    {item.date} at {item.time}
                  </Text>

                  <TouchableOpacity
                    style={[styles.viewDetailsButton, { borderColor: colors.primary }]}
                    onPress={() => router.push(`/booking-details/${item.id}`)}
                  >
                    <Text style={[styles.viewDetailsText, { color: colors.primary }]}>View Details</Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={styles.bookingsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>No bookings yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
                Your bookings will appear here once you schedule a service
              </Text>
            </View>
          )
        ) : (
          <FlatList
            data={jobPosts}
            keyExtractor={(item) => item.id}
            renderItem={renderJobPostItem}
            contentContainerStyle={styles.jobPostsList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: colors.text }]}>No job posts yet</Text>
                <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
                  Tap the "Post Job" button to create your first job post
                </Text>
              </View>
            }
          />
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showPostJobModal}
        onRequestClose={() => setShowPostJobModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Post a Job</Text>
              <TouchableOpacity onPress={() => setShowPostJobModal(false)}>
                <X width={24} height={24} stroke={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formContainer}
              contentContainerStyle={{ paddingBottom: 30 }}
              showsVerticalScrollIndicator={true}
            >
              {/* Service Type Dropdown */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Service Type *</Text>
                <TouchableOpacity
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                  onPress={() => setShowServiceTypeDropdown(!showServiceTypeDropdown)}
                >
                  <Text
                    style={[
                      selectedServiceType ? { color: colors.text } : styles.placeholder,
                      { color: selectedServiceType ? colors.text : colors.subtext },
                    ]}
                  >
                    {selectedServiceType || "Select Service Type"}
                  </Text>
                  <ChevronDown width={20} height={20} stroke={colors.subtext} />
                </TouchableOpacity>

                {showServiceTypeDropdown && (
                  <View
                    style={[styles.dropdownList, { backgroundColor: colors.background, borderColor: colors.border }]}
                  >
                    <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}>
                      {serviceTypes.map((type, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.dropdownItem,
                            index < serviceTypes.length - 1 && {
                              borderBottomWidth: 1,
                              borderBottomColor: colors.border,
                            },
                          ]}
                          onPress={() => {
                            setSelectedServiceType(type)
                            setShowServiceTypeDropdown(false)
                          }}
                        >
                          <Text style={{ color: colors.text }}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Location */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Location</Text>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <Text style={[styles.locationText, { color: colors.text }]}>
                    {userLocation || "Detecting your location..."}
                  </Text>
                </View>
                <Text style={[styles.helperText, { color: colors.subtext }]}>
                  Workers in this area will be notified about your job post
                </Text>
              </View>

              {/* Budget Range */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Budget Range (₱) *</Text>
                <View style={styles.budgetContainer}>
                  <View style={[styles.budgetInput, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
                    <DollarSign width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Min"
                      placeholderTextColor={colors.subtext}
                      keyboardType="numeric"
                      value={minBudget}
                      onChangeText={setMinBudget}
                    />
                  </View>
                  <Text style={[styles.budgetSeparator, { color: colors.subtext }]}>to</Text>
                  <View style={[styles.budgetInput, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
                    <DollarSign width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Max"
                      placeholderTextColor={colors.subtext}
                      keyboardType="numeric"
                      value={maxBudget}
                      onChangeText={setMaxBudget}
                    />
                  </View>
                </View>
              </View>

              {/* Date */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Date Needed *</Text>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <Calendar width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor={colors.subtext}
                    keyboardType="number-pad"
                    value={jobDate}
                    onChangeText={handleDateChange}
                    maxLength={10} // MM/DD/YYYY = 10 characters
                  />
                </View>
              </View>

              {/* Time */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Preferred Time (Optional)</Text>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <Clock width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="e.g., Morning, Afternoon, or specific time"
                    placeholderTextColor={colors.subtext}
                    value={jobTime}
                    onChangeText={setJobTime}
                  />
                </View>
              </View>

              {/* Urgency */}
              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <View style={styles.switchLabel}>
                    <AlertTriangle width={20} height={20} stroke={colors.error} style={styles.inputIcon} />
                    <Text style={[styles.label, { color: colors.text }]}>Mark as Urgent</Text>
                  </View>
                  <Switch
                    trackColor={{ false: colors.lightGray, true: colors.error + "70" }}
                    thumbColor={"#f4f3f4"}
                    value={isUrgent}
                    onValueChange={setIsUrgent}
                  />
                </View>
                <Text style={[styles.helperText, { color: colors.subtext }]}>
                  Marking as urgent will highlight your job post to attract immediate attention
                </Text>
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Job Description *</Text>
                <View
                  style={[styles.textAreaContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <TextInput
                    style={[styles.textArea, { color: colors.text }]}
                    placeholder="Describe what you need help with..."
                    placeholderTextColor={colors.subtext}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={jobDescription}
                    onChangeText={setJobDescription}
                  />
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.cancelButton, { borderColor: colors.border }]}
                  onPress={() => setShowPostJobModal(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={handleAddJobPost}
                >
                  <Text style={[styles.submitButtonText, { color: colors.background }]}>Post Job</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postJobButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  postJobButtonText: {
    fontSize: 14,
    fontWeight: "500",
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
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bookingsList: {
    paddingVertical: 16,
  },
  bookingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    // Color applied dynamically
  },
  completedBadge: {
    // Color applied dynamically
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  expertName: {
    fontSize: 14,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    marginBottom: 12,
  },
  viewDetailsButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    height: "80%", // Fixed height to ensure proper display
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  jobPostsList: {
    paddingVertical: 16,
  },
  jobPostCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  jobPostHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  jobPostService: {
    fontSize: 16,
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  jobPostDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  jobPostDetailText: {
    fontSize: 14,
  },
  jobPostDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  jobPostFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  applicantsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  applicantsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  viewApplicantsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewApplicantsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  // Form styles
  formContainer: {
    flex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    height: 48,
  },
  textArea: {
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputIcon: {
    marginRight: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  placeholder: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  budgetSeparator: {
    marginHorizontal: 8,
    fontSize: 14,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 120,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchTrack: {
    width: 50,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  helperText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownButton: {
    flex: 1,
    paddingVertical: 12,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  // Dropdown menu styles
  dropdownList: {
    position: "absolute",
    top: 76, // positioned below the input field
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
  },
})

