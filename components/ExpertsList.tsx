import { View, Text, StyleSheet } from "react-native"
import type { Category, Expert } from "../types"
import Colors from "../constants/Colors"
import SimpleExpertCard from "./SimpleExpertCard"

// Hard-coded experts data to avoid any issues with the original data
const EXPERTS_DATA: Expert[] = [
  {
    id: "1",
    name: "John Doe",
    profession: "Mechanic",
    verified: true,
    price: "P300/job",
    description:
      "ASE certified mechanic with 12+ years of experience specializing in engine diagnostics and repair. Expert in both domestic and foreign vehicles with a focus on preventative maintenance.",
    rating: 4.8,
    image: null,
  },
  {
    id: "2",
    name: "Jane Smith",
    profession: "Electrician",
    verified: true,
    price: "P350/job",
    description:
      "Licensed master electrician with expertise in residential and commercial wiring. Specializes in troubleshooting complex electrical issues and smart home installations.",
    rating: 4.5,
    image: null,
  },
]

interface ExpertsListProps {
  searchQuery: string
  selectedCategory: Category | null
}

export default function ExpertsList({ searchQuery, selectedCategory }: ExpertsListProps) {
  const filteredExperts = EXPERTS_DATA.filter((expert) => {
    if (selectedCategory && expert.profession !== selectedCategory.name) {
      return false
    }
    if (searchQuery) {
      return (
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.profession.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  if (filteredExperts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No experts found</Text>
      </View>
    )
  }

  return (
    <View>
      {filteredExperts.map((expert) => (
        <SimpleExpertCard key={expert.id} expert={expert} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.darkGray,
    fontSize: 16,
  },
})

