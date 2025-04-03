import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'react-native-feather';
import { useRouter } from 'expo-router';
import { notifications } from '../constants/Data';
import { useTheme } from '../context/ThemeContext';

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleNotificationPress = (id: string) => {
    router.push(`/notifications/${id}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notificationItem, 
              { 
                backgroundColor: colors.background,
                borderColor: colors.border 
              },
              !item.read && { 
                backgroundColor: colors.primary + '10',
                borderColor: colors.primary + '30'
              }
            ]}
            onPress={() => handleNotificationPress(item.id)}
          >
            <Text style={[styles.notificationTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.notificationMessage, { color: colors.subtext }]} numberOfLines={2}>
              {item.message}
            </Text>
            <Text style={[styles.notificationTime, { color: colors.subtext }]}>{item.time}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.notificationsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
});
