import React from 'react';
import { View, Switch, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Product } from '../types/shop';
import { AppText } from './AppText';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export interface ProductItemCardProps {
  product: Product;
  onToggleAvailability: (val: boolean) => void;
  onEdit: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
}

export const ProductItemCard: React.FC<ProductItemCardProps> = ({
  product,
  onToggleAvailability,
  onEdit,
  onDelete,
  style,
}) => {
  return (
    <View style={[styles.card, !product.isAvailable && styles.cardUnavailable, style]}>
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <AppText variant="captionBold" color={COLORS.textSecondary} style={styles.categoryText}>
            {product.category}
          </AppText>
        </View>

        <View style={styles.availabilityRow}>
          <AppText
            variant="captionBold"
            color={product.isAvailable ? COLORS.success : COLORS.error}
            style={styles.statusLabel}
          >
            {product.isAvailable ? 'IN STOCK' : 'OUT OF STOCK'}
          </AppText>
          <Switch
            value={product.isAvailable}
            onValueChange={onToggleAvailability}
            trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }}
            thumbColor={product.isAvailable ? COLORS.success : '#F1F5F9'}
          />
        </View>
      </View>

      {/* Main Info */}
      <View style={styles.mainInfo}>
        <AppText variant="title" color={COLORS.text} numberOfLines={1}>
          {product.name}
        </AppText>
        <AppText
          variant="caption"
          color={COLORS.textSecondary}
          numberOfLines={1}
          style={styles.tagline}
        >
          {product.tagline || product.description}
        </AppText>
      </View>

      {/* Specs & Pricing */}
      <View style={styles.bottomRow}>
        <View style={styles.priceCol}>
          <AppText variant="h3" color={COLORS.text} weight="bold">
            ₹{product.price}
          </AppText>
          <AppText variant="caption" color={COLORS.textMuted}>
            per {product.weight}
          </AppText>
        </View>

        <View style={styles.actionsRow}>
          {onDelete && (
            <TouchableOpacity activeOpacity={0.7} onPress={onDelete} style={styles.deleteBtn}>
              <AppText variant="captionBold" color={COLORS.error}>
                🗑 Delete
              </AppText>
            </TouchableOpacity>
          )}

          <TouchableOpacity activeOpacity={0.7} onPress={onEdit} style={styles.editBtn}>
            <AppText variant="captionBold" color={COLORS.primary}>
              ✏️ Edit
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardUnavailable: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.92,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryBadge: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  categoryText: {
    fontSize: 10,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  mainInfo: {
    marginVertical: SPACING.xs,
  },
  tagline: {
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  deleteBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.errorLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  editBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.sm,
  },
});
