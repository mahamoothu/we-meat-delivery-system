import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { QuantitySelector } from '../components/QuantitySelector';
import { PriceRow } from '../components/PriceRow';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const DELIVERY_INSTRUCTIONS = [
  '🔔 Ring door bell',
  '🚪 Leave at door',
  '📞 Call upon arrival',
  '🛡️ Contactless drop-off',
];

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    grandTotal,
    isFreeDelivery,
  } = useCart();

  const [selectedInstruction, setSelectedInstruction] = useState(DELIVERY_INSTRUCTIONS[0]);

  if (items.length === 0) {
    return (
      <ScreenContainer
        header={<Header title="My Cart" showBack onBackPress={() => navigation.goBack()} />}
      >
        <EmptyState
          icon="🛒"
          title="Your Cart is Empty"
          description="Add fresh chicken curry cuts, boneless fillets, or drumsticks to start your order."
          actionTitle="Explore Cuts →"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Categories' })}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      scrollable
      backgroundColor={COLORS.background}
      header={
        <Header
          title="My Cart"
          subtitle={`${items.length} items`}
          showBack
          onBackPress={() => navigation.goBack()}
          rightAction={
            <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
              <AppText variant="captionBold" color={COLORS.error}>
                Clear
              </AppText>
            </TouchableOpacity>
          }
        />
      }
      footer={
        <View style={styles.checkoutBar}>
          <View>
            <AppText variant="caption" color={COLORS.textSecondary}>
              Grand Total
            </AppText>
            <AppText variant="h2" color={COLORS.primary}>
              ₹{grandTotal}
            </AppText>
          </View>

          <AppButton
            title="Select Delivery Address →"
            variant="primary"
            size="md"
            onPress={() => navigation.navigate('AddressSelection', { fromCheckout: true })}
            style={styles.checkoutBtn}
          />
        </View>
      }
      style={styles.container}
    >
      {/* 1. Free Delivery Banner */}
      {!isFreeDelivery && (
        <View style={styles.freeDeliveryAlert}>
          <AppText variant="captionBold" color="#92400E">
            ⚡ Add ₹{499 - subtotal} more to unlock FREE 30-Min Delivery!
          </AppText>
        </View>
      )}

      {/* 2. Items List */}
      <View style={styles.section}>
        <AppText variant="title" style={styles.sectionHeader}>
          Order Items ({items.length})
        </AppText>

        {items.map(({ product, quantity }) => (
          <View key={product.id} style={styles.itemRow}>
            <View style={styles.itemEmojiBox}>
              <AppText style={styles.itemEmoji}>🍗</AppText>
            </View>

            <View style={styles.itemInfo}>
              <AppText variant="bodyBold" numberOfLines={1}>
                {product.name}
              </AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>
                {product.weight} • ₹{product.price} each
              </AppText>
              <AppText variant="bodyBold" color={COLORS.text} style={styles.itemPrice}>
                ₹{product.price * quantity}
              </AppText>
            </View>

            <QuantitySelector
              size="sm"
              quantity={quantity}
              onIncrease={() => updateQuantity(product.id, quantity + 1)}
              onDecrease={() => updateQuantity(product.id, quantity - 1)}
            />
          </View>
        ))}
      </View>

      {/* 3. Delivery Instructions */}
      <View style={styles.section}>
        <AppText variant="title" style={styles.sectionHeader}>
          Delivery Instructions
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.instScroll}>
          {DELIVERY_INSTRUCTIONS.map(inst => (
            <TouchableOpacity
              key={inst}
              activeOpacity={0.8}
              onPress={() => setSelectedInstruction(inst)}
              style={[styles.instChip, selectedInstruction === inst && styles.instChipActive]}
            >
              <AppText
                variant="captionBold"
                color={selectedInstruction === inst ? COLORS.primary : COLORS.textSecondary}
              >
                {inst}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 4. Bill Summary */}
      <View style={[styles.section, styles.billSection]}>
        <AppText variant="title" style={styles.sectionHeader}>
          Bill Summary
        </AppText>

        <PriceRow label="Item Total" value={subtotal} />
        <PriceRow
          label="Delivery Partner Fee"
          value={deliveryFee}
          isFree={isFreeDelivery}
          subtitle={isFreeDelivery ? 'Free delivery applied' : 'Standard 30-min express fee'}
        />
        {discount > 0 && (
          <PriceRow
            label="Special Promo Discount"
            value={discount}
            isDiscount
            subtitle="Code WEMEAT applied"
          />
        )}
        <PriceRow label="Grand Total (incl. taxes)" value={grandTotal} isTotal />
      </View>

      {/* 5. Cancellation Policy */}
      <View style={styles.policyBox}>
        <AppText variant="caption" color={COLORS.textMuted} align="center">
          🥩 Orders are hygienically cut on confirmation. Cancellation is supported before store
          begins cutting.
        </AppText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clearBtn: {
    padding: SPACING.xs,
  },
  freeDeliveryAlert: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  section: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  itemEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: {
    fontSize: 22,
  },
  itemInfo: {
    flex: 1,
  },
  itemPrice: {
    marginTop: 2,
  },
  instScroll: {
    flexDirection: 'row',
  },
  instChip: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  instChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#FECDD3',
  },
  billSection: {
    marginBottom: SPACING.md,
  },
  policyBox: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  checkoutBar: {
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
  checkoutBtn: {
    minWidth: 200,
  },
});
