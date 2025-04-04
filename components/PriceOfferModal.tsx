"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { X } from "react-native-feather"
import { useTheme } from "../context/ThemeContext"
import type { PaymentModel } from "./PaymentModelSelector"
import type { Expert } from "../types"

interface PriceOfferModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (price: number) => void
  paymentModel: PaymentModel
  expert: Expert
}

export default function PriceOfferModal({ visible, onClose, onSubmit, paymentModel, expert }: PriceOfferModalProps) {
  const { colors } = useTheme()
  const [price, setPrice] = useState("")
  const [suggestedPrice, setSuggestedPrice] = useState(0)

  // Calculate suggested price based on expert's rate and payment model
  useEffect(() => {
    let basePrice = 0

    // Extract numeric value from expert's price (e.g., "P300/job" -> 300)
    const expertBasePrice = Number.parseInt(expert.price.replace(/[^0-9]/g, ""))

    if (paymentModel === "hourly") {
      // For hourly, suggest a fair hourly rate based on expert's job price
      // Assuming a typical job takes 2 hours
      basePrice = Math.round(expertBasePrice / 2)
    } else {
      // For fixed price, use the expert's standard job price
      basePrice = expertBasePrice
    }

    setSuggestedPrice(basePrice)
    setPrice(basePrice.toString())
  }, [expert, paymentModel])

  const handleSubmit = () => {
    const numericPrice = Number.parseFloat(price)
    if (!isNaN(numericPrice) && numericPrice > 0) {
      onSubmit(numericPrice)
    }
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Make an Offer</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X width={24} height={24} stroke={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.modalSubtitle, { color: colors.subtext }]}>
            {paymentModel === "hourly" ? "Set your hourly rate offer" : "Set your fixed price offer for this job"}
          </Text>

          <View style={styles.priceInputContainer}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>₱</Text>
            <TextInput
              style={[styles.priceInput, { color: colors.text, borderBottomColor: colors.border }]}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={colors.subtext}
            />
            <Text style={[styles.priceUnit, { color: colors.subtext }]}>
              {paymentModel === "hourly" ? "/hour" : ""}
            </Text>
          </View>

          <View style={[styles.suggestedPriceContainer, { backgroundColor: colors.primary + "10" }]}>
            <Text style={[styles.suggestedPriceText, { color: colors.text }]}>
              Suggested price: ₱{suggestedPrice}
              {paymentModel === "hourly" ? "/hour" : ""}
            </Text>
            <Text style={[styles.suggestedPriceDescription, { color: colors.subtext }]}>
              Based on {expert.name}'s standard rates and market average
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.cancelButton, { borderColor: colors.border }]} onPress={onClose}>
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
              <Text style={[styles.submitButtonText, { color: colors.background }]}>Send Offer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  priceUnit: {
    fontSize: 18,
    marginLeft: 8,
  },
  suggestedPriceContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  suggestedPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  suggestedPriceDescription: {
    fontSize: 14,
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

