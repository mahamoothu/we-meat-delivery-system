import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Product } from '../types/customer';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { QuantitySelector } from './QuantitySelector';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export interface ProductCardProps {
  product: Product;
  quantityInCart?: number;
  onPress: () => void;
  onAddToCart: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  style?: ViewStyle;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  'Curry Cut': '🥘',
  Boneless: '🥩',
  Specialty: '🍗',
  'Whole Chicken': '🐔',
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart = 0,
  onPress,
  onAddToCart,
  onIncrease,
  onDecrease,
  style,
}) => {
  const emoji = CATEGORY_EMOJIS[product.category] || '🍗';

  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={[styles.card, style]}>
      {/* Product Image / Illustration Placeholder */}
      <View style={styles.imageWrapper}>
        <View style={styles.imagePlaceholder}>
          <AppText style={styles.emoji}>{emoji}</AppText>
          <View style={styles.farmTag}>
            <AppText variant="captionBold" color={COLORS.accentDark} style={styles.farmText}>
              100% FRESH
            </AppText>
          </View>
        </View>

        {product.badgeText && (
          <View style={styles.badge}>
            <AppText variant="captionBold" color="#FFFFFF" style={styles.badgeText}>
              {product.badgeText}
            </AppText>
          </View>
        )}
      </View>

      {/* Product Content */}
      <View style={styles.infoContainer}>
        <View style={styles.metaRow}>
          <AppText variant="captionBold" color={COLORS.textSecondary}>
            {product.weight}
          </AppText>
          {product.pieces && (
            <>
              <AppText variant="caption" color={COLORS.textMuted}>
                {' '}
                •{' '}
              </AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>
                {product.pieces}
              </AppText>
            </>
          )}
        </View>

        <AppText variant="bodyBold" numberOfLines={2} style={styles.name}>
          {product.name}
        </AppText>

        <AppText
          variant="caption"
          numberOfLines={1}
          color={COLORS.textMuted}
          style={styles.tagline}
        >
          {product.tagline}
        </AppText>

        {/* Pricing & Add to Cart action */}
        <View style={styles.footerRow}>
          <View style={styles.priceCol}>
            <View style={styles.priceRow}>
              <AppText variant="price" color={COLORS.text} style={styles.currentPrice}>
                ₹{product.price}
              </AppText>
              {product.originalPrice && product.originalPrice > product.price && (
                <AppText variant="caption" color={COLORS.textMuted} style={styles.originalPrice}>
                  ₹{product.originalPrice}
                </AppText>
              )}
            </View>
            <AppText variant="caption" color={COLORS.textMuted}>
              net wt. {product.weight}
            </AppText>
          </View>

          <View style={styles.actionCol}>
            {quantityInCart > 0 ? (
              <QuantitySelector
                size="sm"
                quantity={quantityInCart}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
              />
            ) : (
              <AppButton
                title="ADD +"
                size="sm"
                variant="outline"
                onPress={onAddToCart}
                style={styles.addBtn}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  imageWrapper: {
    height: 125,
    backgroundColor: '#FFF1F2',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    lineHeight: 60,
    height: 60,
    textAlign: 'center',
    includeFontPadding: false,
  },
  farmTag: {
    position: 'absolute',
    bottom: -16,
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  farmText: {
    fontSize: 9,
    letterSpacing: 0.5,
  },
  badge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  badgeText: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  infoContainer: {
    padding: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
  },
  tagline: {
    marginBottom: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceCol: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  currentPrice: {
    fontSize: 17,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  actionCol: {
    minWidth: 85,
    alignItems: 'flex-end',
  },
  addBtn: {
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
});
