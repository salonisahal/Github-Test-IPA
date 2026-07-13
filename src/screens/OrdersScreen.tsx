import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';
import { orders as mockOrders, products } from '../data/mockData';
import { Order } from '../types';
import { StatusBar } from 'expo-status-bar';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleBuyAgain = (order: Order) => {
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      status: 'Processing',
      placedAt: new Date().toISOString().split('T')[0],
      deliveryStep: 1,
    };
    setOrders((prev) => [newOrder, ...prev]);
    Alert.alert('Order created', 'A new order has been placed.');
  };

  const renderItem = ({ item }: { item: Order }) => {
    const product = products.find((p) => p.id === item.items[0]?.productId);
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderTitle}>Order #{item.id.slice(-4)}</Text>
            <Text style={styles.orderDate}>{item.placedAt}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.orderBody}>
          <View style={styles.orderImage}>
            <Ionicons name="image-outline" size={22} color={colors.textDisabled} />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderProduct}>{product?.name}</Text>
            <Text style={styles.orderMeta}>{item.items.length} items · ${item.total.toFixed(2)}</Text>
            <View style={styles.progressRow}>
              {[1, 2, 3].map((step) => (
                <View key={`step-${item.id}-${step}`} style={[styles.progressDot, item.deliveryStep >= step && styles.progressDotActive]} />
              ))}
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => handleBuyAgain(item)}
          android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
          style={({ pressed }) => [styles.buyBtn, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
        >
          <Text style={styles.buyText}>Buy Again</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <HeaderBar title="Orders" subtitle="Purchase history" />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        removeClippedSubviews={Platform.OS === 'android'}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === 'web' ? { overflow: 'hidden', maxHeight: '100vh' as any } : {}),
  },
  listContent: {
    paddingHorizontal: s(4),
    paddingBottom: s(6),
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: s(3),
    padding: s(3),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 14 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  orderDate: {
    marginTop: s(1),
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 11 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  statusPill: {
    paddingHorizontal: s(3),
    paddingVertical: s(1),
    borderRadius: s(4),
    backgroundColor: colors.primaryLight,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.2,
    lineHeight: 11 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  orderBody: {
    flexDirection: 'row',
    gap: s(3),
    alignItems: 'center',
    marginTop: s(3),
  },
  orderImage: {
    height: s(12),
    width: s(12),
    borderRadius: s(2),
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderInfo: { flex: 1 },
  orderProduct: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  orderMeta: {
    marginTop: s(1),
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  progressRow: {
    flexDirection: 'row',
    gap: s(1),
    marginTop: s(2),
  },
  progressDot: {
    width: s(2),
    height: s(2),
    borderRadius: s(1),
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.success,
  },
  buyBtn: {
    marginTop: s(3),
    paddingVertical: s(2),
    borderRadius: s(3),
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
  },
  buyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  separator: {
    height: s(2),
  },
});
