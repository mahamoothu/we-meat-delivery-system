import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { PriceRow } from '../components/PriceRow';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

export const OrderDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { getOrderById, cancelOrder } = useOrder();
  const { addToCart } = useCart();

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <ScreenContainer
        header={<Header title="Order Details" showBack onBackPress={() => navigation.goBack()} />}
      >
        <EmptyState
          icon="⚠️"
          title="Order Not Found"
          description="We could not find the details for this order."
          actionTitle="Back to My Orders"
          onAction={() => navigation.goBack()}
        />
      </ScreenContainer>
    );
  }

  const handleReorder = () => {
    order.items.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    navigation.navigate('Cart');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? Fresh cuts preparation will be aborted.',
      [
        { text: 'No, Keep Order', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => cancelOrder(order.id),
        },
      ],
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'WeMeat Help & Support',
      'For immediate order assistance, please call our 24/7 customer care at +91 1800 123 4567 or email support@wemeat.com',
      [{ text: 'OK' }],
    );
  };

  return (
    <ScreenContainer
      scrollable
      backgroundColor={COLORS.background}
      header={
        <Header
          title={`Order #${order.id}`}
          subtitle={order.date}
          showBack
          onBackPress={() => navigation.goBack()}
        />
      }
      style={styles.container}
    >
      {/* 1. Status Overview Card */}
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View>
            <AppText variant="caption" color={COLORS.textSecondary}>
              Current Order Status
            </AppText>
            <AppText variant="title" style={styles.etaText}>
              {order.estimatedDelivery}
            </AppText>
          </View>
          <OrderStatusBadge status={order.status} />
        </View>
      </View>

      {/* 2. Order Tracking Timeline */}
      <View style={styles.card}>
        <AppText variant="title" style={styles.cardHeader}>
          Live Order Journey
        </AppText>

        <View style={styles.timelineContainer}>
          {order.timeline.map((step, idx) => {
            const isLast = idx === order.timeline.length - 1;

            return (
              <View key={idx} style={styles.timelineStep}>
                <View style={styles.timelineLeftCol}>
                  <View
                    style={[
                      styles.timelineDot,
                      step.isCompleted && styles.timelineDotCompleted,
                      step.isCurrent && styles.timelineDotCurrent,
                    ]}
                  >
                    {step.isCompleted && (
                      <AppText variant="captionBold" color="#FFFFFF">
                        ✓
                      </AppText>
                    )}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        step.isCompleted && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineRightCol}>
                  <View style={styles.stepTitleRow}>
                    <AppText
                      variant="bodyBold"
                      color={step.isCompleted || step.isCurrent ? COLORS.text : COLORS.textMuted}
                    >
                      {step.title}
                    </AppText>
                    <AppText variant="caption" color={COLORS.textMuted}>
                      {step.timestamp}
                    </AppText>
                  </View>
                  <AppText variant="caption" color={COLORS.textSecondary}>
                    {step.description}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 3. Itemized Invoice */}
      <View style={styles.card}>
        <AppText variant="title" style={styles.cardHeader}>
          Itemized Invoice ({order.items.length} items)
        </AppText>

        {order.items.map(({ product, quantity }, idx) => (
          <View key={idx} style={styles.invoiceItemRow}>
            <View style={styles.invoiceItemInfo}>
              <AppText variant="bodyBold">{product.name}</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>
                Qty: {quantity} • {product.weight}
              </AppText>
            </View>
            <AppText variant="bodyBold">₹{product.price * quantity}</AppText>
          </View>
        ))}

        <View style={styles.divider} />

        <PriceRow label="Item Total" value={order.subtotal} />
        <PriceRow label="Delivery Fee" value={order.deliveryFee} isFree={order.deliveryFee === 0} />
        {order.discount > 0 && <PriceRow label="Discount" value={order.discount} isDiscount />}
        <PriceRow label="Total Paid" value={order.total} isTotal />
      </View>

      {/* 4. Delivery & Payment Details */}
      <View style={styles.card}>
        <AppText variant="title" style={styles.cardHeader}>
          Delivery & Payment Details
        </AppText>

        <View style={styles.infoRow}>
          <AppText style={styles.infoIcon}>📍</AppText>
          <View style={styles.infoTextCol}>
            <AppText variant="bodyBold">
              {order.deliveryAddress.name} ({order.deliveryAddress.label})
            </AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              {order.deliveryAddress.addressLine}, {order.deliveryAddress.city} -{' '}
              {order.deliveryAddress.postalCode}
            </AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              Phone: {order.deliveryAddress.phone}
            </AppText>
          </View>
        </View>

        <View style={[styles.infoRow, { marginTop: SPACING.md }]}>
          <AppText style={styles.infoIcon}>💳</AppText>
          <View style={styles.infoTextCol}>
            <AppText variant="bodyBold">Payment Method</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              {order.paymentMethod}
            </AppText>
          </View>
        </View>
      </View>

      {/* 5. Support & Action Buttons */}
      <View style={styles.actionsContainer}>
        <AppButton title="Repeat Order 🔁" variant="primary" size="lg" onPress={handleReorder} />

        <AppButton
          title="Need Help with Order? 💬"
          variant="outline"
          size="md"
          onPress={handleSupport}
        />

        {order.status === 'PENDING' && (
          <AppButton
            title="Cancel Order"
            variant="text"
            size="sm"
            onPress={handleCancel}
            textStyle={{ color: COLORS.error }}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etaText: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 2,
  },
  timelineContainer: {
    paddingLeft: SPACING.xs,
  },
  timelineStep: {
    flexDirection: 'row',
    minHeight: 52,
  },
  timelineLeftCol: {
    alignItems: 'center',
    width: 28,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineDotCompleted: {
    backgroundColor: COLORS.accent,
  },
  timelineDotCurrent: {
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginVertical: 2,
  },
  timelineLineCompleted: {
    backgroundColor: COLORS.accent,
  },
  timelineRightCol: {
    flex: 1,
    paddingLeft: SPACING.md,
    paddingBottom: SPACING.md,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  invoiceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 2,
  },
  invoiceItemInfo: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoTextCol: {
    flex: 1,
  },
  actionsContainer: {
    gap: SPACING.md,
    paddingBottom: SPACING.xxxl,
    marginTop: SPACING.sm,
  },
});
