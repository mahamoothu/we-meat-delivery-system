import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BANNERS } from '../data/mockProducts';
import { ProductCategory } from '../types/customer';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppText } from '../components/AppText';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { FloatingCartBar } from '../components/FloatingCartBar';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { selectedAddress } = useAddress();
  const { items, addToCart, updateQuantity, getItemQuantity, grandTotal, itemCount } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const bestsellers = useMemo(() => MOCK_PRODUCTS.filter(p => p.isBestseller), []);

  return (
    <ScreenContainer
      scrollable
      backgroundColor={COLORS.background}
      style={styles.container}
      footer={
        <FloatingCartBar
          itemCount={itemCount}
          total={grandTotal}
          onPress={() => navigation.navigate('Cart')}
        />
      }
    >
      {/* 1. Header Location Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddressSelection', { fromCheckout: false })}
          style={styles.locationSelector}
        >
          <AppText style={styles.locationIcon}>📍</AppText>
          <View style={styles.locationTextCol}>
            <View style={styles.locationLabelRow}>
              <AppText variant="captionBold" color={COLORS.text}>
                Deliver to {selectedAddress?.label || 'Home'}
              </AppText>
              <AppText variant="caption" color={COLORS.primary}>
                {' '}
                ▾
              </AppText>
            </View>
            <AppText
              variant="caption"
              color={COLORS.textSecondary}
              numberOfLines={1}
              style={styles.addressSnippet}
            >
              {selectedAddress?.addressLine || 'Select delivery location'}
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartIconBtn}
        >
          <AppText style={styles.cartIconText}>🛒</AppText>
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <AppText variant="captionBold" color="#FFFFFF" style={styles.badgeCount}>
                {itemCount}
              </AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <AppText style={styles.searchIcon}>🔍</AppText>
          <TextInput
            placeholder="Search fresh chicken cuts, drumsticks, breast..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AppText variant="captionBold" color={COLORS.textMuted}>
                ✕
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3. Promotional Banners */}
      {searchQuery.length === 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerScroll}
        >
          {MOCK_BANNERS.map(banner => (
            <View
              key={banner.id}
              style={[styles.bannerCard, { backgroundColor: banner.backgroundColor }]}
            >
              <View style={styles.bannerBadge}>
                <AppText variant="captionBold" color={banner.textColor}>
                  CODE: {banner.code}
                </AppText>
              </View>
              <AppText variant="title" color={banner.textColor} style={styles.bannerTitle}>
                {banner.title}
              </AppText>
              <AppText variant="caption" color={COLORS.textSecondary} style={styles.bannerSubtitle}>
                {banner.subtitle}
              </AppText>
            </View>
          ))}
        </ScrollView>
      )}

      {/* 4. Category Pills */}
      <View style={styles.categorySection}>
        <View style={styles.sectionHeader}>
          <AppText variant="title">Explore Chicken Cuts</AppText>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {MOCK_CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isActive={selectedCategory === cat.name}
              onPress={() => setSelectedCategory(cat.name)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 5. Bestseller Carousel (when viewing All with no search) */}
      {selectedCategory === 'All' && searchQuery.length === 0 && (
        <View style={styles.bestsellerSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.bestsellerTitleRow}>
              <AppText style={styles.fireIcon}>🔥</AppText>
              <AppText variant="title">Popular Bestsellers</AppText>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MainTabs', {
                  screen: 'Categories',
                  params: { selectedCategory: 'All' },
                })
              }
            >
              <AppText variant="captionBold" color={COLORS.primary}>
                View All →
              </AppText>
            </TouchableOpacity>
          </View>

          {bestsellers.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={getItemQuantity(product.id)}
              onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
              onAddToCart={() => addToCart(product, 1)}
              onIncrease={() => updateQuantity(product.id, getItemQuantity(product.id) + 1)}
              onDecrease={() => updateQuantity(product.id, getItemQuantity(product.id) - 1)}
            />
          ))}
        </View>
      )}

      {/* 6. Product Listing Grid */}
      <View style={styles.productSection}>
        <View style={styles.sectionHeader}>
          <AppText variant="title">
            {searchQuery
              ? `Results for "${searchQuery}" (${filteredProducts.length})`
              : selectedCategory === 'All'
                ? 'All Fresh Cuts'
                : `${selectedCategory} (${filteredProducts.length})`}
          </AppText>
        </View>

        {filteredProducts.length === 0 ? (
          <EmptyState
            icon="🍗"
            title="No cuts found"
            description="Try changing your search query or browsing another category."
            actionTitle="View All Cuts"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={getItemQuantity(product.id)}
              onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
              onAddToCart={() => addToCart(product, 1)}
              onIncrease={() => updateQuantity(product.id, getItemQuantity(product.id) + 1)}
              onDecrease={() => updateQuantity(product.id, getItemQuantity(product.id) - 1)}
            />
          ))
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
  },
  locationIcon: {
    fontSize: 22,
    marginRight: SPACING.sm,
  },
  locationTextCol: {
    flex: 1,
  },
  locationLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressSnippet: {
    maxWidth: 220,
    marginTop: 1,
  },
  cartIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartIconText: {
    fontSize: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCount: {
    fontSize: 10,
  },
  searchSection: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  bannerScroll: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  bannerCard: {
    width: 280,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
    marginBottom: SPACING.xs,
  },
  bannerTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  bannerSubtitle: {
    lineHeight: 18,
  },
  categorySection: {
    marginTop: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  bestsellerSection: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  bestsellerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  fireIcon: {
    fontSize: 18,
  },
  productSection: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
});
