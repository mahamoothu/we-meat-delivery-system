import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { COLORS, SPACING } from '../constants/theme';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  retryTitle?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to complete this action. Please try again.',
  retryTitle = 'Try Again',
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <AppText variant="icon" style={styles.icon}>
          ⚠️
        </AppText>
      </View>

      <AppText variant="h3" align="center" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="body" color={COLORS.textSecondary} align="center" style={styles.message}>
        {message}
      </AppText>

      {onRetry && (
        <AppButton title={retryTitle} variant="primary" onPress={onRetry} style={styles.retryBtn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginVertical: SPACING.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 36,
    lineHeight: 44,
    height: 44,
    width: 44,
    textAlign: 'center',
    includeFontPadding: false,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  message: {
    maxWidth: 280,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  retryBtn: {
    minWidth: 160,
  },
});
