import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyBold'
  | 'caption'
  | 'captionBold'
  | 'price'
  | 'muted'
  | 'icon';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  weight?: 'regular' | 'normal' | 'medium' | 'semibold' | 'bold' | 'heavy';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  weight,
  align,
  style,
  children,
  ...props
}) => {
  const dynamicStyle: TextStyle = {
    ...(color ? { color } : {}),
    ...(align ? { textAlign: align } : {}),
    ...(weight ? { fontWeight: TYPOGRAPHY.fontWeight[weight] } : {}),
  };

  return (
    <Text style={[styles.base, styles[variant], dynamicStyle, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  display: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: TYPOGRAPHY.fontWeight.heavy,
    lineHeight: 42,
    color: COLORS.text,
  },
  h1: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.lineHeight.xxl,
    color: COLORS.text,
  },
  h2: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.lineHeight.xl,
    color: COLORS.text,
  },
  h3: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.lg,
    color: COLORS.text,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.md,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
  },
  body: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.text,
  },
  bodyBold: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.text,
  },
  caption: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    color: COLORS.textSecondary,
  },
  captionBold: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    color: COLORS.text,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  muted: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  icon: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});
