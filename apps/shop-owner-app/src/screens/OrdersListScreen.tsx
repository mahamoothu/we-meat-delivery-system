import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../navigation/types';
import { useOrder } from '../context/OrderContext';
import { ShopOrderStatus } from '../types/shop';
import { AppText } from '../components/AppText';
import { OrderCard } from '../components/OrderCard';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type OrdersRouteProp = RouteProp<MainTabParamList, 'Orders'>;

type FilterTab = 'ALL' | ShopOrderStatus;

interface TabConfig {
  key: FilterTab;
  label: string;
}

const TABS: TabConfig[] = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'PREPARING', label: 'Preparing' },
  { key: 'READY', label: 'Ready' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'REJECTED', label: 'Rejected' },
];

export function OrdersListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OrdersRouteProp>();
  const { orders, pendingOrders, updateOrderStatus, rejectOrder, getNextAllowedStatus } =
    useOrder();

  const [activeTab, setActiveTab] = useState<FilterTab>(
    (route.params?.initialStatus as FilterTab) || 'ALL',
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = activeTab === 'ALL' || order.status === activeTab;
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery);
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const handlePrimaryAction = (orderId: string, currentStatus: ShopOrderStatus) => {
    const nextStatus = getNextAllowedStatus(currentStatus);
    if (!nextStatus) return;

    const res = updateOrderStatus(orderId, nextStatus);
    if (res.success) {
      Alert.alert(
        'Status Updated',
        `Order #${orderId} moved to "${nextStatus.replace(/_/g, ' ')}".`,
      );
    } else {
      Alert.alert('Action Failed', res.error);
    }
  };

  const handleRejectAction = (orderId: string) => {
    Alert.alert('Reject Order', `Are you sure you want to reject order #${orderId}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject Order',
        style: 'destructive',
        onPress: () => {
          const res = rejectOrder(orderId, 'Store unable to fulfill cut requests at this time.');
          if (res.success) {
            Alert.alert('Order Rejected', `Order #${orderId} has been marked as REJECTED.`);
          } else {
            Alert.alert('Error', res.error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Top Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <AppText variant="icon" style={styles.searchIcon}>
            🔍
          </AppText>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Order ID, customer, or phone..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AppText variant="captionBold" color={COLORS.textMuted}>
                ✕
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Horizontal Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const count =
              tab.key === 'ALL'
                ? orders.length
                : tab.key === 'PENDING'
                  ? pendingOrders.length
                  : orders.filter(o => o.status === tab.key).length;

            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <AppText
                  variant="captionBold"
                  color={isActive ? COLORS.white : COLORS.textSecondary}
                  style={styles.tabLabel}
                >
                  {tab.label}
                </AppText>
                {count > 0 && (
                  <View
                    style={[
                      styles.countBadge,
                      isActive ? styles.countBadgeActive : styles.countBadgeInactive,
                    ]}
                  >
                    <AppText
                      variant="captionBold"
                      color={isActive ? COLORS.primary : COLORS.textSecondary}
                      style={styles.countText}
                    >
                      {count}
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon="📋"
            title={
              searchQuery
                ? `No orders found for "${searchQuery}"`
                : `No ${activeTab.replace(/_/g, ' ')} Orders`
            }
            description={
              searchQuery
                ? 'Try searching with a different Order ID or customer mobile number.'
                : 'There are currently no orders in this fulfillment queue.'
            }
            actionTitle={searchQuery ? 'Clear Search' : 'View All Orders'}
            onAction={() => {
              setSearchQuery('');
              setActiveTab('ALL');
            }}
          />
        ) : (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
              onPrimaryAction={() => handlePrimaryAction(order.id, order.status)}
              onRejectAction={
                order.status === 'PENDING' ? () => handleRejectAction(order.id) : undefined
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchSection: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 44,
  },
  searchIcon: {
    fontSize: 16,
    lineHeight: 20,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  tabsContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  tabsScroll: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs + 2,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 12,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeActive: {
    backgroundColor: COLORS.white,
  },
  countBadgeInactive: {
    backgroundColor: COLORS.borderLight,
  },
  countText: {
    fontSize: 10,
    lineHeight: 12,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
});
