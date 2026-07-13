export const s = (n: number) => n * 4;

export const spacing = {
  xs: s(1),
  sm: s(2),
  md: s(3),
  lg: s(4),
  xl: s(6),
  xxl: s(8),
} as const;
