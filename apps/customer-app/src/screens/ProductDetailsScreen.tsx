import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { QuantitySelector } from '../components/QuantitySelector';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const CATEGORY_EMOJIS: Record<string, string> = {
  'Curry Cut': '🥘',
  Boneless: '🥩',
  Specialty: '🍗',
  'Whole Chicken': '🐔',
};

export const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const { addToCart, updateQuantity, getItemQuantity, itemCount } = useCart();

  const product = MOCK_PRODUCTS.find(p => p.id === productId);
  const inCartQty = product ? getItemQuantity(product.id) : 0;
  const [localQty, setLocalQty] = useState(inCartQty > 0 ? inCartQty : 1);

  if (!product) {
    return (
      <ScreenContainer
        header={<Header title="Product Details" showBack onBackPress={() => navigation.goBack()} />}
      >
        <EmptyState
          icon="⚠️"
          title="Product not found"
          actionTitle="Back to Catalog"
          onAction={() => navigation.goBack()}
        />
      </ScreenContainer>
    );
  }

  const emoji = CATEGORY_EMOJIS[product.category] || '🍗';

  const handleAddToCart = () => {
    addToCart(product, localQty);
  };

  return (
    <ScreenContainer
      scrollable
      backgroundColor={COLORS.background}
      header={
        <Header
          title={product.name}
          showBack
          onBackPress={() => navigation.goBack()}
          cartCount={itemCount}
          onCartPress={() => navigation.navigate('Cart')}
        />
      }
      footer={
        <View style={styles.bottomBar}>
          <View style={styles.bottomPriceCol}>
            <AppText variant="caption" color={COLORS.textSecondary}>
              Total Price
            </AppText>
            <AppText variant="h2" color={COLORS.primary}>
              ₹{product.price * (inCartQty > 0 ? inCartQty : localQty)}
            </AppText>
          </View>

          <View style={styles.bottomActionCol}>
            {inCartQty > 0 ? (
              <AppButton
                title="View in Cart →"
                variant="primary"
                size="md"
                onPress={() => navigation.navigate('Cart')}
                style={styles.ctaBtn}
              />
            ) : (
              <AppButton
                title="Add to Cart 🛒"
                variant="primary"
                size="md"
                onPress={handleAddToCart}
                style={styles.ctaBtn}
              />
            )}
          </View>
        </View>
      }
      style={styles.container}
    >
      {/* 1. Hero Image / Illustration Placeholder */}
      <View style={styles.heroWrapper}>
        <AppText style={styles.heroEmoji}>{emoji}</AppText>
        <View style={styles.freshnessTag}>
          <AppText variant="captionBold" color={COLORS.accentDark}>
            ✓ 100% Farm Fresh
          </AppText>
        </View>

        {product.badgeText && (
          <View style={styles.badge}>
            <AppText variant="captionBold" color="#FFFFFF">
              {product.badgeText}
            </AppText>
          </View>
        )}
      </View>

      {/* 2. Main Title & Pricing */}
      <View style={styles.cardSection}>
        <View style={styles.categoryRow}>
          <View style={styles.categoryPill}>
            <AppText variant="captionBold" color={COLORS.primary}>
              {product.category}
            </AppText>
          </View>
          <AppText variant="caption" color={COLORS.accentDark} style={styles.inStock}>
            ● In Stock & Ready to Cut
          </AppText>
        </View>

        <AppText variant="h2" style={styles.title}>
          {product.name}
        </AppText>

        <AppText variant="body" color={COLORS.textSecondary} style={styles.tagline}>
          {product.tagline}
        </AppText>

        <View style={styles.priceRow}>
          <AppText variant="h1" color={COLORS.text} style={styles.price}>
            ₹{product.price}
          </AppText>
          {product.originalPrice && (
            <AppText variant="title" color={COLORS.textMuted} style={styles.originalPrice}>
              ₹{product.originalPrice}
            </AppText>
          )}
          <View style={styles.discountBadge}>
            <AppText variant="captionBold" color="#FFFFFF">
              SAVE ₹{(product.originalPrice || product.price) - product.price}
            </AppText>
          </View>
        </View>
      </View>

      {/* 3. Portion & Preparation Details Grid */}
      <View style={styles.specGrid}>
        <View style={styles.specBox}>
          <AppText style={styles.specIcon}>⚖️</AppText>
          <AppText variant="caption" color={COLORS.textMuted}>
            Net Weight
          </AppText>
          <AppText variant="bodyBold">{product.weight}</AppText>
        </View>

        <View style={styles.specBox}>
          <AppText style={styles.specIcon}>🔪</AppText>
          <AppText variant="caption" color={COLORS.textMuted}>
            Pieces
          </AppText>
          <AppText variant="bodyBold">{product.pieces || 'Clean Cut'}</AppText>
        </View>

        <View style={styles.specBox}>
          <AppText style={styles.specIcon}>👥</AppText>
          <AppText variant="caption" color={COLORS.textMuted}>
            Serves
          </AppText>
          <AppText variant="bodyBold">{product.serves || '2-3 people'}</AppText>
        </View>

        <View style={styles.specBox}>
          <AppText style={styles.specIcon}>⏱️</AppText>
          <AppText variant="caption" color={COLORS.textMuted}>
            Cook Time
          </AppText>
          <AppText variant="bodyBold">{product.cookingTime || '20-25 mins'}</AppText>
        </View>
      </View>

      {/* 4. Description */}
      <View style={styles.cardSection}>
        <AppText variant="title" style={styles.sectionTitle}>
          About this Fresh Cut
        </AppText>
        <AppText variant="body" color={COLORS.textSecondary} style={styles.description}>
          {product.description}
        </AppText>
      </View>

      {/* 5. Quantity Stepper */}
      <View style={styles.quantityCard}>
        <View>
          <AppText variant="title">Select Quantity</AppText>
          <AppText variant="caption" color={COLORS.textSecondary}>
            {inCartQty > 0 ? 'Currently in your cart' : 'Units to add'}
          </AppText>
        </View>

        {inCartQty > 0 ? (
          <QuantitySelector
            quantity={inCartQty}
            onIncrease={() => updateQuantity(product.id, inCartQty + 1)}
            onDecrease={() => updateQuantity(product.id, inCartQty - 1)}
          />
        ) : (
          <QuantitySelector
            quantity={localQty}
            onIncrease={() => setLocalQty(prev => prev + 1)}
            onDecrease={() => setLocalQty(prev => Math.max(1, prev - 1))}
          />
        )}
      </View>

      {/* 6. WeMeat Freshness Promise */}
      <View style={styles.promiseCard}>
        <AppText variant="title" style={styles.promiseTitle}>
          🛡️ The WeMeat Freshness Promise
        </AppText>

        <View style={styles.promiseRow}>
          <AppText style={styles.checkIcon}>✓</AppText>
          <AppText variant="body" style={styles.promiseText}>
            100% Antibiotic & Chemical Residue Free
          </AppText>
        </View>

        <View style={styles.promiseRow}>
          <AppText style={styles.checkIcon}>✓</AppText>
          <AppText variant="body" style={styles.promiseText}>
            RO-Washed & Clean Cut on Confirmed Order
          </AppText>
        </View>

        <View style={styles.promiseRow}>
          <AppText style={styles.checkIcon}>✓</AppText>
          <AppText variant="body" style={styles.promiseText}>
            Delivered Chilled Below 4°C in Sealed Pack
          </AppText>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroWrapper: {
    height: 190,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E6',
  },
  heroEmoji: {
    fontSize: 72,
    lineHeight: 88,
    height: 88,
    textAlign: 'center',
    includeFontPadding: false,
  },
  freshnessTag: {
    position: 'absolute',
    bottom: SPACING.md,
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  cardSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  categoryPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  inStock: {
    fontSize: 12,
  },
  title: {
    fontSize: 22,
    marginBottom: 4,
  },
  tagline: {
    marginBottom: SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  price: {
    fontSize: 26,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: COLORS.accentDark,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  specBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  specIcon: {
    fontSize: 24,
    lineHeight: 30,
    height: 30,
    textAlign: 'center',
    includeFontPadding: false,
    marginBottom: 2,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
  },
  description: {
    lineHeight: 22,
  },
  quantityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  promiseCard: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.xxl,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  promiseTitle: {
    marginBottom: SPACING.md,
    color: '#166534',
  },
  promiseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  checkIcon: {
    color: COLORS.accentDark,
    fontWeight: '700',
    fontSize: 16,
  },
  promiseText: {
    flex: 1,
    color: '#14532D',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.md,
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomActionCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  ctaBtn: {
    width: '100%',
  },
});
