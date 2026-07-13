import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';

type HeaderBarProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function HeaderBar({ title, subtitle, actionLabel, onActionPress }: HeaderBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
          style={({ pressed }) => [styles.action, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(4),
    paddingVertical: s(3),
    backgroundColor: colors.background,
  },
  titleBlock: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 24 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    marginTop: s(1),
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-Regular',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(2),
    paddingVertical: s(1),
    borderRadius: s(2),
    backgroundColor: colors.primaryLight,
  },
  actionText: {
    marginRight: s(1),
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 1.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
});
