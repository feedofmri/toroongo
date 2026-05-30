import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Store, Star, Tag, FileText, MapPin, CreditCard,
  Gem, ArrowUpCircle, User, Bell, Info, LogOut, Pencil, ChevronRight,
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { subscriptionService } from '../../services/api';
import Badge from '../../components/common/Badge';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';
import { PLAN_COLORS } from '../../constants/config';

function SettingRow({ Icon, label, value, onPress, rightNode, danger, iconColor }) {
  const color = danger ? Colors.danger : (iconColor ?? Colors.textSecondary);
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={[styles.settingIconBox, { backgroundColor: color + '15' }]}>
        <Icon size={17} color={color} strokeWidth={2} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, danger && { color: Colors.danger }]}>{label}</Text>
        {value ? <Text style={styles.settingValue}>{value}</Text> : null}
      </View>
      {rightNode ?? (onPress ? <ChevronRight size={17} color={Colors.borderMedium} strokeWidth={2} /> : null)}
    </TouchableOpacity>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={[styles.sectionCard, Shadow.sm]}>{children}</View>
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    subscriptionService.current()
      .then((res) => setPlan(res.data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const planName = plan?.plan ?? plan?.name ?? 'Starter';
  const planColor = PLAN_COLORS[planName.toLowerCase()] ?? Colors.primary;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* Profile Card */}
        <TouchableOpacity
          style={[styles.profileCard, Shadow.sm]}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.85}
        >
          <View style={styles.avatarWrap}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarText}>{(user?.name ?? 'S')[0].toUpperCase()}</Text>
            )}
            <View style={styles.editDot}>
              <Pencil size={9} color={Colors.primary} strokeWidth={2.5} />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name ?? 'Seller'}</Text>
            <Text style={styles.profileEmail} numberOfLines={1}>{user?.email ?? ''}</Text>
            {user?.store_name ? <Text style={styles.profileStore}>{user.store_name}</Text> : null}
            <View style={styles.badgeRow}>
              <Badge label={`${planName} Plan`} color={planColor} />
              {user?.is_verified ? (
                <Badge label="Verified" color={Colors.success} style={{ marginLeft: Spacing.xs }} />
              ) : null}
            </View>
          </View>
          <ChevronRight size={18} color={Colors.borderMedium} strokeWidth={2} />
        </TouchableOpacity>

        <Section title="Store">
          <SettingRow Icon={Store} label="Storefront & Theme" iconColor={Colors.primary} onPress={() => navigation.navigate('Storefront')} />
          <SettingRow Icon={Star} label="Reviews" iconColor={Colors.warning} onPress={() => navigation.navigate('Reviews')} />
          <SettingRow Icon={Tag} label="Discounts & Coupons" iconColor={Colors.info} onPress={() => navigation.navigate('Discounts')} />
          <SettingRow Icon={FileText} label="Blog Posts" iconColor={Colors.success} onPress={() => navigation.navigate('Blogs')} />
          <SettingRow Icon={MapPin} label="Shipping Areas" iconColor="#8B5CF6" onPress={() => navigation.navigate('ShippingAreas')} />
          <SettingRow Icon={CreditCard} label="Payment Methods" iconColor="#06B6D4" onPress={() => navigation.navigate('PaymentMethods')} />
        </Section>

        <Section title="Subscription">
          <SettingRow Icon={Gem} label="Current Plan" value={planName} iconColor={planColor} rightNode={<Badge label={planName} color={planColor} />} />
          <SettingRow Icon={ArrowUpCircle} label="Upgrade Plan" iconColor={Colors.primary} onPress={() => navigation.navigate('Subscription')} />
        </Section>

        <Section title="Account">
          <SettingRow Icon={User} label="Edit Profile" iconColor={Colors.textSecondary} onPress={() => navigation.navigate('EditProfile')} />
          <SettingRow Icon={Bell} label="Notifications" iconColor={Colors.warning} onPress={() => navigation.navigate('Notifications')} />
        </Section>

        <Section title="About">
          <SettingRow Icon={Info} label="App Version" value="1.0.0" iconColor={Colors.textMuted} />
        </Section>

        <Section>
          <SettingRow Icon={LogOut} label="Sign Out" onPress={handleLogout} danger />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['4xl'] },
  title: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary, marginBottom: Spacing.lg },

  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.borderSoft,
    marginBottom: Spacing.lg, gap: Spacing.md,
  },
  avatarWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  avatarImg: { width: 64, height: 64, borderRadius: 32 },
  avatarText: { color: Colors.white, fontSize: FontSize.xl, fontFamily: FontFamily.bold },
  editDot: {
    position: 'absolute', bottom: 0, right: -2,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.borderSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  profileEmail: { fontSize: FontSize.sm, color: Colors.textMuted },
  profileStore: { fontSize: FontSize.sm, color: Colors.primary, fontFamily: FontFamily.medium },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },

  section: { marginBottom: Spacing.base },
  sectionTitle: {
    fontSize: FontSize.xs, fontFamily: FontFamily.semibold,
    color: Colors.textMuted, textTransform: 'uppercase',
    letterSpacing: 0.6, marginBottom: Spacing.sm, paddingHorizontal: 2,
  },
  sectionCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.borderSoft, overflow: 'hidden' },

  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.borderSoft, gap: Spacing.md,
  },
  settingIconBox: { width: 34, height: 34, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: FontSize.base, color: Colors.textPrimary },
  settingValue: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 1 },
});
