import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import HeaderBar from '../components/HeaderBar';
import QuantityStepper from '../components/QuantityStepper';
import StatRow from '../components/StatRow';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';
import { initialCart, products } from '../data/mockData';
import { CartItem } from '../types';
import { TabParamList } from '../navigation';

type CartRouteProp = RouteProp<TabParamList, 'Cart'>;

export default function CartScreen() {
  const route = useRoute<CartRouteProp>();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const productId = route.params?.productId;
    if (productId) {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { id: `cart-${Date.now()}`, productId, quantity: 1 }];
      });
    }
  }, [route.params?.productId]);

  const detailedItems = useMemo(() => {
    return cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return { ...item, product };
    });
  }, [cartItems]);

  const subtotal = detailedItems.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 12;
  const discount = subtotal > 150 ? 18 : 0;
  const total = subtotal + shipping - discount;

  const increaseQty = (id: string) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decreaseQty = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCartItems([]);
      Alert.alert('Order placed', 'Your order is confirmed and on its way.');
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <HeaderBar title="Shopping Cart" subtitle="Review and checkout" />
      <FlatList
        data={detailedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartCard}>
            <View style={styles.cartInfo}>
              <View style={styles.cartImage}>
                <Ionicons name="image-outline" size={24} color={colors.textDisabled} />
              </View>
              <View style={styles.cartMeta}>
                <Text style={styles.cartBrand}>{item.product?.brand}</Text>
                <Text style={styles.cartName}>{item.product?.name}</Text>
                <Text style={styles.cartPrice}>${item.product?.price}</Text>
              </View>
            </View>
            <View style={styles.cartActions}>
              <QuantityStepper
                value={item.quantity}
                onDecrease={() => decreaseQty(item.id)}
                onIncrease={() => increaseQty(item.id)}
              />
              <Pressable
                onPress={() => removeItem(item.id)}
                android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                style={({ pressed }) => [styles.removeBtn, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
              >
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        removeClippedSubviews={Platform.OS === 'android'}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Your cart is empty.</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.summaryCard}>
              <StatRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <StatRow label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} />
              <StatRow label="Discount" value={`-$${discount.toFixed(2)}`} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
            <Pressable
              onPress={handleCheckout}
              android_ripple={{ color: 'rgba(0,0,0,0.12)' }}
              style={({ pressed }) => [styles.checkoutBtn, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
              disabled={processing || cartItems.length === 0}
            >
              <Text style={styles.checkoutText}>{processing ? 'Processing...' : 'Checkout'}</Text>
            </Pressable>
          </View>
        }
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
    paddingBottom: s(8),
  },
  cartCard: {
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
  cartInfo: {
    flexDirection: 'row',
    gap: s(3),
    alignItems: 'center',
  },
  cartImage: {
    height: s(14),
    width: s(14),
    borderRadius: s(2),
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartMeta: { flex: 1 },
  cartBrand: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  cartName: {
    marginTop: s(1),
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  cartPrice: {
    marginTop: s(1),
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 14 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  cartActions: {
    marginTop: s(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeBtn: {
    paddingHorizontal: s(3),
    paddingVertical: s(2),
    borderRadius: s(3),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  separator: {
    height: s(2),
  },
  footer: {
    marginTop: s(3),
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: s(3),
    padding: s(3),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  totalRow: {
    marginTop: s(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 18 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  checkoutBtn: {
    marginTop: s(3),
    paddingVertical: s(3),
    borderRadius: s(3),
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textInverse,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    paddingVertical: s(6),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-Medium',
  },
});
