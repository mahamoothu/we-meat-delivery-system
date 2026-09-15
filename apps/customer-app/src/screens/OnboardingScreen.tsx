import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface Slide {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  highlight: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: '🌱',
    title: '100% Farm Fresh Cuts',
    subtitle:
      'Healthy, antibiotic-free chicken sourced directly from certified farms. RO-washed and hygienically cut on order.',
    highlight: 'Strict 15-Point Quality Check',
  },
  {
    id: '2',
    icon: '⚡',
    title: 'Superfast 30-Min Delivery',
    subtitle:
      'Chilled temperature-controlled transit maintained below 4°C in vacuum-sealed food-grade insulated packs.',
    highlight: 'Express Doorstep Delivery',
  },
  {
    id: '3',
    icon: '👨‍🍳',
    title: 'Custom Cuts for Every Dish',
    subtitle:
      'From succulent curry cuts and boneless fillets to juicy tandoori drumsticks — cut fresh just the way you like.',
    highlight: 'Zero Preservatives Added',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding } = useAuth();

  const handleFinish = () => {
    completeOnboarding();
    navigation.replace('Login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const slide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <ScreenContainer backgroundColor={COLORS.background} style={styles.container}>
      {/* Top Header Row with Skip */}
      <View style={styles.topRow}>
        <View style={styles.brandBadge}>
          <AppText style={styles.brandIcon}>🍗</AppText>
          <AppText variant="captionBold" color={COLORS.primary}>
            WeMeat
          </AppText>
        </View>

        {!isLast ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleFinish} style={styles.skipBtn}>
            <AppText variant="captionBold" color={COLORS.textSecondary}>
              Skip
            </AppText>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Main Slide Card */}
      <View style={styles.slideCard}>
        <View style={styles.iconCircle}>
          <AppText style={styles.slideIcon}>{slide.icon}</AppText>
        </View>

        <View style={styles.highlightBadge}>
          <AppText variant="captionBold" color={COLORS.accentDark} style={styles.highlightText}>
            ✓ {slide.highlight}
          </AppText>
        </View>

        <AppText variant="h1" align="center" style={styles.title}>
          {slide.title}
        </AppText>

        <AppText variant="body" color={COLORS.textSecondary} align="center" style={styles.subtitle}>
          {slide.subtitle}
        </AppText>
      </View>

      {/* Footer Navigation & Dots */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        <AppButton
          title={isLast ? 'Get Started →' : 'Continue'}
          variant="primary"
          size="lg"
          onPress={handleNext}
          style={styles.actionBtn}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  brandIcon: {
    fontSize: 16,
  },
  skipBtn: {
    padding: SPACING.xs,
  },
  slideCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  slideIcon: {
    fontSize: 54,
    lineHeight: 66,
    height: 66,
    width: 66,
    textAlign: 'center',
    includeFontPadding: false,
  },
  highlightBadge: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  highlightText: {
    fontSize: 12,
  },
  title: {
    marginBottom: SPACING.md,
    fontSize: 26,
    lineHeight: 32,
  },
  subtitle: {
    lineHeight: 22,
    maxWidth: 300,
  },
  footer: {
    paddingBottom: SPACING.lg,
    alignItems: 'center',
    width: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: COLORS.border,
  },
  actionBtn: {
    width: '100%',
  },
});
