import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useProduct } from '../context/ProductContext';
import { ProductCategory } from '../types/shop';
import { PRODUCT_CATEGORIES } from '../data/mockProducts';
import { AppText } from '../components/AppText';
import { ProductItemCard } from '../components/ProductItemCard';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ProductListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { products, toggleAvailability, deleteProduct } = useProduct();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const inStockCount = products.filter(p => p.isAvailable).length;

  const handleDelete = (productId: string, productName: string) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}" from the store catalog?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProduct(productId);
            Alert.alert('Deleted', `"${productName}" has been removed.`);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header Summary & Add CTA */}
      <View style={styles.topBar}>
        <View>
          <AppText variant="captionBold" color={COLORS.textSecondary}>
            TOTAL CATALOG ITEMS: {products.length}
          </AppText>
          <AppText variant="bodyBold" color={COLORS.text}>
            {inStockCount} In Stock • {products.length - inStockCount} Out of Stock
          </AppText>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddProduct')}
          style={styles.addBtn}
        >
          <AppText variant="captionBold" color={COLORS.white}>
            ＋ Add Cut
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <AppText variant="icon" style={styles.searchIcon}>
            🔍
          </AppText>
          <TextInput
            style={styles.searchInput}
            placeholder="Search chicken cuts or descriptions..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
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

      {/* Category Pills */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {PRODUCT_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'All' ? products.length : products.filter(p => p.category === cat).length;

            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.catPill, isActive && styles.catPillActive]}
              >
                <AppText
                  variant="captionBold"
                  color={isActive ? COLORS.white : COLORS.textSecondary}
                >
                  {cat} ({count})
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product List Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon="🍗"
            title="No Products Found"
            description={
              searchQuery
                ? `No cuts match "${searchQuery}".`
                : `There are no products listed under "${selectedCategory}".`
            }
            actionTitle="Add New Cut"
            onAction={() => navigation.navigate('AddProduct')}
          />
        ) : (
          filteredProducts.map(product => (
            <ProductItemCard
              key={product.id}
              product={product}
              onToggleAvailability={() => toggleAvailability(product.id)}
              onEdit={() => navigation.navigate('EditProduct', { productId: product.id })}
              onDelete={() => handleDelete(product.id, product.name)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.md,
  },
  searchSection: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    lineHeight: 20,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  categoryContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  catPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
});
