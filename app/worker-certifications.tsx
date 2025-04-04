"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Plus, X, Award, Calendar, FileText } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"

// Mock certifications data
const initialCertifications = [
  {
    id: "1",
    title: "Certified Automotive Technician",
    issuer: "Automotive Service Excellence (ASE)",
    date: "June 2018",
    description: "Certification in engine repair, brake systems, and electrical systems.",
  },
  {
    id: "2",
    title: "Advanced Engine Diagnostics",
    issuer: "Technical Education and Skills Development Authority",
    date: "March 2020",
    description: "Specialized training in computer-based engine diagnostics and troubleshooting.",
  },
]

export default function WorkerCertificationsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [certifications, setCertifications] = useState(initialCertifications)
  const [showAddModal, setShowAddModal] = useState(false)

  // Form state for new certification
  const [title, setTitle] = useState("")
  const [issuer, setIssuer] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")

  const handleAddCertification = () => {
    // Validate inputs
    if (!title.trim() || !issuer.trim() || !date.trim()) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    // Add new certification
    const newCertification = {
      id: (certifications.length + 1).toString(),
      title: title.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      description: description.trim(),
    }

    setCertifications([...certifications, newCertification])

    // Reset form and close modal
    setTitle("")
    setIssuer("")
    setDate("")
    setDescription("")
    setShowAddModal(false)
  }

  const handleDeleteCertification = (id: string) => {
    Alert.alert("Delete Certification", "Are you sure you want to delete this certification?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setCertifications(certifications.filter((cert) => cert.id !== id))
        },
      },
    ])
  }

  const renderCertificationItem = ({ item }: { item: (typeof initialCertifications)[0] }) => (
    <View style={[styles.certificationCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.certificationHeader}>
        <Award width={24} height={24} stroke={colors.primary} />
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCertification(item.id)}>
          <X width={20} height={20} stroke={colors.error} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.certificationTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.certificationIssuer, { color: colors.subtext }]}>{item.issuer}</Text>
      <Text style={[styles.certificationDate, { color: colors.subtext }]}>{item.date}</Text>

      {item.description && (
        <Text style={[styles.certificationDescription, { color: colors.text }]}>{item.description}</Text>
      )}
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Certifications</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Plus width={24} height={24} stroke={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={certifications}
        keyExtractor={(item) => item.id}
        renderItem={renderCertificationItem}
        contentContainerStyle={styles.certificationsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No certifications yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
              Add your professional certifications to showcase your expertise
            </Text>
          </View>
        }
      />

      {/* Add Certification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Certification</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X width={24} height={24} stroke={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.subtext }]}>Certification Title *</Text>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <Award width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="e.g., Certified Mechanic"
                    placeholderTextColor={colors.subtext}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.subtext }]}>Issuing Organization *</Text>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <FileText width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="e.g., Automotive Service Excellence"
                    placeholderTextColor={colors.subtext}
                    value={issuer}
                    onChangeText={setIssuer}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.subtext }]}>Date Received *</Text>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <Calendar width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="e.g., June 2020"
                    placeholderTextColor={colors.subtext}
                    value={date}
                    onChangeText={setDate}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.subtext }]}>Description (Optional)</Text>
                <View
                  style={[styles.textAreaContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <TextInput
                    style={[styles.textArea, { color: colors.text }]}
                    placeholder="Describe what this certification covers"
                    placeholderTextColor={colors.subtext}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleAddCertification}
              >
                <Text style={[styles.submitButtonText, { color: colors.background }]}>Add Certification</Text>
              </TouchableOpacity>
            </View>
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
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  certificationsList: {
    padding: 16,
  },
  certificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  certificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  deleteButton: {
    padding: 4,
  },
  certificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  certificationIssuer: {
    fontSize: 16,
    marginBottom: 4,
  },
  certificationDate: {
    fontSize: 14,
    marginBottom: 12,
  },
  certificationDescription: {
    fontSize: 14,
    lineHeight: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  formSection: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  textArea: {
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
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
})

