/**
 * WeMeat Shop Owner App Design System & Tokens
 */

export const COLORS = {
  // Merchant Brand Colors
  primary: '#0F172A', // Deep Slate
  primaryDark: '#020617',
  primaryLight: '#334155',
  brandRed: '#E11D48', // WeMeat Signature Red
  brandRedLight: '#FFE4E6',

  // Accent & Action
  accent: '#10B981', // Emerald Success
  accentDark: '#059669',
  accentLight: '#D1FAE5',

  // Neutrals & Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  white: '#FFFFFF',

  // Text & Typography
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textLight: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#E11D48',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#0F172A',

  // Order Status Colors & Badges
  statusPending: '#D97706',
  statusPendingBg: '#FEF3C7',
  statusAccepted: '#2563EB',
  statusAcceptedBg: '#DBEAFE',
  statusPreparing: '#7C3AED',
  statusPreparingBg: '#EDE9FE',
  statusReady: '#059669',
  statusReadyBg: '#D1FAE5',
  statusOutForDelivery: '#0891B2',
  statusOutForDeliveryBg: '#CFFAFE',
  statusDelivered: '#16A34A',
  statusDeliveredBg: '#DCFCE7',
  statusRejected: '#DC2626',
  statusRejectedBg: '#FEE2E2',
  statusCancelled: '#64748B',
  statusCancelledBg: '#F1F5F9',

  // Feedback
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Overlay
  overlay: 'rgba(15, 23, 42, 0.6)',
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 34,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
  fontWeight: {
    regular: '400' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const SHADOWS = {
  none: {},
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
};
