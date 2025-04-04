"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, ScrollView } from "react-native"
import { Calendar, Clock, DollarSign, FileText, AlertTriangle } from "react-native-feather"
import { useTheme } from "../context/ThemeContext"
import { categories } from "../constants/Data"

interface JobPostFormProps {
  onSubmit: (jobPost: any) => void
  onCancel: () => void
}

export default function JobPostForm({ onSubmit, onCancel }: JobPostFormProps) {
  const { colors } = useTheme()
  const [service, setService] = useState("")
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    // Basic validation
    if (!service || !minBudget || !maxBudget || !date || !description) {
      alert("Please fill in all required fields")
      return
    }

    const jobPost = {
      service,
      budget: `₱${minBudget} - ₱${maxBudget}`,
      date,
      time: time || "Flexible",
      isUrgent,
      description,
    }

    onSubmit(jobPost)
  }

  const selectService = (serviceName: string) => {
    setService(serviceName)
    setShowServiceDropdown(false)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Service Type */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Service Type *</Text>
        <TouchableOpacity
          style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}
          onPress={() => setShowServiceDropdown(!showServiceDropdown)}
        >
          <FileText width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
          <Text style={[styles.placeholder, { color: service ? colors.text : colors.subtext }]}>
            {service || "Select Service Type"}
          </Text>
        </TouchableOpacity>

        {showServiceDropdown && (
          <View style={[styles.dropdownMenu, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.dropdownItem, { borderBottomColor: colors.border }]}
                onPress={() => selectService(category.name)}
              >
                <Text style={[styles.dropdownItemText, { color: colors.text }]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
              value={minBudget}
              onChangeText={setMinBudget}
              keyboardType="numeric"
            />
          </View>
          <Text style={[styles.budgetSeparator, { color: colors.subtext }]}>to</Text>
          <View style={[styles.budgetInput, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
            <DollarSign width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Max"
              placeholderTextColor={colors.subtext}
              value={maxBudget}
              onChangeText={setMaxBudget}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Date */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Date Needed *</Text>
        <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
          <Calendar width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={colors.subtext}
            value={date}
            onChangeText={setDate}
          />
        </View>
      </View>

      {/* Time */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Preferred Time (Optional)</Text>
        <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
          <Clock width={20} height={20} stroke={colors.subtext} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="e.g., Morning, Afternoon, or specific time"
            placeholderTextColor={colors.subtext}
            value={time}
            onChangeText={setTime}
          />
        </View>
      </View>

      {/* Urgency */}
      <View style={styles.formGroup}>
        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <AlertTriangle width={20} height={20} stroke={colors.error} style={styles.inputIcon} />
            <Text style={[styles.label, { color: colors.text, marginBottom: 0 }]}>Mark as Urgent</Text>
          </View>
          <Switch
            value={isUrgent}
            onValueChange={setIsUrgent}
            trackColor={{ false: colors.lightGray, true: colors.error + "70" }}
            thumbColor={isUrgent ? colors.error : "#f4f3f4"}
          />
        </View>
        <Text style={[styles.helperText, { color: colors.subtext }]}>
          Marking as urgent will highlight your job post to attract immediate attention
        </Text>
      </View>

      {/* Description */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Job Description *</Text>
        <View style={[styles.textAreaContainer, { borderColor: colors.border, backgroundColor: colors.lightGray }]}>
          <TextInput
            style={[styles.textArea, { color: colors.text }]}
            placeholder="Describe what you need help with..."
            placeholderTextColor={colors.subtext}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.cancelButton, { borderColor: colors.border }]} onPress={onCancel}>
          <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
          <Text style={[styles.submitButtonText, { color: colors.background }]}>Post Job</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  placeholder: {
    flex: 1,
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
  },
  textArea: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    paddingVertical: 12,
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
  helperText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
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
  dropdownMenu: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
  },
})

