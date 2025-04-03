import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, CreditCard, Check } from 'react-native-feather';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

// Mock payment methods
const paymentMethods = [
  { id: '1', type: 'visa', last4: '4242', expiry: '04/25', isDefault: true },
  { id: '2', type: 'mastercard', last4: '5555', expiry: '08/24', isDefault: false },
];

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [methods, setMethods] = useState(paymentMethods);

  const handleSetDefault = (id: string) => {
    setMethods(
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  const handleAddPaymentMethod = () => {
    alert('Add payment method form would open here');
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return <CreditCard width={32} height={32} stroke={colors.primary} />;
      case 'mastercard':
        return <CreditCard width={32} height={32} stroke="#EB001B" />;
      default:
        return <CreditCard width={32} height={32} stroke={colors.darkGray} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} stroke={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={methods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.cardItem, 
              { 
                backgroundColor: colors.background,
                borderColor: colors.border 
              }
            ]}>
              <View style={styles.cardInfo}>
                {getCardIcon(item.type)}
                <View style={styles.cardDetails}>
                  <Text style={[styles.cardType, { color: colors.text }]}>{item.type.toUpperCase()}</Text>
                  <Text style={[styles.cardNumber, { color: colors.subtext }]}>•••• {item.last4}</Text>
                  <Text style={[styles.cardExpiry, { color: colors.subtext }]}>Expires {item.expiry}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.defaultButton, 
                  { borderColor: colors.primary },
                  item.isDefault && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleSetDefault(item.id)}
                disabled={item.isDefault}
              >
                {item.isDefault ? (
                  <>
                    <Check width={16} height={16} stroke={colors.background} />
                    <Text style={[styles.defaultActiveText, { color: colors.background }]}>Default</Text>
                  </>
                ) : (
                  <Text style={[styles.defaultText, { color: colors.primary }]}>Set as Default</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity 
              style={[
                styles.addButton, 
                { 
                  borderColor: colors.primary,
                  borderStyle: 'dashed' 
                }
              ]} 
              onPress={handleAddPaymentMethod}
            >
              <Plus width={20} height={20} stroke={colors.primary} />
              <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Payment Method</Text>
            </TouchableOpacity>
          }
        />
      </View>
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
  cardItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardDetails: {
    marginLeft: 12,
  },
  cardType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 14,
  },
  cardExpiry: {
    fontSize: 12,
  },
  defaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  defaultText: {
    fontSize: 14,
  },
  defaultActiveText: {
    fontSize: 14,
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
});
