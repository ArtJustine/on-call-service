import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'react-native-feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { notifications } from '../../constants/Data';
import { useTheme } from '../../context/ThemeContext';

export default function NotificationDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [replyText, setReplyText] = useState('');

  // Find the notification with the matching ID
  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft width={24} height={24} stroke={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Notification</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.subtext }]}>Notification not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isMessage = notification.title.includes('Message');

  const handleSendReply = () => {
    if (replyText.trim()) {
      alert(`Reply sent: ${replyText}`);
      setReplyText('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{notification.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[
          styles.notificationCard, 
          { 
            backgroundColor: colors.background,
            borderColor: colors.border 
          }
        ]}>
          <Text style={[styles.message, { color: colors.text }]}>{notification.message}</Text>
          <Text style={[styles.time, { color: colors.subtext }]}>{notification.time}</Text>
        </View>
      </View>

      {isMessage && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={[styles.replyContainer, { borderTopColor: colors.border }]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.lightGray,
                  color: colors.text 
                }
              ]}
              placeholder="Type your reply..."
              placeholderTextColor={colors.subtext}
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton, 
                { backgroundColor: replyText.trim() ? colors.primary : colors.subtext },
              ]}
              onPress={handleSendReply}
              disabled={!replyText.trim()}
            >
              <Send width={20} height={20} stroke={colors.background} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  time: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  replyContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
