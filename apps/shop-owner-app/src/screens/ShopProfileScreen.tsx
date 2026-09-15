import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfileRowProps {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
  showChevron?: boolean;
}

function ProfileRow({ icon, label, value, onPress, showChevron }: ProfileRowProps) {
  const content = (
    <View style={styles.profileRow}>
      <View style={styles.iconCircle}>
        <AppText variant="icon" style={styles.rowIcon}>
          {icon}
        </AppText>
      </View>
      <View style={styles.rowContent}>
        <AppText variant="captionBold" color={COLORS.textMuted}>
          {label}
        </AppText>
        <AppText variant="body" color={COLORS.text} style={styles.rowValue}>
          {value}
        </AppText>
      </View>
      {showChevron && (
        <AppText variant="body" color={COLORS.textMuted} style={styles.chevron}>
          ›
        </AppText>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export function ShopProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const { shopInfo, isOpen } = useShop();

  const handleLogout = () => {
    Alert.alert('Sign Out of Store Portal', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Store Profile Card */}
        <View style={styles.storeCard}>
          <View style={styles.storeEmblem}>
            <AppText variant="icon" style={styles.storeIcon}>
              🏪
            </AppText>
          </View>
          <View style={styles.storeMainInfo}>
            <AppText variant="h2" weight="bold" color={COLORS.text}>
              {shopInfo.name}
            </AppText>
            <AppText variant="captionBold" color={COLORS.primary}>
              STORE ID: {shopInfo.id}
            </AppText>
            <View style={styles.storeStatusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isOpen ? COLORS.success : COLORS.error },
                ]}
              />
              <AppText variant="captionBold" color={isOpen ? COLORS.success : COLORS.error}>
                {isOpen ? 'STORE IS LIVE & ACCEPTING ORDERS' : 'STORE IS CURRENTLY CLOSED'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Store Details Section */}
        <View style={styles.section}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.sectionTitle}>
            STORE INFORMATION
          </AppText>
          <View style={styles.card}>
            <ProfileRow icon="📜" label="FSSAI LICENSE (MOCK)" value={shopInfo.fssaiNumber} />
            <View style={styles.divider} />
            <ProfileRow icon="📍" label="FULFILLMENT HUB ADDRESS" value={shopInfo.address} />
            <View style={styles.divider} />
            <ProfileRow
              icon="⏰"
              label="OPERATING HOURS"
              value={`${shopInfo.openingTime} — ${shopInfo.closingTime}`}
            />
          </View>
        </View>

        {/* Manager Details */}
        <View style={styles.section}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.sectionTitle}>
            MANAGER DETAILS
          </AppText>
          <View style={styles.card}>
            <ProfileRow icon="👤" label="STORE MANAGER" value={user?.name || 'Rajesh Kumar'} />
            <View style={styles.divider} />
            <ProfileRow
              icon="📞"
              label="MANAGER MOBILE"
              value={user?.phoneNumber || shopInfo.phone}
            />
          </View>
        </View>

        {/* Settings & Support Links */}
        <View style={styles.section}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.sectionTitle}>
            CONFIGURATION
          </AppText>
          <View style={styles.card}>
            <ProfileRow
              icon="⚙️"
              label="STORE SETTINGS"
              value="Hours, alert sounds & order preferences"
              showChevron
              onPress={() => navigation.navigate('Settings')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon="📞"
              label="CENTRAL SUPPLY HELPDESK"
              value="partner-support@wemeat.local • 1800-456-MEAT"
              showChevron
              onPress={() =>
                Alert.alert(
                  'Partner Support Desk',
                  'For fresh daily farm stock intake queries or delivery partner coordination:\n\nEmail: partner-support@wemeat.local\nHelpline: 1800-456-MEAT (6 AM - 10 PM)',
                )
              }
            />
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.logoutContainer}>
          <AppButton
            title="Sign Out of Store Portal"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutBtn}
            textStyle={{ color: COLORS.error }}
          />
        </View>

        <View style={styles.versionContainer}>
          <AppText variant="caption" color={COLORS.textMuted} align="center">
            WeMeat Shop Owner App v1.0.0 (Phase 1 Mock)
          </AppText>
          <AppText variant="caption" color={COLORS.textMuted} align="center">
            Store Fulfillment System
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
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  storeEmblem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  storeIcon: {
    fontSize: 28,
    lineHeight: 34,
    height: 34,
    width: 34,
    textAlign: 'center',
  },
  storeMainInfo: {
    flex: 1,
  },
  storeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
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
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  rowIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  rowContent: {
    flex: 1,
  },
  rowValue: {
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    marginLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: 64,
  },
  logoutContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  logoutBtn: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.surface,
  },
  versionContainer: {
    alignItems: 'center',
    gap: 2,
    marginTop: SPACING.xs,
  },
});
