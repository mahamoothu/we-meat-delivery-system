import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  cartCount?: number;
  onCartPress?: () => void;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  onBackPress,
  rightAction,
  cartCount = 0,
  onCartPress,
  style,
}) => {
  const handleBack = onBackPress || onBack;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftRow}>
        {showBack && handleBack && (
          <TouchableOpacity activeOpacity={0.7} onPress={handleBack} style={styles.backBtn}>
            <AppText style={styles.backIcon}>←</AppText>
          </TouchableOpacity>
        )}

        <View style={styles.titleCol}>
          <AppText variant="title" numberOfLines={1} style={styles.title}>
            {title}
          </AppText>
          {subtitle && (
            <AppText variant="caption" color={COLORS.textSecondary} numberOfLines={1}>
              {subtitle}
            </AppText>
          )}
        </View>
      </View>

      <View style={styles.rightRow}>
        {rightAction}

        {onCartPress && (
          <TouchableOpacity activeOpacity={0.7} onPress={onCartPress} style={styles.cartBtn}>
            <AppText style={styles.cartIcon}>🛒</AppText>
            {cartCount > 0 && (
              <View style={styles.badge}>
                <AppText variant="captionBold" color="#FFFFFF" style={styles.badgeText}>
                  {cartCount}
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    minHeight: 56,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    paddingRight: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '700',
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 17,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cartBtn: {
    padding: SPACING.xs,
    position: 'relative',
  },
  cartIcon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
  },
});
