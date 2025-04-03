"use client"
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native"
import { Search, Grid } from "react-native-feather"
import { useTheme } from "../context/ThemeContext"

interface SearchBarProps {
  onSearch: (text: string) => void
  onScanQR: () => void
}

export default function SearchBar({ onSearch, onScanQR }: SearchBarProps) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.lightGray }]}>
      <TouchableOpacity style={styles.qrButton} onPress={onScanQR}>
        <Grid width={20} height={20} stroke={colors.text} />
      </TouchableOpacity>

      <View style={styles.searchInputContainer}>
        <Search width={16} height={16} stroke={colors.subtext} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search"
          placeholderTextColor={colors.subtext}
          onChangeText={onSearch}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 8,
    marginVertical: 16,
  },
  qrButton: {
    padding: 4,
    marginRight: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
})

