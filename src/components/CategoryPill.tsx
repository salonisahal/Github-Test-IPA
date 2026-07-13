import React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';

type CategoryPillProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export default function CategoryPill({ label, selected, onPress }: CategoryPillProps) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: false }}
      style={({ pressed }) => [styles.pill, selected && styles.pillSelected, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: s(3),
    paddingVertical: s(2),
    borderRadius: s(4),
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginRight: s(2),
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  labelSelected: {
    color: colors.textInverse,
  },
});
