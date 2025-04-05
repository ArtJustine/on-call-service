"use client"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, MessageCircle, HelpCircle, Book, Phone, Mail, ChevronDown, ChevronUp } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"

// FAQ data for workers
const faqs = [
  {
    question: "How do I receive job requests?",
    answer:
      "Job requests will appear in your Available tab. You can review the details and choose to accept or decline each request based on your availability and expertise.",
  },
  {
    question: "How do payments work?",
    answer:
      "After completing a job, the client will confirm completion through the app. Payment will be processed and transferred to your account within 1-3 business days, depending on your payment method.",
  },
  {
    question: "What if I need to cancel a job?",
    answer:
      "If you need to cancel an accepted job, go to the Upcoming tab, select the job, and tap 'Cancel Job'. Please provide a reason for cancellation. Note that frequent cancellations may affect your profile rating.",
  },
  {
    question: "How are my ratings calculated?",
    answer:
      "Ratings are based on client feedback after job completion. Clients rate your service on a 1-5 star scale and can leave reviews. Your overall rating is an average of all your job ratings.",
  },
  {
    question: "How can I improve my visibility to clients?",
    answer:
      "Complete your profile with detailed information about your skills and experience. Upload certification documents, maintain a high rating by providing quality service, and respond promptly to job requests.",
  },
]

export default function WorkerHelpSupportScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [supportMessage, setSupportMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null)
    } else {
      setExpandedFaq(index)
    }
  }

  const handleSendMessage = () => {
    if (!supportMessage.trim()) {
      Alert.alert("Error", "Please enter a message")
      return
    }

    setIsSending(true)

    // Simulate sending message
    setTimeout(() => {
      setIsSending(false)
      setSupportMessage("")
      Alert.alert("Message Sent", "Thank you for contacting us. We'll respond to your inquiry within 24 hours.", [
        { text: "OK" },
      ])
    }, 1500)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle width={24} height={24} stroke={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
          </View>

          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.faqItem,
                { borderBottomColor: colors.border },
                expandedFaq === index && { backgroundColor: colors.primary + "10" },
              ]}
              onPress={() => toggleFaq(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                {expandedFaq === index ? (
                  <ChevronUp width={20} height={20} stroke={colors.primary} />
                ) : (
                  <ChevronDown width={20} height={20} stroke={colors.subtext} />
                )}
              </View>

              {expandedFaq === index && <Text style={[styles.faqAnswer, { color: colors.subtext }]}>{faq.answer}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Book width={24} height={24} stroke={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Provider Guide</Text>
          </View>

          <TouchableOpacity
            style={[styles.guideItem, { backgroundColor: colors.primary + "10" }]}
            onPress={() => {
              Linking.openURL("https://v0-revit-landing-page.vercel.app/")
            }}
          >
            <Text style={[styles.guideText, { color: colors.primary }]}>View Complete Guide</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MessageCircle width={24} height={24} stroke={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Support</Text>
          </View>

          <View style={styles.contactOptions}>
            <TouchableOpacity
              style={[styles.contactOption, { borderColor: colors.border }]}
              onPress={() => {
                Alert.alert("Call Support", "Would you like to call our service provider support line?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Call", onPress: () => Linking.openURL("tel:+1234567890") },
                ])
              }}
            >
              <Phone width={24} height={24} stroke={colors.primary} />
              <Text style={[styles.contactOptionText, { color: colors.text }]}>Call Us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactOption, { borderColor: colors.border }]}
              onPress={() => {
                Linking.openURL("mailto:support@oncallservices.com?subject=Service Provider Support Request")
              }}
            >
              <Mail width={24} height={24} stroke={colors.primary} />
              <Text style={[styles.contactOptionText, { color: colors.text }]}>Email</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.messageContainer}>
            <Text style={[styles.messageLabel, { color: colors.text }]}>Send us a message</Text>
            <TextInput
              style={[
                styles.messageInput,
                {
                  backgroundColor: colors.lightGray,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Describe your issue or question..."
              placeholderTextColor={colors.subtext}
              multiline
              value={supportMessage}
              onChangeText={setSupportMessage}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: colors.primary },
                (!supportMessage.trim() || isSending) && { opacity: 0.7 },
              ]}
              onPress={handleSendMessage}
              disabled={!supportMessage.trim() || isSending}
            >
              {isSending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.sendButtonText}>Send Message</Text>
              )}
            </TouchableOpacity>
          </View>
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
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    paddingRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    paddingRight: 24,
  },
  guideItem: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  guideText: {
    fontSize: 16,
    fontWeight: "500",
  },
  contactOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  contactOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  contactOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  messageContainer: {
    marginBottom: 24,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    marginBottom: 16,
  },
  sendButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
})

