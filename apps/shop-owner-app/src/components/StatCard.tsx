import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  highlightColor?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  highlightColor = COLORS.primary,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <AppText variant="icon" style={styles.icon}>
            {icon}
          </AppText>
        </View>
        <AppText variant="captionBold" color={COLORS.textSecondary} style={styles.title}>
          {title}
        </AppText>
      </View>

      <AppText variant="h1" color={highlightColor} style={styles.value}>
        {value}
      </AppText>

      {subtitle && (
        <AppText variant="caption" color={COLORS.textMuted} style={styles.subtitle}>
          {subtitle}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs + 2,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'center',
  },
  title: {
    fontSize: 11,
    letterSpacing: 0.5,
    flex: 1,
  },
  value: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    marginTop: SPACING.xxs,
    fontSize: 11,
  },
});
