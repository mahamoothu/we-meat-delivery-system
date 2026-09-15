import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { ShopOrder } from '../types/shop';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { OrderStatusBadge } from './OrderStatusBadge';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export interface OrderCardProps {
  order: ShopOrder;
  onPress: () => void;
  onPrimaryAction?: () => void;
  onRejectAction?: () => void;
  style?: ViewStyle;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onPrimaryAction,
  onRejectAction,
  style,
}) => {
  const getActionButton = () => {
    switch (order.status) {
      case 'PENDING':
        return (
          <View style={styles.actionRow}>
            {onRejectAction && (
              <AppButton
                title="Reject"
                variant="outline"
                size="sm"
                onPress={onRejectAction}
                style={styles.rejectBtn}
                textStyle={{ color: COLORS.error }}
              />
            )}
            {onPrimaryAction && (
              <AppButton
                title="Accept Order ✓"
                variant="primary"
                size="sm"
                onPress={onPrimaryAction}
                style={styles.acceptBtn}
              />
            )}
          </View>
        );
      case 'ACCEPTED':
        return onPrimaryAction ? (
          <AppButton
            title="Start Preparing 🔪"
            variant="primary"
            size="sm"
            onPress={onPrimaryAction}
            style={styles.actionBtnFull}
          />
        ) : null;
      case 'PREPARING':
        return onPrimaryAction ? (
          <AppButton
            title="Mark Ready 📦"
            variant="success"
            size="sm"
            onPress={onPrimaryAction}
            style={styles.actionBtnFull}
          />
        ) : null;
      case 'READY':
        return onPrimaryAction ? (
          <AppButton
            title="Dispatch for Delivery 🛵"
            variant="primary"
            size="sm"
            onPress={onPrimaryAction}
            style={styles.actionBtnFull}
          />
        ) : null;
      case 'OUT_FOR_DELIVERY':
        return onPrimaryAction ? (
          <AppButton
            title="Mark as Delivered ✓✓"
            variant="success"
            size="sm"
            onPress={onPrimaryAction}
            style={styles.actionBtnFull}
          />
        ) : null;
      default:
        return null;
    }
  };

  const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemsSummary = order.items
    .map(item => `${item.product.name} (x${item.quantity})`)
    .join(', ');

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, style]}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.idCol}>
          <AppText variant="captionBold" color={COLORS.text}>
            #{order.id}
          </AppText>
          <AppText variant="caption" color={COLORS.textMuted} style={styles.timeAgo}>
            ⏱ {order.createdAt}
          </AppText>
        </View>

        <OrderStatusBadge status={order.status} size="sm" />
      </View>

      <View style={styles.divider} />

      {/* Customer & Items Details */}
      <View style={styles.contentRow}>
        <View style={styles.customerCol}>
          <AppText variant="bodyBold" color={COLORS.text}>
            {order.customerName}
          </AppText>
          <AppText variant="caption" color={COLORS.textSecondary}>
            📞 {order.customerPhone}
          </AppText>
        </View>

        <View style={styles.priceCol}>
          <AppText variant="h3" color={COLORS.text} weight="bold">
            ₹{order.total}
          </AppText>
          <AppText variant="caption" color={COLORS.textMuted}>
            {order.paymentMethod}
          </AppText>
        </View>
      </View>

      {/* Items Summary */}
      <View style={styles.itemsBox}>
        <AppText variant="captionBold" color={COLORS.textSecondary}>
          {totalItemsCount} item{totalItemsCount > 1 ? 's' : ''}:
        </AppText>
        <AppText
          variant="caption"
          color={COLORS.textSecondary}
          numberOfLines={2}
          style={styles.itemsText}
        >
          {itemsSummary}
        </AppText>
      </View>

      {/* Action Button Section */}
      {getActionButton() && <View style={styles.footerAction}>{getActionButton()}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  timeAgo: {
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  customerCol: {
    flex: 1,
    marginRight: SPACING.md,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  itemsBox: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  itemsText: {
    marginTop: 2,
    lineHeight: 16,
  },
  footerAction: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  rejectBtn: {
    flex: 1,
    borderColor: COLORS.error,
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
  },
  actionBtnFull: {
    width: '100%',
  },
});
