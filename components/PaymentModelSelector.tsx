"use client"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Clock, DollarSign } from "react-native-feather"
import { useTheme } from "../context/ThemeContext"

export type PaymentModel = "hourly" | "fixed"

interface PaymentModelSelectorProps {
  selectedModel: PaymentModel
  onSelectModel: (model: PaymentModel) => void
}

export default function PaymentModelSelector({ selectedModel, onSelectModel }: PaymentModelSelectorProps) {
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Payment Model</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            { borderColor: colors.border },
            selectedModel === "hourly" && { borderColor: colors.primary, backgroundColor: colors.primary + "10" },
          ]}
          onPress={() => onSelectModel("hourly")}
        >
          <Clock width={24} height={24} stroke={selectedModel === "hourly" ? colors.primary : colors.subtext} />
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color: selectedModel === "hourly" ? colors.primary : colors.text }]}>
              Per Hour
            </Text>
            <Text style={[styles.optionDescription, { color: colors.subtext }]}>Pay based on time spent</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            { borderColor: colors.border },
            selectedModel === "fixed" && { borderColor: colors.primary, backgroundColor: colors.primary + "10" },
          ]}
          onPress={() => onSelectModel("fixed")}
        >
          <DollarSign width={24} height={24} stroke={selectedModel === "fixed" ? colors.primary : colors.subtext} />
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color: selectedModel === "fixed" ? colors.primary : colors.text }]}>
              Per Job
            </Text>
            <Text style={[styles.optionDescription, { color: colors.subtext }]}>
              Pay a fixed price for the entire job
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    gap: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
})

