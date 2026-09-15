import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { AppText } from '../components/AppText';
import { Header } from '../components/Header';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingRowProps {
  icon?: string;
  title: string;
  subtitle?: string;
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  onPress?: () => void;
  type?: 'toggle' | 'link';
}

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  onPress,
  type = 'link',
}: SettingRowProps) {
  if (type === 'toggle') {
    return (
      <View style={styles.row}>
        {icon && (
          <AppText variant="h3" style={styles.rowIcon}>
            {icon}
          </AppText>
        )}
        <View style={styles.rowContent}>
          <AppText variant="body" weight="medium" color={COLORS.text}>
            {title}
          </AppText>
          {subtitle && (
            <AppText variant="caption" color={COLORS.textMuted} style={styles.subtitle}>
              {subtitle}
            </AppText>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
          thumbColor={value ? COLORS.primary : COLORS.white}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      {icon && (
        <AppText variant="h3" style={styles.rowIcon}>
          {icon}
        </AppText>
      )}
      <View style={styles.rowContent}>
        <AppText variant="body" weight="medium" color={COLORS.text}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" color={COLORS.textMuted} style={styles.subtitle}>
            {subtitle}
          </AppText>
        )}
      </View>
      <AppText variant="body" color={COLORS.textLight} style={styles.chevron}>
        ›
      </AppText>
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Mock settings state
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleDarkModeToggle = (val: boolean) => {
    setDarkMode(val);
    Alert.alert(
      'Appearance Mode',
      val
        ? 'Dark Mode preview enabled (Mock UI). Full theme switching will be configurable in Phase 2.'
        : 'Light Mode active.',
    );
  };

  const handleTerms = () => {
    Alert.alert(
      'Terms of Service',
      'WeMeat Terms & Conditions:\n\n1. All poultry products are subject to daily farm availability.\n2. Standard delivery time is 30-45 minutes from order confirmation.\n3. Orders once prepared cannot be cancelled.\n4. Mock environment for development testing.',
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacy Policy',
      'WeMeat Privacy Policy:\n\n1. We only store delivery address and contact information for order fulfillment.\n2. No financial credentials or card details are permanently retained.\n3. Mock OTP testing mode active.',
    );
  };

  const handleRefunds = () => {
    Alert.alert(
      'Refund & Freshness Guarantee',
      'WeMeat Freshness Guarantee:\n\nIf you are not 100% satisfied with the quality, freshness, or cut of your chicken, our team will replace your order or issue an instant credit note.',
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Settings & Preferences" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <AppText
            variant="caption"
            weight="bold"
            color={COLORS.textMuted}
            style={styles.sectionTitle}
          >
            NOTIFICATIONS
          </AppText>
          <View style={styles.card}>
            <SettingRow
              icon="🔔"
              title="Order Status Alerts"
              subtitle="Get real-time updates when order is ready & out for delivery"
              type="toggle"
              value={orderNotifications}
              onValueChange={setOrderNotifications}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="🏷️"
              title="Offers & Discounts"
              subtitle="Receive weekend discounts and seasonal offers"
              type="toggle"
              value={promoNotifications}
              onValueChange={setPromoNotifications}
            />
          </View>
        </View>

        {/* Appearance & Sound */}
        <View style={styles.section}>
          <AppText
            variant="caption"
            weight="bold"
            color={COLORS.textMuted}
            style={styles.sectionTitle}
          >
            APPEARANCE & SOUND
          </AppText>
          <View style={styles.card}>
            <SettingRow
              icon="🌙"
              title="Dark Theme"
              subtitle="Mock UI dark mode toggle"
              type="toggle"
              value={darkMode}
              onValueChange={handleDarkModeToggle}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="🔊"
              title="Sound Effects"
              subtitle="Play audio feedback on order confirmation"
              type="toggle"
              value={soundEffects}
              onValueChange={setSoundEffects}
            />
          </View>
        </View>

        {/* Legal & Policies */}
        <View style={styles.section}>
          <AppText
            variant="caption"
            weight="bold"
            color={COLORS.textMuted}
            style={styles.sectionTitle}
          >
            LEGAL & POLICIES
          </AppText>
          <View style={styles.card}>
            <SettingRow
              icon="📜"
              title="Terms of Service"
              subtitle="User agreement and ordering terms"
              onPress={handleTerms}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="🔒"
              title="Privacy Policy"
              subtitle="How your information is protected"
              onPress={handlePrivacy}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="🛡️"
              title="Freshness Guarantee & Returns"
              subtitle="100% replacement pledge"
              onPress={handleRefunds}
            />
          </View>
        </View>

        {/* Build & App Info */}
        <View style={styles.section}>
          <AppText
            variant="caption"
            weight="bold"
            color={COLORS.textMuted}
            style={styles.sectionTitle}
          >
            APP INFORMATION
          </AppText>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <AppText variant="body" color={COLORS.text}>
                Version
              </AppText>
              <AppText variant="body" weight="medium" color={COLORS.textMuted}>
                1.0.0 (Build 100)
              </AppText>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <AppText variant="body" color={COLORS.text}>
                Environment
              </AppText>
              <AppText variant="body" weight="medium" color={COLORS.primary}>
                Mock Mode (Step 3)
              </AppText>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <AppText variant="body" color={COLORS.text}>
                Platform
              </AppText>
              <AppText variant="body" weight="medium" color={COLORS.textMuted}>
                React Native CLI
              </AppText>
            </View>
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
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  rowIcon: {
    marginRight: SPACING.sm,
    width: 30,
    textAlign: 'center',
  },
  rowContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  subtitle: {
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    marginLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
});
