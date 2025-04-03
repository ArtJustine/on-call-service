import { View, StyleSheet } from "react-native"
import { Check } from "react-native-feather"
import Colors from "../constants/Colors"

export default function VerifiedBadge() {
  return (
    <View style={styles.container}>
      <Check width={12} height={12} stroke="#FFFFFF" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
})

