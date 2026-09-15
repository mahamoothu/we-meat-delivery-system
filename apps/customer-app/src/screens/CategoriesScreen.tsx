import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockProducts';
import { ProductCategory } from '../types/customer';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { FloatingCartBar } from '../components/FloatingCartBar';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

type SortOption = 'default' | 'price_low' | 'price_high';

export const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<MainTabParamList, 'Categories'>>();
  const { addToCart, updateQuantity, getItemQuantity, grandTotal, itemCount } = useCart();

  const initialCat = (route.params?.selectedCategory as ProductCategory) || 'All';
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCat);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const products = useMemo(() => {
    let list = MOCK_PRODUCTS.filter(p => {
      return selectedCategory === 'All' || p.category === selectedCategory;
    });

    if (sortBy === 'price_low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedCategory, sortBy]);

  return (
    <ScreenContainer
      scrollable
      backgroundColor={COLORS.background}
      header={
        <Header
          title="Fresh Chicken Catalog"
          subtitle={`${products.length} fresh cuts ready`}
          showBack={false}
          cartCount={itemCount}
          onCartPress={() => navigation.navigate('Cart')}
        />
      }
      footer={
        <FloatingCartBar
          itemCount={itemCount}
          total={grandTotal}
          onPress={() => navigation.navigate('Cart')}
        />
      }
      style={styles.container}
    >
      {/* Category Pills Header */}
      <View style={styles.filterSection}>
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

        {/* Sort Chips */}
        <View style={styles.sortRow}>
          <AppText variant="captionBold" color={COLORS.textSecondary} style={styles.sortLabel}>
            Sort By:
          </AppText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSortBy('default')}
            style={[styles.sortChip, sortBy === 'default' && styles.sortChipActive]}
          >
            <AppText
              variant="caption"
              color={sortBy === 'default' ? COLORS.primary : COLORS.textSecondary}
            >
              Featured
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSortBy('price_low')}
            style={[styles.sortChip, sortBy === 'price_low' && styles.sortChipActive]}
          >
            <AppText
              variant="caption"
              color={sortBy === 'price_low' ? COLORS.primary : COLORS.textSecondary}
            >
              Price: Low → High
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSortBy('price_high')}
            style={[styles.sortChip, sortBy === 'price_high' && styles.sortChipActive]}
          >
            <AppText
              variant="caption"
              color={sortBy === 'price_high' ? COLORS.primary : COLORS.textSecondary}
            >
              Price: High → Low
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product List */}
      <View style={styles.productList}>
        {products.length === 0 ? (
          <EmptyState
            icon="🍗"
            title="No cuts in this category"
            description="Explore our full chicken menu to discover delicious cuts."
            actionTitle="View All Cuts"
            onAction={() => setSelectedCategory('All')}
          />
        ) : (
          products.map(product => (
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
  filterSection: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    gap: SPACING.sm,
  },
  sortLabel: {
    marginRight: 2,
  },
  sortChip: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#FECDD3',
  },
  productList: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
});
