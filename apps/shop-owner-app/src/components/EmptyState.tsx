import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { COLORS, SPACING } from '../constants/theme';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📦',
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <AppText variant="icon" style={styles.icon}>
          {icon}
        </AppText>
      </View>

      <AppText variant="h3" align="center" style={styles.title}>
        {title}
      </AppText>

      {description && (
        <AppText
          variant="body"
          color={COLORS.textSecondary}
          align="center"
          style={styles.description}
        >
          {description}
        </AppText>
      )}

      {actionTitle && onAction && (
        <AppButton
          title={actionTitle}
          variant="primary"
          onPress={onAction}
          style={styles.actionBtn}
        />
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
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 38,
    lineHeight: 46,
    height: 46,
    width: 46,
    textAlign: 'center',
    includeFontPadding: false,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  description: {
    maxWidth: 280,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  actionBtn: {
    minWidth: 180,
  },
});
