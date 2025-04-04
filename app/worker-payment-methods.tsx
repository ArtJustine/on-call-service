"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Plus, X, CreditCard, DollarSign, User, Calendar } from "react-native-feather"
import { useRouter } from "expo-router"
import { useTheme } from "../context/ThemeContext"

// Mock payment methods data
const initialPaymentMethods = [
  {
    id: "1",
    type: "bank",
    name: "BDO Savings Account",
    accountNumber: "•••• 5678",
    accountName: "Bob Worker",
    isDefault: true,
  },
  {
    id: "2",
    type: "ewallet",
    name: "GCash",
    accountNumber: "•••• 1234",
    accountName: "Bob Worker",
    isDefault: false,
  },
]

export default function WorkerPaymentMethodsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods)
  const [showAddModal, setShowAddModal] = useState(false)

  // Form state for new payment method
  const [type, setType] = useState<"bank" | "ewallet">("bank")
  const [name, setName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")

  const handleAddPaymentMethod = () => {
    // Validate inputs
    if (!name.trim() || !accountNumber.trim() || !accountName.trim()) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    // Add new payment method
    const newPaymentMethod = {
      id: (paymentMethods.length + 1).toString(),
      type,
      name: name.trim(),
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      isDefault: paymentMethods.length === 0, // Make default if it's the first one
    }

    setPaymentMethods([...paymentMethods, newPaymentMethod])

    // Reset form and close modal
    setType("bank")
    setName("")
    setAccountNumber("")
    setAccountName("")
    setShowAddModal(false)
  }

  const handleDeletePaymentMethod = (id: string) => {
    const methodToDelete = paymentMethods.find((method) => method.id === id)

    if (methodToDelete?.isDefault) {
      Alert.alert(
        "Cannot Delete Default",
        "You cannot delete your default payment method. Please set another method as default first.",
      )
      return
    }

    Alert.alert("Delete Payment Method", "Are you sure you want to delete this payment method?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
        },
      },
    ])
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const renderPaymentMethodItem = ({ item }: { item: (typeof initialPaymentMethods)[0] }) => (
    <View style={[styles.paymentMethodCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.paymentMethodHeader}>
        {item.type === "bank" ? (
          <CreditCard width={24} height={24} stroke={colors.primary} />
        ) : (
          <DollarSign width={24} height={24} stroke={colors.primary} />
        )}

        {!item.isDefault && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePaymentMethod(item.id)}>
            <X width={20} height={20} stroke={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.paymentMethodName, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.paymentMethodAccount, { color: colors.subtext }]}>Account: {item.accountNumber}</Text>
      <Text style={[styles.paymentMethodAccount, { color: colors.subtext }]}>Name: {item.accountName}</Text>

      <View style={styles.paymentMethodFooter}>
        {item.isDefault ? (
          <View style={[styles.defaultBadge, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.defaultBadgeText, { color: colors.primary }]}>Default</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.setDefaultButton, { borderColor: colors.primary }]}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={[styles.setDefaultButtonText, { color: colors.primary }]}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Payment Methods</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Plus width={24} height={24} stroke={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={renderPaymentMethodItem}
        contentContainerStyle={styles.paymentMethodsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No payment methods yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
              Add a payment method to receive payments from clients
            </Text>
          </View>
        }
      />

      {/* Add Payment Method Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Payment Method</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X width={24} height={24} stroke={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      borderColor: colors.border,
                      backgroundColor: type === "bank" ? colors.primary : colors.background,
                    },
                  ]}
                  onPress={() => setType("bank")}
                >
                  <CreditCard width={20} height={20} stroke={type === "bank" ? colors.background : colors.primary} />
                  <Text style={[styles.typeButtonText, { color: type === "bank" ? colors.background : colors.text }]}>
                    Bank Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      borderColor: colors.border,
                      backgroundColor: type === "ewallet" ? colors.primary : colors.background,
                    },
                  ]}
                  onPress={() => setType("ewallet")}
                >
                  <DollarSign width={20} height={20} stroke={type === "ewallet" ? colors.background : colors.primary} />
                  <Text
                    style={[styles.typeButtonText, { color: type === "ewallet" ? colors.background : colors.text }]}
                  >
                    E-Wallet
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.subtext }]}>
                  {type === "bank" ? "Bank Name *" : "E-Wallet Provider *"}
                </Text>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <CreditCard width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={type === "bank" ? "e.g., BDO, BPI" : "e.g., GCash, PayMaya"}
                    placeholderTextColor={colors.subtext}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.subtext }]}>
                  {type === "bank" ? "Account Number *" : "Mobile Number *"}
                </Text>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <Calendar width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={type === "bank" ? "Enter account number" : "Enter mobile number"}
                    placeholderTextColor={colors.subtext}
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.subtext }]}>Account Name *</Text>
                <View
                  style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
                >
                  <User width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter account name"
                    placeholderTextColor={colors.subtext}
                    value={accountName}
                    onChangeText={setAccountName}
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
                onPress={handleAddPaymentMethod}
              >
                <Text style={[styles.submitButtonText, { color: colors.background }]}>Add Payment Method</Text>
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
  paymentMethodsList: {
    padding: 16,
  },
  paymentMethodCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  paymentMethodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  deleteButton: {
    padding: 4,
  },
  paymentMethodName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paymentMethodAccount: {
    fontSize: 14,
    marginBottom: 4,
  },
  paymentMethodFooter: {
    marginTop: 12,
    flexDirection: "row",
  },
  defaultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  setDefaultButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  setDefaultButtonText: {
    fontSize: 12,
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
  typeSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
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

