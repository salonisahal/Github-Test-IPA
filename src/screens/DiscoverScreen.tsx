import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderBar from '../components/HeaderBar';
import ProductCard from '../components/ProductCard';
import CategoryPill from '../components/CategoryPill';
import SectionTitle from '../components/SectionTitle';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';
import { categories, products } from '../data/mockData';
import { RootStackParamList } from '../navigation';
import { StatusBar } from 'expo-status-bar';

const promoMessages = [
  { id: 'promo-1', title: 'Weekend Essentials', subtitle: 'Up to 25% off new arrivals' },
  { id: 'promo-2', title: 'Premium Accessories', subtitle: 'Curated looks from top brands' },
];

export default function DiscoverScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<'popular' | 'price'>('popular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.2) {
        setError('Unable to refresh recommendations.');
      }
      setLoading(false);
      setRefreshing(false);
    }, 800);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategory) {
      list = list.filter((product) => product.categoryId === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter((product) => product.name.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query));
    }
    if (sortMode === 'price') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [searchQuery, selectedCategory, sortMode]);

  const trending = products.filter((product) => product.isTrending);

  const handleRetry = () => {
    loadProducts();
  };

  const renderItem = ({ item }: { item: (typeof products)[0] }) => (
    <View style={styles.listCard}>
      <Pressable
        onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
        android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
        style={StyleSheet.absoluteFillObject}
      />
      <View pointerEvents="none" style={styles.listContent}>
        <View style={styles.listImage}>
          <Ionicons name="image-outline" size={28} color={colors.textDisabled} />
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.listBrand}>{item.brand}</Text>
          <Text style={styles.listName}>{item.name}</Text>
          <Text style={styles.listMeta}>${item.price} · {item.rating.toFixed(1)} ★</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <HeaderBar title="Discover" subtitle="Curated picks for your style" />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <View style={styles.searchCard}>
              <Ionicons name="search" size={18} color={colors.textSecondary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search products, brands"
                placeholderTextColor={colors.textDisabled}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                underlineColorAndroid="transparent"
                selectionColor={colors.primary}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              <CategoryPill
                label="All"
                selected={!selectedCategory}
                onPress={() => setSelectedCategory(null)}
              />
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  label={category.name}
                  selected={selectedCategory === category.id}
                  onPress={() => setSelectedCategory(category.id)}
                />
              ))}
            </ScrollView>
            <View style={styles.promoCard}>
              <Ionicons name="sparkles" size={20} color={colors.accent} />
              <View style={styles.promoText}>
                <Text style={styles.promoTitle}>{promoMessages[0].title}</Text>
                <Text style={styles.promoSubtitle}>{promoMessages[0].subtitle}</Text>
              </View>
            </View>
            <View style={styles.sectionRow}>
              <SectionTitle title="Trending" subtitle="Popular right now" />
            </View>
            <ScrollView
              horizontal
              directionalLockEnabled
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingRow}
            >
              {trending.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => navigation.navigate('ProductDetails', { id: product.id })}
                />
              ))}
            </ScrollView>
            <View style={styles.sortRow}>
              <SectionTitle title="Recommended" subtitle="Top matches" />
              <View style={styles.sortTabs}>
                <Pressable
                  onPress={() => setSortMode('popular')}
                  android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                  style={({ pressed }) => [styles.sortTab, sortMode === 'popular' && styles.sortTabActive, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
                >
                  <Text style={[styles.sortText, sortMode === 'popular' && styles.sortTextActive]}>Popular</Text>
                </Pressable>
                <Pressable
                  onPress={() => setSortMode('price')}
                  android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                  style={({ pressed }) => [styles.sortTab, sortMode === 'price' && styles.sortTabActive, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
                >
                  <Text style={[styles.sortText, sortMode === 'price' && styles.sortTextActive]}>Price</Text>
                </Pressable>
              </View>
            </View>
            {loading ? (
              <View style={styles.loadingCard}>
                <View style={styles.loadingBlock} />
                <View style={styles.loadingBlockSmall} />
              </View>
            ) : null}
            {error ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                  onPress={handleRetry}
                  android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                  style={({ pressed }) => [styles.retryBtn, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        removeClippedSubviews={Platform.OS === 'android'}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No matches. Try another search.</Text>
            <Pressable
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                Alert.alert('Filters reset');
              }}
              android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
              style={({ pressed }) => [styles.resetBtn, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
            >
              <Text style={styles.resetText}>Reset</Text>
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
  searchCard: {
    marginHorizontal: s(4),
    marginTop: s(2),
    paddingHorizontal: s(3),
    paddingVertical: s(2),
    borderRadius: s(3),
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-Regular',
  },
  categoryRow: {
    paddingHorizontal: s(4),
    paddingTop: s(3),
    paddingBottom: s(2),
  },
  promoCard: {
    marginHorizontal: s(4),
    marginTop: s(1),
    padding: s(3),
    borderRadius: s(3),
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
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
  promoText: { flex: 1 },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 16 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  promoSubtitle: {
    marginTop: s(1),
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 13 * 1.4,
    fontFamily: 'Inter-Regular',
  },
  sectionRow: {
    paddingHorizontal: s(4),
    marginTop: s(4),
  },
  trendingRow: {
    paddingHorizontal: s(4),
    paddingBottom: s(2),
  },
  sortRow: {
    paddingHorizontal: s(4),
    marginTop: s(2),
    marginBottom: s(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: s(4),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  sortTab: {
    paddingHorizontal: s(3),
    paddingVertical: s(2),
  },
  sortTabActive: {
    backgroundColor: colors.primaryLight,
    borderRadius: s(4),
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  sortTextActive: {
    color: colors.primary,
  },
  listContentContainer: {
    paddingHorizontal: s(4),
    paddingBottom: s(6),
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: s(3),
    padding: s(3),
    overflow: 'hidden',
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
  listContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  listImage: {
    height: s(14),
    width: s(14),
    borderRadius: s(2),
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listInfo: { flex: 1 },
  listBrand: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  listName: {
    marginTop: s(1),
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  listMeta: {
    marginTop: s(1),
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  separator: {
    height: s(2),
  },
  loadingCard: {
    marginHorizontal: s(4),
    marginBottom: s(3),
    padding: s(3),
    backgroundColor: colors.surface,
    borderRadius: s(3),
  },
  loadingBlock: {
    height: s(4),
    backgroundColor: colors.border,
    borderRadius: s(2),
    marginBottom: s(2),
  },
  loadingBlockSmall: {
    height: s(3),
    width: s(24),
    backgroundColor: colors.border,
    borderRadius: s(2),
  },
  errorCard: {
    marginHorizontal: s(4),
    marginBottom: s(3),
    padding: s(3),
    backgroundColor: colors.primaryLight,
    borderRadius: s(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  retryBtn: {
    paddingHorizontal: s(3),
    paddingVertical: s(2),
    borderRadius: s(3),
    backgroundColor: colors.surface,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: s(6),
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  resetBtn: {
    marginTop: s(3),
    paddingHorizontal: s(4),
    paddingVertical: s(2),
    borderRadius: s(3),
    backgroundColor: colors.primary,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textInverse,
    letterSpacing: 1.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
});
