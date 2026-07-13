import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';
import { addresses, preferences } from '../data/mockData';
import { ProfilePreference } from '../types';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const [prefs, setPrefs] = useState<ProfilePreference[]>(preferences);

  const togglePref = (id: string) => {
    setPrefs((prev) => prev.map((pref) => (pref.id === id ? { ...pref, enabled: !pref.enabled } : pref)));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <HeaderBar title="Profile" subtitle="Account and preferences" />
      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={colors.textInverse} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Casey Morgan</Text>
            <Text style={styles.profileEmail}>casey.morgan@email.com</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          {addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <Text style={styles.addressLabel}>{address.label}</Text>
              <Text style={styles.addressText}>{address.line1}</Text>
              <Text style={styles.addressText}>{address.line2}</Text>
              <Text style={styles.addressText}>{address.city}, {address.state} {address.zip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {prefs.map((pref) => (
            <Pressable
              key={pref.id}
              onPress={() => togglePref(pref.id)}
              android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
              style={({ pressed }) => [styles.prefRow, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
            >
              <Text style={styles.prefText}>{pref.title}</Text>
              <View style={[styles.prefToggle, pref.enabled && styles.prefToggleActive]}>
                {pref.enabled ? <Ionicons name="checkmark" size={14} color={colors.textInverse} /> : null}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactIcon}>
              <Ionicons name="logo-whatsapp" size={18} color={colors.textInverse} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactText}>+1 (415) 555-0199</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>Version 1.0 · Demo shopping experience built with Expo.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === 'web' ? { overflow: 'hidden', maxHeight: '100vh' as any } : {}),
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: s(4),
    paddingBottom: s(8),
  },
  profileCard: {
    marginTop: s(3),
    padding: s(3),
    borderRadius: s(3),
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  avatar: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 16 * 1.2,
    fontFamily: 'Inter-Bold',
  },
  profileEmail: {
    marginTop: s(1),
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginTop: s(4),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 16 * 1.2,
    fontFamily: 'Inter-Bold',
    marginBottom: s(2),
  },
  addressCard: {
    padding: s(3),
    borderRadius: s(3),
    backgroundColor: colors.surface,
    marginBottom: s(2),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  addressText: {
    marginTop: s(1),
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Regular',
  },
  prefRow: {
    paddingVertical: s(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  prefText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 14 * 1.4,
    fontFamily: 'Inter-Medium',
  },
  prefToggle: {
    width: s(7),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefToggleActive: {
    backgroundColor: colors.primary,
  },
  contactCard: {
    padding: s(3),
    borderRadius: s(3),
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  contactIcon: {
    width: s(7),
    height: s(7),
    borderRadius: s(3.5),
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-SemiBold',
  },
  contactText: {
    marginTop: s(1),
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Regular',
  },
  aboutCard: {
    padding: s(3),
    borderRadius: s(3),
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  aboutText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    lineHeight: 12 * 1.4,
    fontFamily: 'Inter-Regular',
  },
});
