import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';

type QuantityStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function QuantityStepper({ value, onDecrease, onIncrease }: QuantityStepperProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onDecrease}
        android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true }}
        style={({ pressed }) => [styles.control, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
      >
        <Ionicons name="remove" size={16} color={colors.textPrimary} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        onPress={onIncrease}
        android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true }}
        style={({ pressed }) => [styles.control, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
      >
        <Ionicons name="add" size={16} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: s(4),
    paddingHorizontal: s(1),
  },
  control: {
    height: s(6),
    width: s(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: s(1),
  },
});
