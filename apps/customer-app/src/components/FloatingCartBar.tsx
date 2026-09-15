import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export interface FloatingCartBarProps {
  itemCount: number;
  total: number;
  onPress: () => void;
  style?: ViewStyle;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  itemCount,
  total,
  onPress,
  style,
}) => {
  if (itemCount <= 0) return null;

  return (
    <View style={[styles.wrapper, style]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.container}>
        <View style={styles.leftInfo}>
          <View style={styles.countBadge}>
            <AppText variant="captionBold" color="#FFFFFF">
              {itemCount}
            </AppText>
          </View>
          <View>
            <AppText variant="caption" color="rgba(255, 255, 255, 0.85)">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} added
            </AppText>
            <AppText variant="title" color="#FFFFFF" style={styles.totalText}>
              ₹{total}
            </AppText>
          </View>
        </View>

        <View style={styles.rightAction}>
          <AppText variant="bodyBold" color="#FFFFFF">
            View Cart
          </AppText>
          <AppText color="#FFFFFF" style={styles.arrowIcon}>
            →
          </AppText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    ...SHADOWS.floatingBar,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalText: {
    fontSize: 17,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
});
