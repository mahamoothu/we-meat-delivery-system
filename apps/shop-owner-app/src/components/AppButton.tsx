import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { AppText } from './AppText';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const isActionDisabled = disabled || loading;

  const combinedTextStyle: TextStyle[] = [
    styles[`text_${variant}`],
    ...(isActionDisabled ? [styles.textDisabled] : []),
    ...(Array.isArray(textStyle) ? textStyle : textStyle ? [textStyle] : []),
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isActionDisabled}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        variant === 'primary' && !isActionDisabled && SHADOWS.sm,
        isActionDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' ? COLORS.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <AppText variant={size === 'sm' ? 'captionBold' : 'bodyBold'} style={combinedTextStyle}>
            {title}
          </AppText>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.borderLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: COLORS.error,
  },
  success: {
    backgroundColor: COLORS.success,
  },
  // Sizes
  size_sm: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    minHeight: 34,
  },
  size_md: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    minHeight: 54,
  },
  // States
  disabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#E2E8F0',
    elevation: 0,
    shadowOpacity: 0,
  },
  // Text Colors
  text_primary: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  text_secondary: {
    color: COLORS.text,
    fontWeight: '600',
  },
  text_outline: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  text_text: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  text_danger: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  text_success: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textDisabled: {
    color: '#94A3B8',
  },
});
