import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from './types';
import { DashboardScreen } from '../screens/DashboardScreen';
import { OrdersListScreen } from '../screens/OrdersListScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { ShopProfileScreen } from '../screens/ShopProfileScreen';
import { AppText } from '../components/AppText';
import { useOrder } from '../context/OrderContext';
import { useProduct } from '../context/ProductContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type TabKey = 'Dashboard' | 'Orders' | 'Products' | 'Profile';
type MainTabsRouteProp = RouteProp<RootStackParamList, 'MainTabs'>;

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { key: 'Dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'Orders', label: 'Orders', icon: '📋' },
  { key: 'Products', label: 'Products', icon: '🍗' },
  { key: 'Profile', label: 'Store', icon: '🏪' },
];

export function MainTabNavigator() {
  const route = useRoute<MainTabsRouteProp>();
  const insets = useSafeAreaInsets();
  const { pendingOrders } = useOrder();
  const { products } = useProduct();

  const [activeTab, setActiveTab] = useState<TabKey>('Dashboard');

  const outOfStockCount = products.filter(p => !p.isAvailable).length;

  useEffect(() => {
    if (route.params?.screen) {
      setActiveTab(route.params.screen as TabKey);
    }
  }, [route.params]);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardScreen />;
      case 'Orders':
        return <OrdersListScreen />;
      case 'Products':
        return <ProductListScreen />;
      case 'Profile':
        return <ShopProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* Bottom Tab Bar */}
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, SPACING.xs) }]}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          const showOrderBadge = tab.key === 'Orders' && pendingOrders.length > 0;
          const showProductBadge = tab.key === 'Products' && outOfStockCount > 0;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <AppText variant="h3">{tab.icon}</AppText>
                {showOrderBadge && (
                  <View style={styles.badge}>
                    <AppText
                      variant="caption"
                      color={COLORS.white}
                      weight="bold"
                      style={styles.badgeText}
                    >
                      {pendingOrders.length}
                    </AppText>
                  </View>
                )}
                {showProductBadge && (
                  <View style={[styles.badge, styles.warningBadge]}>
                    <AppText
                      variant="caption"
                      color={COLORS.white}
                      weight="bold"
                      style={styles.badgeText}
                    >
                      !
                    </AppText>
                  </View>
                )}
              </View>
              <AppText
                variant="caption"
                weight={isActive ? 'bold' : 'normal'}
                color={isActive ? COLORS.primary : COLORS.textMuted}
                style={styles.tabLabel}
              >
                {tab.label}
              </AppText>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xs,
    ...SHADOWS.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 11,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  warningBadge: {
    backgroundColor: COLORS.warning,
  },
  badgeText: {
    fontSize: 9,
    lineHeight: 10,
  },
});
