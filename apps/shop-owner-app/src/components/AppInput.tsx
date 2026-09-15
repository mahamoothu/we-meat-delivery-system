import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  prefix,
  suffix,
  containerStyle,
  required = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <AppText variant="captionBold" color={COLORS.textSecondary}>
            {label}
          </AppText>
          {required && (
            <AppText variant="captionBold" color={COLORS.error}>
              {' '}
              *
            </AppText>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputRow,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
          props.multiline ? styles.inputMultiline : undefined,
        ]}
      >
        {prefix && (
          <AppText variant="bodyBold" color={COLORS.textSecondary} style={styles.prefix}>
            {prefix}
          </AppText>
        )}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {suffix && (
          <AppText variant="body" color={COLORS.textMuted} style={styles.suffix}>
            {suffix}
          </AppText>
        )}
      </View>

      {error && (
        <AppText variant="captionBold" color={COLORS.error} style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
  },
  inputMultiline: {
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    minHeight: 88,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  prefix: {
    marginRight: SPACING.sm,
  },
  suffix: {
    marginLeft: SPACING.sm,
  },
  errorText: {
    marginTop: SPACING.xs,
  },
});
