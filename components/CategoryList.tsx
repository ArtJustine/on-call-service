import { FlatList, StyleSheet } from "react-native"
import type { Category } from "../types"
import CategoryItem from "./CategoryItem"

interface CategoryListProps {
  categories: Category[]
  onCategoryPress: (category: Category) => void
}

export default function CategoryList({ categories, onCategoryPress }: CategoryListProps) {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CategoryItem category={item} onPress={onCategoryPress} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesList}
    />
  )
}

const styles = StyleSheet.create({
  categoriesList: {
    gap: 16,
  },
})

