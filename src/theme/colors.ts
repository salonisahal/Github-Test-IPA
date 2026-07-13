export const colors = {
  primary: '#DC2626',
  primaryDark: '#B91C1C',
  primaryLight: '#FEE2E2',
  accent: '#EF4444',
  background: '#F5F6FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  textInverse: '#FFFFFF',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  shadowColor: '#000000',
} as const;

export type Colors = typeof colors;
