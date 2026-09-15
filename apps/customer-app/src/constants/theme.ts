/**
 * WeMeat Customer App Design System & Tokens
 */

export const COLORS = {
  // Brand Colors
  primary: '#E11D48', // WeMeat Rose-Red
  primaryDark: '#BE123C',
  primaryLight: '#FFE4E6',
  primaryGradientStart: '#F43F5E',
  primaryGradientEnd: '#E11D48',

  // Fresh Accent
  accent: '#10B981', // Fresh Emerald
  accentDark: '#059669',
  accentLight: '#D1FAE5',

  // Neutrals & Backgrounds
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  white: '#FFFFFF',

  // Text & Typography
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textLight: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#E11D48',

  // Borders & Dividers
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderFocus: '#E11D48',

  // Status & Feedback
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Badges & Highlights
  tagBg: '#FFF1F2',
  tagText: '#BE123C',
  star: '#F59E0B',
  overlay: 'rgba(0, 0, 0, 0.45)',
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
    display: 36,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingBar: {
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
};
