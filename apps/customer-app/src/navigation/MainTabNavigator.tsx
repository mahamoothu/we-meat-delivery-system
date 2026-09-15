import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { MyOrdersScreen } from '../screens/MyOrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AppText } from '../components/AppText';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type TabKey = 'Home' | 'Categories' | 'Orders' | 'Profile';
type MainTabsRouteProp = RouteProp<RootStackParamList, 'MainTabs'>;

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { key: 'Home', label: 'Home', icon: '🏠' },
  { key: 'Categories', label: 'Menu', icon: '🍗' },
  { key: 'Orders', label: 'My Orders', icon: '📦' },
  { key: 'Profile', label: 'Profile', icon: '👤' },
];

export function MainTabNavigator() {
  const route = useRoute<MainTabsRouteProp>();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();
  const { activeOrders } = useOrder();

  const [activeTab, setActiveTab] = useState<TabKey>('Home');

  // Check if initial screen was requested via params
  useEffect(() => {
    if (route.params?.screen) {
      setActiveTab(route.params.screen as TabKey);
    }
  }, [route.params]);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Categories':
        return <CategoriesScreen />;
      case 'Orders':
        return <MyOrdersScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, SPACING.xs) }]}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          const showCartBadge = tab.key === 'Categories' && itemCount > 0;
          const showOrderBadge = tab.key === 'Orders' && activeOrders.length > 0;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <AppText variant="h3">{tab.icon}</AppText>
                {showCartBadge && (
                  <View style={styles.badge}>
                    <AppText
                      variant="caption"
                      color={COLORS.white}
                      weight="bold"
                      style={styles.badgeText}
                    >
                      {itemCount}
                    </AppText>
                  </View>
                )}
                {showOrderBadge && (
                  <View style={[styles.badge, styles.orderBadge]}>
                    <AppText
                      variant="caption"
                      color={COLORS.white}
                      weight="bold"
                      style={styles.badgeText}
                    >
                      {activeOrders.length}
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
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  orderBadge: {
    backgroundColor: COLORS.accent,
  },
  badgeText: {
    fontSize: 9,
    lineHeight: 10,
  },
});
