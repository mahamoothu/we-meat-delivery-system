import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type TabType = 'all' | 'active';

export const MyOrdersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orders } = useOrder();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredOrders = useMemo(() => {
    if (activeTab === 'active') {
      return orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
    }
    return orders;
  }, [orders, activeTab]);

  const handleReorder = (order: (typeof orders)[0]) => {
    order.items.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    navigation.navigate('Cart');
  };

  return (
    <ScreenContainer
      scrollable
      backgroundColor={COLORS.background}
      header={<Header title="My Orders" showBack={false} />}
      style={styles.container}
    >
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('all')}
          style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
        >
          <AppText
            variant="bodyBold"
            color={activeTab === 'all' ? COLORS.primary : COLORS.textSecondary}
          >
            All Orders ({orders.length})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('active')}
          style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
        >
          <AppText
            variant="bodyBold"
            color={activeTab === 'active' ? COLORS.primary : COLORS.textSecondary}
          >
            Active Orders (
            {orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length})
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <View style={styles.listSection}>
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders placed yet"
            description="Explore our fresh chicken cuts catalog to place your first order."
            actionTitle="Order Fresh Chicken →"
            onAction={() => navigation.navigate('MainTabs', { screen: 'Categories' })}
          />
        ) : (
          filteredOrders.map(order => (
            <TouchableOpacity
              key={order.id}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
              style={styles.orderCard}
            >
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View>
                  <AppText variant="bodyBold">{order.id}</AppText>
                  <AppText variant="caption" color={COLORS.textMuted}>
                    {order.date}
                  </AppText>
                </View>
                <OrderStatusBadge status={order.status} />
              </View>

              {/* Items Preview */}
              <View style={styles.itemsPreview}>
                {order.items.map((item, idx) => (
                  <AppText
                    key={idx}
                    variant="body"
                    color={COLORS.textSecondary}
                    numberOfLines={1}
                    style={styles.itemText}
                  >
                    • {item.quantity}x {item.product.name} ({item.product.weight})
                  </AppText>
                ))}
              </View>

              {/* Order Footer */}
              <View style={styles.orderFooter}>
                <View>
                  <AppText variant="caption" color={COLORS.textMuted}>
                    Total Amount
                  </AppText>
                  <AppText variant="price" color={COLORS.text}>
                    ₹{order.total}
                  </AppText>
                </View>

                <View style={styles.btnRow}>
                  <AppButton
                    title="Reorder"
                    variant="outline"
                    size="sm"
                    onPress={() => handleReorder(order)}
                    style={styles.reorderBtn}
                  />

                  <AppButton
                    title="Track →"
                    variant="primary"
                    size="sm"
                    onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                    style={styles.trackBtn}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: COLORS.primary,
  },
  listSection: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  itemsPreview: {
    paddingVertical: SPACING.md,
    gap: 4,
  },
  itemText: {
    fontSize: 13,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  reorderBtn: {
    minWidth: 80,
  },
  trackBtn: {
    minWidth: 80,
  },
});
