import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

export const OtpVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { verifyOtp } = useAuth();

  const inputs = useRef<Array<any>>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    if (error) setError(undefined);

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text.length > 0 && index < 5) {
      inputs.current[index + 1]?.focus?.();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus?.();
    }
  };

  const handleAutoFill = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError(undefined);
  };

  const handleVerify = async () => {
    const fullCode = otp.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const result = await verifyOtp(fullCode);
      if (result.success) {
        navigation.replace('MainTabs');
      } else {
        setError(result.error || 'Invalid OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    inputs.current[0]?.focus?.();
    setError(undefined);
  };

  return (
    <ScreenContainer
      scrollable
      backgroundColor={COLORS.background}
      header={
        <Header title="Partner Verification" showBack onBackPress={() => navigation.goBack()} />
      }
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <AppText variant="icon" style={styles.icon}>
              🔐
            </AppText>
          </View>
          <AppText variant="h2" style={styles.title}>
            Enter 6-Digit Store Code
          </AppText>
          <AppText variant="body" color={COLORS.textSecondary} align="center">
            Sent to manager at <AppText variant="bodyBold">{phoneNumber}</AppText>
          </AppText>
        </View>

        {/* OTP Input Row */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputs.current[index] = ref;
              }}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
                Boolean(error) ? styles.otpBoxError : null,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleOtpChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              selectTextOnFocus
            />
          ))}
        </View>

        {error && (
          <AppText
            variant="captionBold"
            color={COLORS.error}
            align="center"
            style={styles.errorText}
          >
            {error}
          </AppText>
        )}

        {/* Development Quick-Fill Helper */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleAutoFill} style={styles.autoFillBtn}>
          <AppText variant="captionBold" color={COLORS.primary}>
            ⚡ Auto-fill Test Code (123456)
          </AppText>
        </TouchableOpacity>

        {/* Resend Timer */}
        <View style={styles.resendRow}>
          {timer > 0 ? (
            <AppText variant="caption" color={COLORS.textMuted}>
              Resend code in{' '}
              <AppText variant="captionBold" color={COLORS.text}>
                {timer}s
              </AppText>
            </AppText>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <AppText variant="captionBold" color={COLORS.primary}>
                Resend Code Now
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        <AppButton
          title="Verify & Open Store Dashboard →"
          variant="primary"
          size="lg"
          loading={loading}
          onPress={handleVerify}
          style={styles.verifyBtn}
        />
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
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 28,
    lineHeight: 36,
    height: 36,
    width: 36,
    textAlign: 'center',
    includeFontPadding: false,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.lg,
    width: '100%',
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#F8FAFC',
  },
  otpBoxError: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    marginBottom: SPACING.md,
  },
  autoFillBtn: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  resendRow: {
    marginBottom: SPACING.xl,
  },
  verifyBtn: {
    width: '100%',
  },
});
