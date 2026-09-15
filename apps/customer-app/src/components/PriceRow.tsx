import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { COLORS, SPACING } from '../constants/theme';

export interface PriceRowProps {
  label: string;
  value: number | string;
  isDiscount?: boolean;
  isTotal?: boolean;
  isFree?: boolean;
  subtitle?: string;
  style?: ViewStyle;
}

export const PriceRow: React.FC<PriceRowProps> = ({
  label,
  value,
  isDiscount = false,
  isTotal = false,
  isFree = false,
  subtitle,
  style,
}) => {
  const formattedValue = isFree
    ? 'FREE'
    : typeof value === 'number'
      ? `${isDiscount ? '−' : ''}₹${Math.abs(value)}`
      : value;

  const valueColor = isTotal ? COLORS.primary : isDiscount || isFree ? COLORS.accent : COLORS.text;

  return (
    <View style={[styles.container, isTotal && styles.totalContainer, style]}>
      <View>
        <AppText
          variant={isTotal ? 'title' : 'body'}
          color={isTotal ? COLORS.text : COLORS.textSecondary}
        >
          {label}
        </AppText>
        {subtitle && (
          <AppText variant="caption" color={COLORS.textMuted}>
            {subtitle}
          </AppText>
        )}
      </View>

      <AppText
        variant={isTotal ? 'h3' : 'bodyBold'}
        color={valueColor}
        style={isFree || isDiscount ? styles.freeText : undefined}
      >
        {formattedValue}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 2,
  },
  totalContainer: {
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.border,
  },
  freeText: {
    fontWeight: '700',
  },
});
