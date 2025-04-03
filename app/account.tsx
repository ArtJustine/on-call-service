import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronRight, Settings, CreditCard, Bell, Shield, HelpCircle, LogOut } from "react-native-feather"
import Colors from "../constants/Colors"

export default function AccountScreen() {
  const menuItems = [
    { icon: Settings, title: "Settings", onPress: () => alert("Settings pressed") },
    { icon: CreditCard, title: "Payment Methods", onPress: () => alert("Payment Methods pressed") },
    { icon: Bell, title: "Notifications", onPress: () => alert("Notifications pressed") },
    { icon: Shield, title: "Privacy & Security", onPress: () => alert("Privacy & Security pressed") },
    { icon: HelpCircle, title: "Help & Support", onPress: () => alert("Help & Support pressed") },
  ]

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Smith</Text>
            <Text style={styles.profileEmail}>john.smith@example.com</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <item.icon width={20} height={20} stroke={Colors.darkGray} />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight width={20} height={20} stroke={Colors.darkGray} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => alert("Logout pressed")}>
          <LogOut width={20} height={20} stroke={Colors.primary} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lightGray,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 8,
  },
  editProfileButton: {
    alignSelf: "flex-start",
  },
  editProfileText: {
    color: Colors.primary,
    fontWeight: "500",
  },
  menuSection: {
    marginTop: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
})

