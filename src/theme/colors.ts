export const colors = {
  primary: '#DC2626',
  primaryDark: '#B91C1C',
  primaryLight: '#7F1D1D',
  accent: '#F87171',
  background: '#0B0F14',
  surface: '#141A22',
  card: '#141A22',
  border: '#27303A',
  textPrimary: '#F9FAFB',
  textSecondary: '#A1A1AA',
  textDisabled: '#6B7280',
  textInverse: '#FFFFFF',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#60A5FA',
  shadowColor: '#000000',
} as const;

export type Colors = typeof colors;
