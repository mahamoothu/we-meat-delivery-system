import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { OrderStatus } from '../types/customer';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  style?: ViewStyle;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; icon: string }
> = {
  PENDING: {
    label: 'Order Placed',
    bg: '#FEF3C7',
    text: '#B45309',
    icon: '🕒',
  },
  ACCEPTED: {
    label: 'Accepted',
    bg: '#DBEAFE',
    text: '#1D4ED8',
    icon: '✓',
  },
  PREPARING: {
    label: 'Freshly Preparing',
    bg: '#EDE9FE',
    text: '#6D28D9',
    icon: '🔪',
  },
  READY: {
    label: 'Ready for Pickup',
    bg: '#CCFBF1',
    text: '#0F766E',
    icon: '📦',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    bg: '#FFEDD5',
    text: '#C2410C',
    icon: '🛵',
  },
  DELIVERED: {
    label: 'Delivered',
    bg: '#D1FAE5',
    text: '#047857',
    icon: '🎉',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: '#FEE2E2',
    text: '#B91C1C',
    icon: '✕',
  },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, style }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      <AppText variant="caption" style={styles.icon}>
        {config.icon}
      </AppText>
      <AppText variant="captionBold" color={config.text}>
        {config.label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
    gap: SPACING.xs,
  },
  icon: {
    fontSize: 11,
  },
});
