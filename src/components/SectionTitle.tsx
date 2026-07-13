import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: s(2),
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 18 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    marginTop: s(1),
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 13 * 1.4,
    fontFamily: 'Inter-Regular',
  },
});
