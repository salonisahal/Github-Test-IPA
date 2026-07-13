import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';

type StatRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

export default function StatRow({ label, value, highlight }: StatRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, highlight && styles.valueHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(2),
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 13 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  valueHighlight: {
    color: colors.primary,
  },
});
