import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
};

export default function ProductCard({ product, onPress, onToggleWishlist, isWishlisted }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
        style={StyleSheet.absoluteFillObject}
      />
      <View pointerEvents="none" style={styles.content}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={24} color={colors.textDisabled} />
        </View>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>${product.price}</Text>
          {product.discountPercent > 0 ? (
            <Text style={styles.discount}>-{product.discountPercent}%</Text>
          ) : null}
        </View>
      </View>
      {onToggleWishlist ? (
        <Pressable
          onPress={onToggleWishlist}
          android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [styles.heart, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
        >
          <Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={18} color={isWishlisted ? colors.error : colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: s(3),
    padding: s(3),
    width: s(34),
    marginRight: s(3),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  content: {
    gap: s(2),
  },
  imagePlaceholder: {
    height: s(22),
    borderRadius: s(2),
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 16 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  discount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  heart: {
    position: 'absolute',
    top: s(2),
    right: s(2),
    height: s(5),
    width: s(5),
    borderRadius: s(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
});
