"use client"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { Category } from "../types"
import { CATEGORY_ICONS_LIGHT, CATEGORY_ICONS_DARK, ICON_MAP } from "../constants/ImageAssets"

interface CategoryItemProps {
  category: Category
  onPress: (category: Category) => void
  isSelected?: boolean
}

export default function CategoryItem({ category, onPress, isSelected = false }: CategoryItemProps) {
  const { colors, isDark } = useTheme()

  // Get the appropriate icon URL based on theme
  const getCategoryIconUrl = () => {
    const iconKey = ICON_MAP[category.icon as keyof typeof ICON_MAP] || "mechanic"
    return isDark
      ? CATEGORY_ICONS_DARK[iconKey as keyof typeof CATEGORY_ICONS_DARK]
      : CATEGORY_ICONS_LIGHT[iconKey as keyof typeof CATEGORY_ICONS_LIGHT]
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(category)}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isSelected ? colors.primary : colors.lightGray,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? colors.primary : "transparent",
          },
        ]}
      >
        <Image source={{ uri: getCategoryIconUrl() }} style={styles.iconImage} resizeMode="contain" />
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
    overflow: "hidden",
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  name: {
    fontSize: 12,
    textAlign: "center",
  },
})

