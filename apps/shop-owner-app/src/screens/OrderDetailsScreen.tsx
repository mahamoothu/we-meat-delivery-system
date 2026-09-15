import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useOrder } from '../context/OrderContext';
import { ShopOrderStatus } from '../types/shop';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { ErrorState } from '../components/ErrorState';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'OrderDetails'>;

const LIFECYCLE_STAGES: { status: ShopOrderStatus; label: string; icon: string }[] = [
  { status: 'PENDING', label: 'Placed', icon: '⏳' },
  { status: 'ACCEPTED', label: 'Accepted', icon: '✓' },
  { status: 'PREPARING', label: 'Cutting', icon: '🔪' },
  { status: 'READY', label: 'Ready', icon: '📦' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out', icon: '🛵' },
  { status: 'DELIVERED', label: 'Done', icon: '✅' },
];

export function OrderDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { orderId } = route.params;
  const { getOrderById, updateOrderStatus, rejectOrder, getNextAllowedStatus } = useOrder();

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <View style={styles.container}>
        <Header title="Order Not Found" showBack onBack={() => navigation.goBack()} />
        <ErrorState
          title="Order Not Found"
          message={`No order exists with ID #${orderId}.`}
          retryTitle="Back to Orders"
          onRetry={() => navigation.goBack()}
        />
      </View>
    );
  }

  const handleAdvanceStatus = () => {
    const nextStatus = getNextAllowedStatus(order.status);
    if (!nextStatus) return;

    const res = updateOrderStatus(order.id, nextStatus);
    if (res.success) {
      Alert.alert(
        'Status Advanced',
        `Order #${order.id} is now updated to "${nextStatus.replace(/_/g, ' ')}".`,
      );
    } else {
      Alert.alert('Action Failed', res.error);
    }
  };

  const handleReject = () => {
    Alert.alert('Reject Order', `Are you sure you want to reject order #${order.id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject Order',
        style: 'destructive',
        onPress: () => {
          const res = rejectOrder(
            order.id,
            'Store inventory unable to fulfill custom cutting requests at this time.',
          );
          if (res.success) {
            Alert.alert('Order Rejected', `Order #${order.id} marked as REJECTED.`);
          } else {
            Alert.alert('Error', res.error);
          }
        },
      },
    ]);
  };

  const getStageIndex = (status: ShopOrderStatus) => {
    return LIFECYCLE_STAGES.findIndex(s => s.status === status);
  };

  const currentStageIdx = getStageIndex(order.status);

  return (
    <View style={styles.container}>
      <Header
        title={`Order #${order.id}`}
        subtitle={`Placed ${order.createdAt}`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Header & Simulation Lifecycle Bar */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeaderRow}>
            <View>
              <AppText variant="captionBold" color={COLORS.textSecondary}>
                CURRENT FULFILLMENT STAGE
              </AppText>
              <AppText variant="h3" color={COLORS.text} weight="bold" style={styles.statusTitle}>
                {order.status.replace(/_/g, ' ')}
              </AppText>
            </View>
            <OrderStatusBadge status={order.status} size="md" />
          </View>

          {/* Rejection notice if applicable */}
          {order.status === 'REJECTED' && order.rejectionReason && (
            <View style={styles.rejectionBox}>
              <AppText variant="captionBold" color={COLORS.error}>
                Rejection Reason:
              </AppText>
              <AppText variant="caption" color={COLORS.textSecondary} style={styles.rejectionText}>
                {order.rejectionReason}
              </AppText>
            </View>
          )}

          {/* Lifecycle Progress Dots */}
          {order.status !== 'REJECTED' && order.status !== 'CANCELLED' && (
            <View style={styles.progressTracker}>
              {LIFECYCLE_STAGES.map((stage, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <View key={stage.status} style={styles.stageItem}>
                    <View
                      style={[
                        styles.stageCircle,
                        isPassed && styles.stageCirclePassed,
                        isCurrent && styles.stageCircleCurrent,
                      ]}
                    >
                      <AppText
                        variant="captionBold"
                        color={isPassed ? COLORS.white : COLORS.textMuted}
                        style={styles.stageIcon}
                      >
                        {stage.icon}
                      </AppText>
                    </View>
                    <AppText
                      variant="caption"
                      weight={isCurrent ? 'bold' : 'normal'}
                      color={isPassed ? COLORS.text : COLORS.textMuted}
                      style={styles.stageLabel}
                    >
                      {stage.label}
                    </AppText>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Customer & Delivery Destination */}
        <View style={styles.sectionCard}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.sectionHeader}>
            CUSTOMER & DESTINATION
          </AppText>
          <View style={styles.customerInfoRow}>
            <View style={styles.customerAvatar}>
              <AppText variant="icon" style={styles.avatarIcon}>
                👤
              </AppText>
            </View>
            <View style={styles.customerDetails}>
              <AppText variant="title" color={COLORS.text}>
                {order.customerName}
              </AppText>
              <AppText variant="body" color={COLORS.textSecondary}>
                📞 {order.customerPhone}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.addressRow}>
            <AppText variant="icon" style={styles.addressIcon}>
              📍
            </AppText>
            <AppText variant="body" color={COLORS.textSecondary} style={styles.addressText}>
              {order.deliveryAddress}
            </AppText>
          </View>
        </View>

        {/* Special Instructions Note (if any) */}
        {order.specialInstructions && (
          <View style={styles.instructionsCard}>
            <AppText variant="icon" style={styles.instructionsIcon}>
              📝
            </AppText>
            <View style={styles.instructionsCol}>
              <AppText variant="captionBold" color={COLORS.statusPending}>
                Customer Preparation Note:
              </AppText>
              <AppText variant="body" color={COLORS.text}>
                "{order.specialInstructions}"
              </AppText>
            </View>
          </View>
        )}

        {/* Itemized Meat Cuts Breakdown */}
        <View style={styles.sectionCard}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.sectionHeader}>
            ITEMS TO PREPARE ({order.items.length})
          </AppText>

          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemQuantityBadge}>
                <AppText variant="captionBold" color={COLORS.primary}>
                  {item.quantity}x
                </AppText>
              </View>

              <View style={styles.itemInfo}>
                <AppText variant="bodyBold" color={COLORS.text}>
                  {item.product.name}
                </AppText>
                <AppText variant="caption" color={COLORS.textSecondary}>
                  Unit: {item.product.weight} • {item.product.category}
                </AppText>
                {item.specialInstructions && (
                  <AppText variant="captionBold" color={COLORS.brandRed} style={styles.itemNote}>
                    Note: {item.specialInstructions}
                  </AppText>
                )}
              </View>

              <AppText variant="bodyBold" color={COLORS.text}>
                ₹{item.product.price * item.quantity}
              </AppText>
            </View>
          ))}
        </View>

        {/* Bill & Payment Summary */}
        <View style={styles.sectionCard}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.sectionHeader}>
            PAYMENT & BILL BREAKDOWN
          </AppText>

          <View style={styles.billRow}>
            <AppText variant="body" color={COLORS.textSecondary}>
              Items Subtotal
            </AppText>
            <AppText variant="body" color={COLORS.text}>
              ₹{order.subtotal}
            </AppText>
          </View>

          <View style={styles.billRow}>
            <AppText variant="body" color={COLORS.textSecondary}>
              Delivery Fee
            </AppText>
            <AppText variant="body" color={COLORS.text}>
              {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
            </AppText>
          </View>

          {order.discount > 0 && (
            <View style={styles.billRow}>
              <AppText variant="body" color={COLORS.success}>
                Promotional Discount
              </AppText>
              <AppText variant="body" color={COLORS.success}>
                -₹{order.discount}
              </AppText>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <AppText variant="title" color={COLORS.text}>
                Total Order Value
              </AppText>
              <AppText variant="caption" color={COLORS.textMuted}>
                Mode: {order.paymentMethod}
              </AppText>
            </View>
            <AppText variant="h2" color={COLORS.primary} weight="bold">
              ₹{order.total}
            </AppText>
          </View>
        </View>

        {/* Action Controls Section */}
        <View style={styles.actionSection}>
          {order.status === 'PENDING' && (
            <View style={styles.pendingActionGrid}>
              <AppButton
                title="Reject Order"
                variant="outline"
                size="lg"
                onPress={handleReject}
                style={styles.actionHalfBtn}
                textStyle={{ color: COLORS.error }}
              />
              <AppButton
                title="Accept Order ✓"
                variant="primary"
                size="lg"
                onPress={handleAdvanceStatus}
                style={styles.actionHalfBtn}
              />
            </View>
          )}

          {order.status === 'ACCEPTED' && (
            <AppButton
              title="Start Preparing Cuts 🔪"
              variant="primary"
              size="lg"
              onPress={handleAdvanceStatus}
            />
          )}

          {order.status === 'PREPARING' && (
            <AppButton
              title="Mark Ready for Dispatch 📦"
              variant="success"
              size="lg"
              onPress={handleAdvanceStatus}
            />
          )}

          {order.status === 'READY' && (
            <AppButton
              title="Dispatch for Doorstep Delivery 🛵"
              variant="primary"
              size="lg"
              onPress={handleAdvanceStatus}
            />
          )}

          {order.status === 'OUT_FOR_DELIVERY' && (
            <AppButton
              title="Mark Order as Delivered ✓✓"
              variant="success"
              size="lg"
              onPress={handleAdvanceStatus}
            />
          )}

          {order.status === 'DELIVERED' && (
            <View style={styles.completedNotice}>
              <AppText variant="bodyBold" color={COLORS.success} align="center">
                ✓ Order Completed & Delivered
              </AppText>
            </View>
          )}

          {order.status === 'REJECTED' && (
            <View style={styles.rejectedNotice}>
              <AppText variant="bodyBold" color={COLORS.error} align="center">
                ✕ Order Rejected by Store
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    marginTop: 2,
  },
  rejectionBox: {
    backgroundColor: COLORS.errorLight,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
  },
  rejectionText: {
    marginTop: 2,
  },
  progressTracker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  stageItem: {
    alignItems: 'center',
  },
  stageCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stageCirclePassed: {
    backgroundColor: COLORS.primary,
  },
  stageCircleCurrent: {
    backgroundColor: COLORS.success,
    elevation: 3,
  },
  stageIcon: {
    fontSize: 12,
  },
  stageLabel: {
    fontSize: 10,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  sectionHeader: {
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
  },
  customerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarIcon: {
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  addressIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  addressText: {
    flex: 1,
    lineHeight: 20,
  },
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  instructionsIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
  instructionsCol: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  itemQuantityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  itemInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  itemNote: {
    marginTop: 2,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  actionSection: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  pendingActionGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionHalfBtn: {
    flex: 1,
  },
  completedNotice: {
    backgroundColor: COLORS.accentLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  rejectedNotice: {
    backgroundColor: COLORS.errorLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
});
