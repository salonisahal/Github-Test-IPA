import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';
import { products, reviews } from '../data/mockData';
import { RootStackParamList } from '../navigation';
import ProductCard from '../components/ProductCard';
import SectionTitle from '../components/SectionTitle';
import StatRow from '../components/StatRow';
import { StatusBar } from 'expo-status-bar';

type ProductRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

export default function ProductDetailsScreen() {
  const route = useRoute<ProductRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const product = products.find((item) => item.id === route.params.id);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? '');

  const related = useMemo(() => products.filter((item) => item.categoryId === product?.categoryId && item.id !== product?.id), [product]);
  const productReviews = useMemo(() => reviews.filter((item) => item.productId === product?.id), [product]);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.emptyText}>Product not found.</Text>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    navigation.navigate('Tabs', { screen: 'Cart', params: { productId: product.id } });
    Alert.alert('Added to cart', `${product.name} is ready in your cart.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} style={styles.scroll}>
        <ScrollView
          horizontal
          directionalLockEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gallery}
        >
          {[1, 2, 3].map((item) => (
            <View key={`gallery-${item}`} style={styles.galleryImage}>
              <Ionicons name="image-outline" size={30} color={colors.textDisabled} />
            </View>
          ))}
        </ScrollView>
        <View style={styles.headerRow}>
          <View style={styles.headerInfo}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.name}>{product.name}</Text>
          </View>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          {product.discountPercent > 0 ? (
            <Text style={styles.discount}>{product.discountPercent}% off</Text>
          ) : null}
        </View>
        <Text style={styles.description}>
          Tailored for daily wear with premium materials, this piece blends performance and minimalist design.
        </Text>
        <View style={styles.section}>
          <SectionTitle title="Choose Color" />
          <View style={styles.optionRow}>
            {product.colors.map((color) => (
              <Pressable
                key={color}
                onPress={() => setSelectedColor(color)}
                android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                style={({ pressed }) => [styles.optionChip, selectedColor === color && styles.optionChipActive, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
              >
                <Text style={[styles.optionText, selectedColor === color && styles.optionTextActive]}>{color}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <SectionTitle title="Select Size" />
          <View style={styles.optionRow}>
            {product.sizes.map((size) => (
              <Pressable
                key={size}
                onPress={() => setSelectedSize(size)}
                android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                style={({ pressed }) => [styles.optionChip, selectedSize === size && styles.optionChipActive, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
              >
                <Text style={[styles.optionText, selectedSize === size && styles.optionTextActive]}>{size}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <SectionTitle title="Specifications" />
          <StatRow label="Rating" value={`${product.rating.toFixed(1)} (${product.reviewCount} reviews)`} />
          <StatRow label="Material" value="Recycled performance knit" />
          <StatRow label="Warranty" value="2-year coverage" />
        </View>
        <View style={styles.section}>
          <SectionTitle title="Customer Reviews" subtitle="Verified buyers" />
          <FlatList
            data={productReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewAuthor}>{item.author}</Text>
                <Text style={styles.reviewMeta}>{item.rating} ★ · {item.date}</Text>
                <Text style={styles.reviewText}>{item.comment}</Text>
              </View>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.reviewSeparator} />}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={Platform.OS === 'android'}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        </View>
        <View style={styles.section}>
          <SectionTitle title="Related Items" subtitle="Style it together" />
        </View>
        <ScrollView
          horizontal
          directionalLockEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.relatedRow}
        >
          {related.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
            />
          ))}
        </ScrollView>
        <View style={styles.ctaRow}>
          <Pressable
            onPress={handleAddToCart}
            android_ripple={{ color: 'rgba(0,0,0,0.12)' }}
            style={({ pressed }) => [styles.ctaPrimary, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
          >
            <Text style={styles.ctaPrimaryText}>Add to Cart</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === 'web' ? { overflow: 'hidden', maxHeight: '100vh' as any } : {}),
  },
  scroll: { flex: 1 },
  container: {
    paddingBottom: s(8),
  },
  gallery: {
    paddingHorizontal: s(4),
    paddingTop: s(3),
  },
  galleryImage: {
    width: s(32),
    height: s(32),
    borderRadius: s(3),
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(3),
  },
  headerRow: {
    paddingHorizontal: s(4),
    paddingTop: s(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: { flex: 1, marginRight: s(2) },
  brand: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  name: {
    marginTop: s(1),
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 20 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  priceRow: {
    paddingHorizontal: s(4),
    paddingTop: s(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 22 * 1.2,
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
  description: {
    paddingHorizontal: s(4),
    paddingTop: s(2),
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-Regular',
  },
  section: {
    paddingHorizontal: s(4),
    paddingTop: s(4),
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(2),
    marginTop: s(2),
  },
  optionChip: {
    paddingHorizontal: s(3),
    paddingVertical: s(2),
    borderRadius: s(4),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  optionTextActive: {
    color: colors.textInverse,
  },
  reviewCard: {
    paddingVertical: s(2),
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 13 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  reviewMeta: {
    marginTop: s(1),
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 11 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  reviewText: {
    marginTop: s(1),
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Regular',
  },
  reviewSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  relatedRow: {
    paddingHorizontal: s(4),
    paddingTop: s(2),
    paddingBottom: s(4),
  },
  ctaRow: {
    paddingHorizontal: s(4),
    paddingTop: s(2),
    flexDirection: 'row',
    gap: s(2),
  },
  ctaPrimary: {
    flex: 1,
    paddingVertical: s(3),
    borderRadius: s(3),
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  ctaPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textInverse,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 16 * 1.4,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginTop: s(6),
  },
});
