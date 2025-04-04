"use client"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Send } from "react-native-feather"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useTheme } from "../../context/ThemeContext"
import { experts } from "../../constants/Data"

// Mock chat messages
const initialMessages = [
  {
    id: "1",
    text: "Hello! How can I help you today?",
    sender: "expert",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    text: "I need help with my car engine. It's making a strange noise.",
    sender: "client",
    timestamp: "10:32 AM",
  },
  {
    id: "3",
    text: "I can definitely help with that. Can you describe the noise?",
    sender: "expert",
    timestamp: "10:33 AM",
  },
]

export default function ChatScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const flatListRef = useRef<FlatList>(null)

  // Find the expert with the matching ID
  const expert = experts.find((e) => e.id === id)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: (messages.length + 1).toString(),
        text: newMessage.trim(),
        sender: "client",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, message])
      setNewMessage("")

      // Simulate expert response after a short delay
      setTimeout(() => {
        const response = {
          id: (messages.length + 2).toString(),
          text: "Thank you for your message. I'll get back to you shortly.",
          sender: "expert",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prevMessages) => [...prevMessages, response])
      }, 1000)
    }
  }

  const renderMessage = ({ item }: { item: (typeof messages)[0] }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "client" ? styles.clientMessage : styles.expertMessage,
        {
          backgroundColor: item.sender === "client" ? colors.primary + "20" : colors.lightGray,
        },
      ]}
    >
      <Text style={[styles.messageText, { color: colors.text }]}>{item.text}</Text>
      <Text style={[styles.timestamp, { color: colors.subtext }]}>{item.timestamp}</Text>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.text }]}>{expert?.name || "Chat"}</Text>
          <Text style={[styles.headerStatus, { color: colors.subtext }]}>Online</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={[styles.inputContainer, { borderTopColor: colors.border }]}
      >
        <TextInput
          style={[styles.input, { backgroundColor: colors.lightGray, color: colors.text }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.subtext}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: newMessage.trim() ? colors.primary : colors.lightGray }]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send width={20} height={20} stroke={newMessage.trim() ? colors.background : colors.subtext} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  headerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerStatus: {
    fontSize: 12,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  clientMessage: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  expertMessage: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})

