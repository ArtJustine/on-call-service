import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookings } from '../../constants/Data';
import { useTheme } from '../../context/ThemeContext';

export default function BookingsScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Bookings</Text>
      </View>

      <View style={styles.content}>
        {bookings.length > 0 ? (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[
                styles.bookingCard, 
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border 
                }
              ]}>
                <View style={styles.bookingHeader}>
                  <Text style={[styles.serviceName, { color: colors.text }]}>{item.service}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === "completed" 
                        ? [styles.completedBadge, { backgroundColor: colors.success + '20' }] 
                        : [styles.upcomingBadge, { backgroundColor: colors.primary + '20' }],
                    ]}
                  >
                    <Text style={[
                      styles.statusText, 
                      { 
                        color: item.status === "completed" 
                          ? colors.success 
                          : colors.primary 
                      }
                    ]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.expertName, { color: colors.text }]}>Expert: {item.expertName}</Text>
                <Text style={[styles.dateTime, { color: colors.subtext }]}>
                  {item.date} at {item.time}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.bookingsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No bookings yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
              Your bookings will appear here once you schedule a service
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bookingsList: {
    paddingVertical: 16,
  },
  bookingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    // Color applied dynamically
  },
  completedBadge: {
    // Color applied dynamically
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  expertName: {
    fontSize: 14,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
