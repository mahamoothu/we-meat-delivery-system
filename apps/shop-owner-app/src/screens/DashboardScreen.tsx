import React from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useShop } from '../context/ShopContext';
import { useOrder } from '../context/OrderContext';
import { useProduct } from '../context/ProductContext';
import { AppText } from '../components/AppText';
import { StatCard } from '../components/StatCard';
import { OrderCard } from '../components/OrderCard';
import { AppButton } from '../components/AppButton';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { shopInfo, isOpen, toggleStoreOpen } = useShop();
  const { pendingOrders, stats, updateOrderStatus, rejectOrder } = useOrder();
  const { products } = useProduct();

  const activeProductsCount = products.filter(p => p.isAvailable).length;
  const outOfStockCount = products.length - activeProductsCount;

  const handleAcceptOrder = (orderId: string) => {
    const res = updateOrderStatus(orderId, 'ACCEPTED');
    if (res.success) {
      Alert.alert('Order Accepted', `Order #${orderId} moved to Accepted queue.`);
    } else {
      Alert.alert('Action Failed', res.error);
    }
  };

  const handleRejectOrder = (orderId: string) => {
    Alert.alert('Reject Order', `Are you sure you want to reject order #${orderId}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject Order',
        style: 'destructive',
        onPress: () => {
          const res = rejectOrder(orderId, 'Store unable to fulfill cut requests at this time.');
          if (res.success) {
            Alert.alert('Order Rejected', `Order #${orderId} has been rejected.`);
          } else {
            Alert.alert('Error', res.error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Top Merchant Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.storeCol}>
          <AppText variant="captionBold" color={COLORS.textSecondary}>
            STORE ID: {shopInfo.id}
          </AppText>
          <AppText variant="title" color={COLORS.text} numberOfLines={1} style={styles.storeName}>
            {shopInfo.name}
          </AppText>
        </View>

        {/* Store Open/Closed Toggle */}
        <View style={[styles.statusPill, isOpen ? styles.statusPillOpen : styles.statusPillClosed]}>
          <View
            style={[styles.statusDot, { backgroundColor: isOpen ? COLORS.success : COLORS.error }]}
          />
          <AppText
            variant="captionBold"
            color={isOpen ? COLORS.success : COLORS.error}
            style={styles.statusText}
          >
            {isOpen ? 'STORE OPEN' : 'STORE CLOSED'}
          </AppText>
          <Switch
            value={isOpen}
            onValueChange={toggleStoreOpen}
            trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }}
            thumbColor={isOpen ? COLORS.success : '#94A3B8'}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Store Closed Banner Warning */}
        {!isOpen && (
          <View style={styles.closedWarningBanner}>
            <AppText variant="icon" style={styles.warningIcon}>
              ⚠️
            </AppText>
            <View style={styles.warningTextCol}>
              <AppText variant="captionBold" color={COLORS.error}>
                Store Is Currently Offline
              </AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>
                Customers cannot place new delivery orders until the store is turned on.
              </AppText>
            </View>
          </View>
        )}

        {/* 1. Metric Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <StatCard
              title="TODAY'S ORDERS"
              value={stats.todayOrdersCount}
              icon="📦"
              subtitle="Active orders today"
              highlightColor={COLORS.primary}
              style={styles.statCardHalf}
            />
            <StatCard
              title="TODAY'S REVENUE"
              value={`₹${stats.todayRevenue}`}
              icon="💰"
              subtitle="Gross item total"
              highlightColor={COLORS.success}
              style={styles.statCardHalf}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="PENDING ACTION"
              value={pendingOrders.length}
              icon="⏳"
              subtitle={pendingOrders.length > 0 ? 'Urgent attention' : 'All clear'}
              highlightColor={pendingOrders.length > 0 ? COLORS.warning : COLORS.textMuted}
              style={styles.statCardHalf}
            />
            <StatCard
              title="IN-STOCK PRODUCTS"
              value={`${activeProductsCount}/${products.length}`}
              icon="🍗"
              subtitle={
                outOfStockCount > 0 ? `${outOfStockCount} out of stock` : 'Full catalog active'
              }
              highlightColor={outOfStockCount > 0 ? COLORS.statusPending : COLORS.primary}
              style={styles.statCardHalf}
            />
          </View>
        </View>

        {/* 2. Urgent Pending Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <AppText variant="title">Pending Orders</AppText>
              {pendingOrders.length > 0 && (
                <View style={styles.urgentBadge}>
                  <AppText variant="captionBold" color={COLORS.white} style={styles.urgentText}>
                    {pendingOrders.length} URGENT
                  </AppText>
                </View>
              )}
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })}>
              <AppText variant="captionBold" color={COLORS.primary}>
                View All →
              </AppText>
            </TouchableOpacity>
          </View>

          {pendingOrders.length === 0 ? (
            <View style={styles.noPendingBox}>
              <AppText variant="icon" style={styles.checkEmblem}>
                ✓
              </AppText>
              <AppText variant="bodyBold" color={COLORS.text}>
                No Pending Orders
              </AppText>
              <AppText variant="caption" color={COLORS.textMuted}>
                All incoming customer orders have been accepted or processed.
              </AppText>
            </View>
          ) : (
            pendingOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                onPrimaryAction={() => handleAcceptOrder(order.id)}
                onRejectAction={() => handleRejectOrder(order.id)}
              />
            ))
          )}
        </View>

        {/* 3. Quick Action Hub */}
        <View style={styles.section}>
          <AppText variant="title" style={styles.quickActionsTitle}>
            Quick Management Hub
          </AppText>
          <View style={styles.quickGrid}>
            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })}
            >
              <AppText variant="icon" style={styles.quickIcon}>
                📋
              </AppText>
              <AppText variant="bodyBold" color={COLORS.text}>
                Live Orders
              </AppText>
              <AppText variant="caption" color={COLORS.textMuted}>
                Fulfillment queue
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })}
            >
              <AppText variant="icon" style={styles.quickIcon}>
                🍗
              </AppText>
              <AppText variant="bodyBold" color={COLORS.text}>
                Inventory
              </AppText>
              <AppText variant="caption" color={COLORS.textMuted}>
                Manage cuts & stock
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddProduct')}
            >
              <AppText variant="icon" style={styles.quickIcon}>
                ➕
              </AppText>
              <AppText variant="bodyBold" color={COLORS.text}>
                Add Cut
              </AppText>
              <AppText variant="caption" color={COLORS.textMuted}>
                New product entry
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Settings')}
            >
              <AppText variant="icon" style={styles.quickIcon}>
                ⚙️
              </AppText>
              <AppText variant="bodyBold" color={COLORS.text}>
                Store Settings
              </AppText>
              <AppText variant="caption" color={COLORS.textMuted}>
                Hours & preferences
              </AppText>
            </TouchableOpacity>
          </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  storeCol: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  storeName: {
    fontSize: 16,
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.xxs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  statusPillOpen: {
    backgroundColor: COLORS.accentLight,
    borderColor: '#A7F3D0',
  },
  statusPillClosed: {
    backgroundColor: COLORS.errorLight,
    borderColor: '#FECACA',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
  closedWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  warningIcon: {
    fontSize: 24,
    lineHeight: 30,
    height: 30,
    width: 30,
    textAlign: 'center',
  },
  warningTextCol: {
    flex: 1,
  },
  statsSection: {
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCardHalf: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  urgentBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  urgentText: {
    fontSize: 9,
    letterSpacing: 0.5,
  },
  noPendingBox: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  checkEmblem: {
    fontSize: 32,
    lineHeight: 40,
    height: 40,
    width: 40,
    color: COLORS.success,
    textAlign: 'center',
  },
  quickActionsTitle: {
    marginBottom: SPACING.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  quickCard: {
    width: '47.5%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
    ...SHADOWS.sm,
  },
  quickIcon: {
    fontSize: 24,
    lineHeight: 30,
    height: 30,
    width: 30,
    marginBottom: SPACING.xs,
  },
});
