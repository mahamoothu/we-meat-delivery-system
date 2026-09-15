import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  size = 'md',
  style,
}) => {
  const isSm = size === 'sm';

  return (
    <View style={[styles.container, isSm && styles.containerSm, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrease}
        style={[styles.btn, isSm && styles.btnSm]}
      >
        <AppText
          variant={isSm ? 'captionBold' : 'bodyBold'}
          color={COLORS.primary}
          style={styles.btnText}
        >
          {quantity <= min ? '✕' : '−'}
        </AppText>
      </TouchableOpacity>

      <View style={styles.countContainer}>
        <AppText variant={isSm ? 'captionBold' : 'bodyBold'} color={COLORS.primary}>
          {quantity}
        </AppText>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrease}
        style={[styles.btn, isSm && styles.btnSm]}
      >
        <AppText
          variant={isSm ? 'captionBold' : 'bodyBold'}
          color={COLORS.primary}
          style={styles.btnText}
        >
          +
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#FECDD3',
    overflow: 'hidden',
  },
  containerSm: {
    borderRadius: BORDER_RADIUS.sm,
  },
  btn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSm: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 18,
  },
  countContainer: {
    minWidth: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
