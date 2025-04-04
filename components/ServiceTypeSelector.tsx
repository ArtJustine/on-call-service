"use client"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { MapPin, Home } from "react-native-feather"
import { useTheme } from "../context/ThemeContext"

export type ServiceType = "meetup" | "visit"

interface ServiceTypeSelectorProps {
  selectedType: ServiceType
  onSelectType: (type: ServiceType) => void
}

export default function ServiceTypeSelector({ selectedType, onSelectType }: ServiceTypeSelectorProps) {
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Service Type</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            { borderColor: colors.border },
            selectedType === "meetup" && { borderColor: colors.primary, backgroundColor: colors.primary + "10" },
          ]}
          onPress={() => onSelectType("meetup")}
        >
          <MapPin width={24} height={24} stroke={selectedType === "meetup" ? colors.primary : colors.subtext} />
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color: selectedType === "meetup" ? colors.primary : colors.text }]}>
              Meetup
            </Text>
            <Text style={[styles.optionDescription, { color: colors.subtext }]}>Expert comes to your location</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            { borderColor: colors.border },
            selectedType === "visit" && { borderColor: colors.primary, backgroundColor: colors.primary + "10" },
          ]}
          onPress={() => onSelectType("visit")}
        >
          <Home width={24} height={24} stroke={selectedType === "visit" ? colors.primary : colors.subtext} />
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color: selectedType === "visit" ? colors.primary : colors.text }]}>
              Visit
            </Text>
            <Text style={[styles.optionDescription, { color: colors.subtext }]}>You visit the expert's location</Text>
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

