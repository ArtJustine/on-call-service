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

<<<<<<< HEAD
  // Get the appropriate icon URL based on theme
  const getCategoryIconUrl = () => {
    const iconKey = ICON_MAP[category.icon as keyof typeof ICON_MAP] || "mechanic"
    return isDark
      ? CATEGORY_ICONS_DARK[iconKey as keyof typeof CATEGORY_ICONS_DARK]
      : CATEGORY_ICONS_LIGHT[iconKey as keyof typeof CATEGORY_ICONS_LIGHT]
=======
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
>>>>>>> a3a07a092e12a8c92461089abc973f7a800825ed
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

