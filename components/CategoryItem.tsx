"use client"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Tool, Zap, Droplet, Edit2, Thermometer, Scissors, Settings, Lock } from "react-native-feather"
import { useTheme } from "../context/ThemeContext"
import type { Category } from "../types"

interface CategoryItemProps {
  category: Category
  onPress: (category: Category) => void
  isSelected?: boolean
}

export default function CategoryItem({ category, onPress, isSelected = false }: CategoryItemProps) {
  const { colors } = useTheme()

  const getIcon = () => {
    const iconColor = isSelected ? colors.background : colors.primary
    const size = 24

    switch (category.icon) {
      case "tool":
        return <Tool width={size} height={size} stroke={iconColor} />
      case "zap":
        return <Zap width={size} height={size} stroke={iconColor} />
      case "droplet":
        return <Droplet width={size} height={size} stroke={iconColor} />
      case "edit-2":
        return <Edit2 width={size} height={size} stroke={iconColor} />
      case "thermometer":
        return <Thermometer width={size} height={size} stroke={iconColor} />
      case "scissors":
        return <Scissors width={size} height={size} stroke={iconColor} />
      case "settings":
        return <Settings width={size} height={size} stroke={iconColor} />
      case "lock":
        return <Lock width={size} height={size} stroke={iconColor} />
      case "hammer":
        return <Tool width={size} height={size} stroke={iconColor} />
      case "paintbrush":
        return <Edit2 width={size} height={size} stroke={iconColor} />
      case "washing-machine":
        return <Settings width={size} height={size} stroke={iconColor} />
      default:
        return <Tool width={size} height={size} stroke={iconColor} />
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(category)}>
      <View style={[styles.iconContainer, { backgroundColor: isSelected ? colors.primary : colors.lightGray }]}>
        {getIcon()}
      </View>
      <Text
        style={[styles.name, { color: colors.text }, isSelected && { color: colors.primary, fontWeight: "bold" }]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 80,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    textAlign: "center",
  },
})

