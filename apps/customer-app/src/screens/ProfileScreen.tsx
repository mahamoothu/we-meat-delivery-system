import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeText?: string;
}

function MenuItem({ icon, title, subtitle, onPress, showBadge, badgeText }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconContainer}>
        <AppText variant="h3">{icon}</AppText>
      </View>
      <View style={styles.menuContent}>
        <AppText variant="body" weight="medium" color={COLORS.text}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" color={COLORS.textMuted} style={styles.menuSubtitle}>
            {subtitle}
          </AppText>
        )}
      </View>
      {showBadge && badgeText && (
        <View style={styles.badge}>
          <AppText variant="caption" color={COLORS.white} weight="bold">
            {badgeText}
          </AppText>
        </View>
      )}
      <AppText variant="body" color={COLORS.textLight} style={styles.chevron}>
        ›
      </AppText>
    </TouchableOpacity>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of WeMeat?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const handleSupport = () => {
    Alert.alert(
      'Customer Support',
      'Need help with an order? Contact our mock support desk:\n\nEmail: support@wemeat.local\nHelpline: 1800-123-MEAT (9 AM - 9 PM)',
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <AppText variant="h1" color={COLORS.white} weight="bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </AppText>
          </View>
          <View style={styles.userInfo}>
            <AppText variant="h2" weight="bold" color={COLORS.text}>
              {user?.name || 'WeMeat Customer'}
            </AppText>
            <AppText variant="body" color={COLORS.textMuted}>
              {user?.phoneNumber || '+91 98765 43210'}
            </AppText>
            {user?.email && (
              <AppText variant="caption" color={COLORS.textMuted}>
                {user.email}
              </AppText>
            )}
          </View>
        </View>

        {/* Orders & Activity */}
        <View style={styles.section}>
          <AppText
            variant="caption"
            weight="bold"
            color={COLORS.textMuted}
            style={styles.sectionHeader}
          >
            ORDERS & ADDRESSES
          </AppText>
          <View style={styles.card}>
            <MenuItem
              icon="📦"
              title="My Orders"
              subtitle="View active orders & order history"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="📍"
              title="Delivery Addresses"
              subtitle="Manage your home, work & other addresses"
              onPress={() => navigation.navigate('AddressSelection', { fromCheckout: false })}
            />
          </View>
        </View>

        {/* Preferences & Settings */}
        <View style={styles.section}>
          <AppText
            variant="caption"
            weight="bold"
            color={COLORS.textMuted}
            style={styles.sectionHeader}
          >
            PREFERENCES
          </AppText>
          <View style={styles.card}>
            <MenuItem
              icon="⚙️"
              title="Settings"
              subtitle="App notifications, theme & preferences"
              onPress={() => navigation.navigate('Settings')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="💬"
              title="Customer Support"
              subtitle="24/7 helpdesk & order queries"
              onPress={handleSupport}
            />
          </View>
        </View>

        {/* Information & Legal */}
        <View style={styles.section}>
          <AppText
            variant="caption"
            weight="bold"
            color={COLORS.textMuted}
            style={styles.sectionHeader}
          >
            ABOUT WEMEAT
          </AppText>
          <View style={styles.card}>
            <MenuItem
              icon="🍗"
              title="Freshness & Safety Pledge"
              subtitle="100% farm-fresh, chemical-free raw chicken"
              onPress={() =>
                Alert.alert(
                  'WeMeat Quality Pledge',
                  '1. 100% Antibiotic & Chemical Free\n2. Daily Fresh Sourcing\n3. Precision Temperature-Controlled Packaging\n4. Fast 30-45 Minute Doorstep Delivery',
                )
              }
            />
            <View style={styles.divider} />
            <MenuItem
              icon="📜"
              title="Terms & Privacy"
              subtitle="Read our terms of service and privacy policy"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <AppButton
            title="Log Out"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={{ color: COLORS.error }}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <AppText variant="caption" color={COLORS.textLight} align="center">
            WeMeat Customer App v1.0.0 (Phase 1 Mock)
          </AppText>
          <AppText variant="caption" color={COLORS.textLight} align="center">
            Fresh Chicken Delivered Daily
          </AppText>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  userInfo: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  menuContent: {
    flex: 1,
  },
  menuSubtitle: {
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  chevron: {
    fontSize: 22,
    marginLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 56,
  },
  logoutContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  logoutButton: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.white,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: 2,
  },
});
