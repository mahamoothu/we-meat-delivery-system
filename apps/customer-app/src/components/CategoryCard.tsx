import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { CategoryItem } from '../types/customer';
import { AppText } from './AppText';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export interface CategoryCardProps {
  category: CategoryItem;
  isActive: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isActive,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.pill, isActive && styles.pillActive, style]}
    >
      <AppText style={styles.icon}>{category.icon}</AppText>
      <AppText variant="captionBold" color={isActive ? '#FFFFFF' : COLORS.text} style={styles.name}>
        {category.name}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    gap: SPACING.xs + 2,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  icon: {
    fontSize: 16,
  },
  name: {
    fontSize: 13,
  },
});
