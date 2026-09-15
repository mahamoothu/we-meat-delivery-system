import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('9845099881');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSendOtp = async () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit registered mobile number');
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      await login(`+91${cleaned}`);
      navigation.navigate('OtpVerification', {
        phoneNumber: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable backgroundColor={COLORS.background} style={styles.container}>
      <View style={styles.inner}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <AppText variant="icon" style={styles.logoIcon}>
              🏪
            </AppText>
          </View>
          <AppText variant="h1" style={styles.title}>
            WeMeat Partner Portal
          </AppText>
          <AppText
            variant="body"
            color={COLORS.textSecondary}
            align="center"
            style={styles.subtitle}
          >
            Sign in to manage live store orders, cut preparations & inventory dispatch
          </AppText>
        </View>

        {/* Input Card */}
        <View style={styles.formCard}>
          <AppInput
            label="Registered Partner Mobile Number"
            placeholder="98450 99881"
            prefix="+91"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={text => {
              setPhoneNumber(text);
              if (error) setError(undefined);
            }}
            error={error}
          />

          <View style={styles.mockHintBox}>
            <AppText variant="captionBold" color={COLORS.statusAccepted}>
              💡 Development Mock Mode
            </AppText>
            <AppText variant="caption" color={COLORS.textSecondary} style={styles.hintDesc}>
              Enter any 10-digit number. In the next step, use mock test OTP code{' '}
              <AppText variant="captionBold">123456</AppText>.
            </AppText>
          </View>

          <AppButton
            title="Get Verification Code →"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleSendOtp}
            style={styles.submitBtn}
          />
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <AppText variant="caption" color={COLORS.textMuted} align="center">
            WeMeat Merchant Management System
          </AppText>
          <AppText variant="caption" color={COLORS.textMuted} align="center">
            Authorized Store Managers Only
          </AppText>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: SPACING.xl,
    justifyContent: 'space-between',
    minHeight: 560,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoIcon: {
    fontSize: 42,
    lineHeight: 52,
    height: 52,
    width: 52,
    textAlign: 'center',
    includeFontPadding: false,
  },
  title: {
    fontSize: 24,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    maxWidth: 300,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  mockHintBox: {
    backgroundColor: COLORS.statusAcceptedBg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  hintDesc: {
    marginTop: 2,
    lineHeight: 18,
  },
  submitBtn: {
    width: '100%',
  },
  footer: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    gap: 2,
  },
});
