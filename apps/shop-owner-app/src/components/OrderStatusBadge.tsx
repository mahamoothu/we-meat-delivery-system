import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ShopOrderStatus } from '../types/shop';
import { AppText } from './AppText';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

export interface OrderStatusBadgeProps {
  status: ShopOrderStatus;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'md',
  style,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'PENDING ACTION',
          icon: '⏳',
          textColor: COLORS.statusPending,
          bgColor: COLORS.statusPendingBg,
        };
      case 'ACCEPTED':
        return {
          label: 'ACCEPTED',
          icon: '✓',
          textColor: COLORS.statusAccepted,
          bgColor: COLORS.statusAcceptedBg,
        };
      case 'PREPARING':
        return {
          label: 'PREPARING CUTS',
          icon: '🔪',
          textColor: COLORS.statusPreparing,
          bgColor: COLORS.statusPreparingBg,
        };
      case 'READY':
        return {
          label: 'READY FOR DISPATCH',
          icon: '📦',
          textColor: COLORS.statusReady,
          bgColor: COLORS.statusReadyBg,
        };
      case 'OUT_FOR_DELIVERY':
        return {
          label: 'OUT FOR DELIVERY',
          icon: '🛵',
          textColor: COLORS.statusOutForDelivery,
          bgColor: COLORS.statusOutForDeliveryBg,
        };
      case 'DELIVERED':
        return {
          label: 'DELIVERED',
          icon: '✓✓',
          textColor: COLORS.statusDelivered,
          bgColor: COLORS.statusDeliveredBg,
        };
      case 'REJECTED':
        return {
          label: 'REJECTED',
          icon: '✕',
          textColor: COLORS.statusRejected,
          bgColor: COLORS.statusRejectedBg,
        };
      case 'CANCELLED':
        return {
          label: 'CANCELLED',
          icon: '—',
          textColor: COLORS.statusCancelled,
          bgColor: COLORS.statusCancelledBg,
        };
      default:
        return {
          label: status,
          icon: '•',
          textColor: COLORS.textSecondary,
          bgColor: COLORS.borderLight,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bgColor },
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
        style,
      ]}
    >
      <AppText
        variant="captionBold"
        color={config.textColor}
        style={size === 'sm' ? styles.textSm : styles.textMd}
      >
        {config.icon} {config.label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeSm: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  textSm: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  textMd: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
});
