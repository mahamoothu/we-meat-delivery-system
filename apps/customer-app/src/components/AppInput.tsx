import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { AppText } from './AppText';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  onRightIconPress?: () => void;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  prefix,
  leftIcon,
  rightIcon,
  containerStyle,
  onRightIconPress,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText variant="captionBold" color={COLORS.textSecondary} style={styles.label}>
          {label}
        </AppText>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        {prefix && (
          <View style={styles.prefixContainer}>
            <AppText variant="bodyBold" color={COLORS.text}>
              {prefix}
            </AppText>
          </View>
        )}

        <TextInput
          placeholderTextColor={COLORS.textMuted}
          style={[styles.input, style]}
          onFocus={e => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
            style={styles.iconContainer}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <AppText variant="caption" color={COLORS.error} style={styles.errorText}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs + 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: 52,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  prefixContainer: {
    paddingRight: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: SPACING.sm,
  },
  iconContainer: {
    padding: SPACING.xs,
  },
  errorText: {
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});
