import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderBar from '../components/HeaderBar';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';
import { initialWishlist, products } from '../data/mockData';
import { RootStackParamList } from '../navigation';
import { StatusBar } from 'expo-status-bar';
import { WishlistItem } from '../types';

export default function WishlistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadWishlist = (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.2) {
        setError('Unable to refresh wishlist.');
      }
      setLoading(false);
      setRefreshing(false);
    }, 700);
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadWishlist(false);
  };

  const wishlistProducts = useMemo(() => {
    return wishlist
      .map((item) => ({
        item,
        product: products.find((product) => product.id === item.productId),
      }))
      .filter((entry) => entry.product);
  }, [wishlist]);

  const filtered = wishlistProducts.filter((entry) => {
    const query = searchQuery.toLowerCase();
    return entry.product?.name.toLowerCase().includes(query) || entry.product?.brand.toLowerCase().includes(query);
  });

  const removeItem = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (id: string) => {
    removeItem(id);
    Alert.alert('Moved to cart', 'Item added to cart for checkout.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <HeaderBar title="Wishlist" subtitle="Saved for later" />
      <View style={styles.searchCard}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search saved items"
          placeholderTextColor={colors.textDisabled}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          underlineColorAndroid="transparent"
          selectionColor={colors.primary}
        />
      </View>
      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={() => loadWishlist()}
            android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
            style={({ pressed }) => [styles.retryBtn, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.item.id}
        renderItem={({ item }) => (
          <View style={styles.wishCard}>
            <Pressable
              onPress={() => navigation.navigate('ProductDetails', { id: item.product?.id ?? '' })}
              android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
              style={StyleSheet.absoluteFillObject}
            />
            <View pointerEvents="none" style={styles.wishContent}>
              <View style={styles.wishImage}>
                <Ionicons name="image-outline" size={24} color={colors.textDisabled} />
              </View>
              <View style={styles.wishInfo}>
                <Text style={styles.wishBrand}>{item.product?.brand}</Text>
                <Text style={styles.wishName}>{item.product?.name}</Text>
                <Text style={styles.wishPrice}>${item.product?.price}</Text>
              </View>
            </View>
            <View style={styles.wishActions}>
              <Pressable
                onPress={() => moveToCart(item.item.id)}
                android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                style={({ pressed }) => [styles.wishBtnPrimary, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
              >
                <Text style={styles.wishBtnText}>Move</Text>
              </Pressable>
              <Pressable
                onPress={() => removeItem(item.item.id)}
                android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                style={({ pressed }) => [styles.wishBtnSecondary, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
              >
                <Text style={styles.wishBtnSecondaryText}>Remove</Text>
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
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingState}>
              <View style={styles.loadingCard} />
              <View style={styles.loadingCardSmall} />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{searchQuery ? 'No matches found.' : 'No saved items yet.'}</Text>
              {searchQuery ? (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                  style={({ pressed }) => [styles.resetBtn, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
                >
                  <Text style={styles.resetText}>Clear search</Text>
                </Pressable>
              ) : null}
            </View>
          )
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
    marginBottom: s(2),
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
  listContent: {
    paddingHorizontal: s(4),
    paddingBottom: s(6),
  },
  errorCard: {
    marginHorizontal: s(4),
    marginBottom: s(2),
    padding: s(3),
    borderRadius: s(3),
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    gap: s(2),
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  retryBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(3),
    paddingVertical: s(1),
    borderRadius: s(3),
    backgroundColor: colors.primaryLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  loadingState: {
    marginHorizontal: s(4),
    marginTop: s(2),
    gap: s(2),
  },
  loadingCard: {
    height: s(14),
    borderRadius: s(3),
    backgroundColor: colors.border,
  },
  loadingCardSmall: {
    height: s(10),
    borderRadius: s(3),
    backgroundColor: colors.border,
  },
  resetBtn: {
    marginTop: s(2),
    paddingHorizontal: s(3),
    paddingVertical: s(1),
    borderRadius: s(3),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  wishCard: {
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
  wishContent: {
    flexDirection: 'row',
    gap: s(3),
    alignItems: 'center',
  },
  wishImage: {
    height: s(14),
    width: s(14),
    borderRadius: s(2),
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishInfo: { flex: 1 },
  wishBrand: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  wishName: {
    marginTop: s(1),
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  wishPrice: {
    marginTop: s(1),
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 14 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  wishActions: {
    flexDirection: 'row',
    gap: s(2),
    marginTop: s(3),
  },
  wishBtnPrimary: {
    flex: 1,
    paddingVertical: s(2),
    borderRadius: s(3),
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  wishBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textInverse,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  wishBtnSecondary: {
    flex: 1,
    paddingVertical: s(2),
    borderRadius: s(3),
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
  },
  wishBtnSecondaryText: {
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
