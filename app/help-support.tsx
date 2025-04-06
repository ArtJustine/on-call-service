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

// FAQ data
const faqs = [
  {
    question: "How do I book a service?",
    answer:
      "To book a service, browse through available experts, select one that matches your needs, and tap on 'Book Service'. Follow the prompts to select your preferred date, time, and payment method.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments are processed securely through our platform. You can pay using credit/debit cards or other supported payment methods. Funds are only released to the service provider after you confirm the service has been completed satisfactorily.",
  },
  {
    question: "What if I need to cancel a booking?",
    answer:
      "You can cancel a booking through the 'Bookings' tab. If you cancel more than 24 hours before the scheduled time, you'll receive a full refund. Cancellations within 24 hours may be subject to a cancellation fee.",
  },
  {
    question: "How are service providers vetted?",
    answer:
      "All service providers undergo a thorough verification process, including identity verification, background checks, and skills assessment. We also maintain a rating system based on customer feedback to ensure quality service.",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "If you're not satisfied with the service provided, please rate the service and provide feedback. You can also contact our support team, and we'll work to resolve the issue, which may include a partial or full refund depending on the circumstances.",
  },
]

export default function HelpSupportScreen() {
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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>User Guide</Text>
          </View>

          <TouchableOpacity
            style={[styles.guideItem, { backgroundColor: colors.primary + "10" }]}
            onPress={() => {
              // Open the URL in the device's browser
              Linking.openURL("https://v0-revit-landing-page.vercel.app/")
            }}
          >
            <Text style={[styles.guideText, { color: colors.primary }]}>View Complete User Guide</Text>
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
              onPress={() => Alert.alert("Call Support", "This would initiate a call to support.")}
            >
              <Phone width={24} height={24} stroke={colors.primary} />
              <Text style={[styles.contactOptionText, { color: colors.text }]}>Call Us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactOption, { borderColor: colors.border }]}
              onPress={() => Alert.alert("Email Support", "This would open your email app.")}
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

