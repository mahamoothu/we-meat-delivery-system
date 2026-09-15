import React from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ShopSettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuth();
  const { isOpen, toggleStoreOpen, settings, updateSettings } = useShop();

  const handleBufferSelect = (mins: 15 | 20 | 30) => {
    updateSettings({ preparationBuffer: mins });
  };

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
      <Header
        title="Store Settings"
        subtitle="Operations & Preferences"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Store Live Status */}
        <View style={styles.section}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.sectionTitle}>
            STORE AVAILABILITY
          </AppText>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextCol}>
                <AppText variant="bodyBold" color={COLORS.text}>
                  Accepting Online Orders
                </AppText>
                <AppText variant="caption" color={COLORS.textSecondary} style={styles.settingSub}>
                  {isOpen
                    ? 'Store is active and open for customer orders'
                    : 'Store is temporarily offline and closed for new orders'}
                </AppText>
              </View>
              <Switch
                value={isOpen}
                onValueChange={toggleStoreOpen}
                trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }}
                thumbColor={isOpen ? COLORS.success : '#94A3B8'}
              />
            </View>
          </View>
        </View>

        {/* Order Fulfillment Preferences */}
        <View style={styles.section}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.sectionTitle}>
            ORDER PREFERENCES
          </AppText>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextCol}>
                <AppText variant="bodyBold" color={COLORS.text}>
                  Order Alert Sounds
                </AppText>
                <AppText variant="caption" color={COLORS.textSecondary} style={styles.settingSub}>
                  Play audio chime when a new customer order arrives
                </AppText>
              </View>
              <Switch
                value={settings.soundNotifications}
                onValueChange={val => updateSettings({ soundNotifications: val })}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={settings.soundNotifications ? COLORS.primary : '#94A3B8'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingTextCol}>
                <AppText variant="bodyBold" color={COLORS.text}>
                  Auto-Accept Incoming Orders
                </AppText>
                <AppText variant="caption" color={COLORS.textSecondary} style={styles.settingSub}>
                  Automatically move pending orders to accepted queue
                </AppText>
              </View>
              <Switch
                value={settings.autoAcceptOrders}
                onValueChange={val => updateSettings({ autoAcceptOrders: val })}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={settings.autoAcceptOrders ? COLORS.primary : '#94A3B8'}
              />
            </View>

            <View style={styles.divider} />

            {/* Preparation Time Buffer */}
            <View style={styles.bufferBlock}>
              <AppText variant="bodyBold" color={COLORS.text}>
                Standard Preparation Buffer
              </AppText>
              <AppText variant="caption" color={COLORS.textSecondary} style={styles.settingSub}>
                Estimated butchering, cutting, RO-washing, and sealing duration:
              </AppText>
              <View style={styles.bufferRow}>
                {([15, 20, 30] as const).map(mins => {
                  const isSelected = settings.preparationBuffer === mins;
                  return (
                    <TouchableOpacity
                      key={mins}
                      activeOpacity={0.8}
                      onPress={() => handleBufferSelect(mins)}
                      style={[styles.bufferBtn, isSelected && styles.bufferBtnSelected]}
                    >
                      <AppText
                        variant="captionBold"
                        color={isSelected ? COLORS.white : COLORS.text}
                      >
                        {mins} Mins
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* System & Build Information */}
        <View style={styles.section}>
          <AppText variant="captionBold" color={COLORS.textMuted} style={styles.sectionTitle}>
            APPLICATION DETAILS
          </AppText>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <AppText variant="body" color={COLORS.text}>
                App Version
              </AppText>
              <AppText variant="bodyBold" color={COLORS.textSecondary}>
                1.0.0 (Build 100)
              </AppText>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <AppText variant="body" color={COLORS.text}>
                Environment
              </AppText>
              <AppText variant="bodyBold" color={COLORS.statusAccepted}>
                Step 4 Local Mock Mode
              </AppText>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <AppText variant="body" color={COLORS.text}>
                Architecture
              </AppText>
              <AppText variant="bodyBold" color={COLORS.textSecondary}>
                React Native CLI
              </AppText>
            </View>
          </View>
        </View>

        {/* Sign out */}
        <AppButton
          title="Sign Out of Store Portal"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutBtn}
          textStyle={{ color: COLORS.error }}
        />
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
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  settingTextCol: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingSub: {
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: SPACING.md,
  },
  bufferBlock: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  bufferRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  bufferBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bufferBtnSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  logoutBtn: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.xs,
  },
});
