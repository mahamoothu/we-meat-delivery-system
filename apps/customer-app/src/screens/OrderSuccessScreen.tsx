import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderSuccess'>;

export const OrderSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;

  return (
    <ScreenContainer backgroundColor={COLORS.surface} style={styles.container}>
      <View style={styles.content}>
        {/* Celebration Badge */}
        <View style={styles.celebrationCircle}>
          <AppText style={styles.checkIcon}>✓</AppText>
        </View>

        <AppText variant="h1" align="center" style={styles.title}>
          Order Placed Successfully!
        </AppText>

        <View style={styles.orderIdBadge}>
          <AppText variant="captionBold" color={COLORS.primary}>
            ORDER ID: {orderId}
          </AppText>
        </View>

        <AppText variant="body" color={COLORS.textSecondary} align="center" style={styles.subtitle}>
          Your order has been received by our store team. Fresh cuts will be prepared and delivered
          in clean temperature-controlled packing.
        </AppText>

        <View style={styles.etaCard}>
          <AppText style={styles.etaIcon}>🛵</AppText>
          <View>
            <AppText variant="captionBold" color={COLORS.accentDark}>
              ESTIMATED DELIVERY
            </AppText>
            <AppText variant="title" color={COLORS.text}>
              25 – 35 Minutes
            </AppText>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <AppButton
          title="Track Order Status →"
          variant="primary"
          size="lg"
          onPress={() => navigation.replace('OrderDetails', { orderId })}
          style={styles.trackBtn}
        />

        <AppButton
          title="Back to Home"
          variant="outline"
          size="md"
          onPress={() => navigation.replace('MainTabs', { screen: 'Home' })}
          style={styles.homeBtn}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    paddingTop: SPACING.xxxl,
  },
  celebrationCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 3,
    borderColor: '#6EE7B7',
  },
  checkIcon: {
    fontSize: 48,
    lineHeight: 56,
    height: 56,
    width: 56,
    textAlign: 'center',
    includeFontPadding: false,
    color: COLORS.accentDark,
    fontWeight: '800',
  },
  title: {
    fontSize: 24,
    marginBottom: SPACING.md,
  },
  orderIdBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  subtitle: {
    lineHeight: 22,
    maxWidth: 300,
    marginBottom: SPACING.xl,
  },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  etaIcon: {
    fontSize: 32,
  },
  footer: {
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  trackBtn: {
    width: '100%',
  },
  homeBtn: {
    width: '100%',
  },
});
