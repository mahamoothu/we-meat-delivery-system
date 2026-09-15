import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { AppText } from '../components/AppText';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { onboarded, isLoggedIn } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!onboarded) {
        navigation.replace('Onboarding');
      } else if (!isLoggedIn) {
        navigation.replace('Login');
      } else {
        navigation.replace('MainTabs');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [onboarded, isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Brand Icon Outer Glow + Badge */}
        <View style={styles.logoRing}>
          <View style={styles.logoBadge}>
            <AppText style={styles.logoIcon}>🍗</AppText>
          </View>
        </View>

        <AppText variant="display" color="#FFFFFF" style={styles.brandTitle}>
          WeMeat
        </AppText>

        <View style={styles.taglineBadge}>
          <AppText variant="captionBold" color={COLORS.primaryLight} style={styles.tagline}>
            100% FARM FRESH • 30-MIN DELIVERY
          </AppText>
        </View>
      </View>

      <View style={styles.footer}>
        <AppText variant="caption" color="rgba(255, 255, 255, 0.85)">
          Quality Certified Halal Chicken Cuts
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    fontSize: 54,
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
  },
  tagline: {
    letterSpacing: 1,
    fontSize: 11,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xxl,
    alignItems: 'center',
  },
});
