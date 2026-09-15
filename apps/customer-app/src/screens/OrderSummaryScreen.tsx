import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { useOrder } from '../context/OrderContext';
import { PaymentMethod } from '../types/customer';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { PriceRow } from '../components/PriceRow';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderSummary'>;

const PAYMENT_METHODS: { id: PaymentMethod; title: string; subtitle: string; icon: string }[] = [
  {
    id: 'Cash on Delivery',
    title: 'Cash on Delivery',
    subtitle: 'Pay with Cash or UPI when meat arrives',
    icon: '💵',
  },
  {
    id: 'UPI',
    title: 'UPI (GPay / PhonePe / Paytm)',
    subtitle: 'Fast instant mock digital payment',
    icon: '📱',
  },
  {
    id: 'Card',
    title: 'Credit / Debit Card',
    subtitle: 'Visa, MasterCard, RuPay mock',
    icon: '💳',
  },
];

export const OrderSummaryScreen: React.FC<Props> = ({ navigation }) => {
  const { items, subtotal, deliveryFee, discount, grandTotal, clearCart } = useCart();
  const { selectedAddress } = useAddress();
  const { placeOrder } = useOrder();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      navigation.navigate('AddressSelection', { fromCheckout: true });
      return;
    }

    setIsPlacing(true);

    setTimeout(() => {
      const order = placeOrder({
        items,
        subtotal,
        deliveryFee,
        discount,
        total: grandTotal,
        deliveryAddress: selectedAddress,
        paymentMethod,
      });

      clearCart();
      setIsPlacing(false);
      navigation.replace('OrderSuccess', { orderId: order.id });
    }, 800);
  };

  return (
    <ScreenContainer
      scrollable
      backgroundColor={COLORS.background}
      header={
        <Header title="Order Review & Payment" showBack onBackPress={() => navigation.goBack()} />
      }
      footer={
        <View style={styles.footerBar}>
          <View>
            <AppText variant="caption" color={COLORS.textSecondary}>
              To Pay
            </AppText>
            <AppText variant="h2" color={COLORS.primary}>
              ₹{grandTotal}
            </AppText>
          </View>

          <AppButton
            title={`Place Order • ₹${grandTotal}`}
            variant="primary"
            size="lg"
            loading={isPlacing}
            onPress={handlePlaceOrder}
            style={styles.placeBtn}
          />
        </View>
      }
      style={styles.container}
    >
      {/* 1. Delivery Address Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AppText variant="title">📍 Delivery Address</AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddressSelection', { fromCheckout: true })}
          >
            <AppText variant="captionBold" color={COLORS.primary}>
              Change
            </AppText>
          </TouchableOpacity>
        </View>

        {selectedAddress ? (
          <View style={styles.addressBox}>
            <AppText variant="bodyBold">
              {selectedAddress.name} ({selectedAddress.label}) • {selectedAddress.phone}
            </AppText>
            <AppText variant="body" color={COLORS.textSecondary} style={styles.addressLine}>
              {selectedAddress.addressLine}, {selectedAddress.city} - {selectedAddress.postalCode}
            </AppText>
          </View>
        ) : (
          <AppText variant="body" color={COLORS.error}>
            No address selected. Please select an address.
          </AppText>
        )}
      </View>

      {/* 2. Estimated Delivery Time */}
      <View style={styles.deliverySlotCard}>
        <AppText style={styles.clockIcon}>⚡</AppText>
        <View>
          <AppText variant="bodyBold" color={COLORS.accentDark}>
            Estimated 30-Min Delivery
          </AppText>
          <AppText variant="caption" color={COLORS.textSecondary}>
            Prepared fresh and dispatched immediately from local hub
          </AppText>
        </View>
      </View>

      {/* 3. Items Summary */}
      <View style={styles.card}>
        <AppText variant="title" style={styles.cardHeader}>
          Items Summary ({items.length})
        </AppText>

        {items.map(({ product, quantity }) => (
          <View key={product.id} style={styles.itemRow}>
            <View style={styles.itemDetails}>
              <AppText variant="bodyBold">{product.name}</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>
                Qty: {quantity} • {product.weight}
              </AppText>
            </View>
            <AppText variant="bodyBold">₹{product.price * quantity}</AppText>
          </View>
        ))}
      </View>

      {/* 4. Payment Method Selection (Mock) */}
      <View style={styles.card}>
        <AppText variant="title" style={styles.cardHeader}>
          Select Payment Method
        </AppText>

        {PAYMENT_METHODS.map(method => {
          const isSelected = paymentMethod === method.id;

          return (
            <TouchableOpacity
              key={method.id}
              activeOpacity={0.8}
              onPress={() => setPaymentMethod(method.id)}
              style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
            >
              <View style={styles.paymentRadioRow}>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>

                <AppText style={styles.paymentIcon}>{method.icon}</AppText>

                <View style={styles.paymentTextCol}>
                  <AppText variant="bodyBold">{method.title}</AppText>
                  <AppText variant="caption" color={COLORS.textSecondary}>
                    {method.subtitle}
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 5. Bill Summary */}
      <View style={[styles.card, styles.billCard]}>
        <AppText variant="title" style={styles.cardHeader}>
          Final Bill
        </AppText>

        <PriceRow label="Item Total" value={subtotal} />
        <PriceRow label="Delivery Fee" value={deliveryFee} isFree={deliveryFee === 0} />
        {discount > 0 && <PriceRow label="Discount" value={discount} isDiscount />}
        <PriceRow label="Total Payable" value={grandTotal} isTotal />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  addressBox: {
    paddingTop: 2,
  },
  addressLine: {
    marginTop: 4,
    lineHeight: 20,
  },
  deliverySlotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  clockIcon: {
    fontSize: 24,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  itemDetails: {
    flex: 1,
  },
  paymentOption: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  paymentOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F6',
  },
  paymentRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  paymentIcon: {
    fontSize: 22,
  },
  paymentTextCol: {
    flex: 1,
  },
  billCard: {
    marginBottom: SPACING.xxl,
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.md,
  },
  placeBtn: {
    minWidth: 210,
  },
});
