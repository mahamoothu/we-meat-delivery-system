import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { AppText } from '../components/AppText';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Login');
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Merchant Emblem Badge */}
        <View style={styles.logoRing}>
          <View style={styles.logoBadge}>
            <AppText variant="icon" style={styles.logoIcon}>
              🏪
            </AppText>
          </View>
        </View>

        <AppText variant="display" color="#FFFFFF" style={styles.brandTitle}>
          WeMeat Partner
        </AppText>

        <View style={styles.taglineBadge}>
          <AppText variant="captionBold" color="#F1F5F9" style={styles.tagline}>
            STORE MANAGER & ORDER FULFILLMENT
          </AppText>
        </View>
      </View>

      <View style={styles.footer}>
        <AppText variant="caption" color="rgba(255, 255, 255, 0.75)">
          Store Management Portal • v1.0.0 (Phase 1 Mock)
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  content: {
    alignItems: 'center',
  },
  logoRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  logoIcon: {
    fontSize: 52,
    lineHeight: 66,
    height: 66,
    width: 66,
    textAlign: 'center',
    includeFontPadding: false,
  },
  brandTitle: {
    letterSpacing: -0.5,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  taglineBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
  },
  tagline: {
    letterSpacing: 1,
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xxl,
    alignItems: 'center',
  },
});
