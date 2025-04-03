"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native"
import { ChevronDown } from "react-native-feather"
import { useTheme } from "../context/ThemeContext"
import { locations } from "../constants/Data"
import type { Location } from "../types"

interface LocationSelectorProps {
  selectedLocation: Location
  onSelectLocation: (location: Location) => void
}

export default function LocationSelector({ selectedLocation, onSelectLocation }: LocationSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const { colors } = useTheme()

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
        <Text style={[styles.locationText, { color: colors.subtext }]}>{selectedLocation.name}</Text>
        <ChevronDown width={12} height={12} stroke={colors.subtext} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Location</Text>
            <FlatList
              data={locations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.locationItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    onSelectLocation(item)
                    setModalVisible(false)
                  }}
                >
                  <Text
                    style={[
                      styles.locationItemText,
                      { color: colors.text },
                      selectedLocation.id === item.id && { color: colors.primary, fontWeight: "bold" },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  locationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  locationItemText: {
    fontSize: 16,
  },
})

