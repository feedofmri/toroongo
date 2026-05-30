import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Rocket, Gem, Building2, Star, Check } from 'lucide-react-native';
import { subscriptionService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';
import { PLAN_COLORS } from '../../constants/config';

const PLAN_ICONS = { starter: Rocket, pro: Gem, business: Building2, enterprise: Star };
const PLAN_FEATURES = {
  starter:    ['Up to 10 products', '5% transaction fee', 'Basic analytics', 'Email support'],
  pro:        ['Up to 100 products', '2% transaction fee', 'Advanced analytics', 'Priority support', 'Custom domain'],
  business:   ['Up to 500 products', '1% transaction fee', 'Full analytics suite', 'Dedicated support', 'Custom domain', 'AI tools'],
  enterprise: ['Unlimited products', '0% transaction fee', 'Full analytics suite', 'Dedicated manager', 'Custom domain', 'AI tools', 'API access'],
};
const PLAN_ORDER = ['starter', 'pro', 'business', 'enterprise'];

function PlanCard({ plan, isCurrent, onUpgrade, onDowngrade, currentPlanName }) {
  const key = plan.name?.toLowerCase() ?? '';
  const color = PLAN_COLORS[key] ?? Colors.primary;
  const features = PLAN_FEATURES[key] ?? [];
  const IconComp = PLAN_ICONS[key] ?? Gem;
  const thisIdx = PLAN_ORDER.indexOf(key);
  const currentIdx = PLAN_ORDER.indexOf(currentPlanName?.toLowerCase() ?? 'starter');
  const isUpgrade = thisIdx > currentIdx;

  return (
    <View style={[styles.planCard, isCurrent && { borderColor: color, borderWidth: 2 }, Shadow.sm]}>
      {isCurrent && (
        <View style={[styles.currentBadge, { backgroundColor: color }]}>
          <Text style={styles.currentBadgeText}>Current Plan</Text>
        </View>
      )}
      <View style={[styles.planIconBg, { backgroundColor: color + '18' }]}>
        <IconComp size={24} color={color} strokeWidth={2} />
      </View>
      <Text style={[styles.planName, { color }]}>{plan.name ?? key}</Text>
      <Text style={styles.planPrice}>
        {plan.price === 0 || plan.price === null ? 'Free' : `$${plan.price}/mo`}
      </Text>
      <View style={styles.featuresList}>
        {features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Check size={14} color={color} strokeWidth={2.5} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>
      {!isCurrent && (
        <TouchableOpacity
          style={[styles.planBtn, { backgroundColor: isUpgrade ? color : Colors.surfaceAlt }]}
          onPress={() => isUpgrade ? onUpgrade(plan) : onDowngrade(plan)}
          activeOpacity={0.8}
        >
          <Text style={[styles.planBtnText, !isUpgrade && { color: Colors.textSecondary }]}>
            {isUpgrade ? 'Upgrade' : 'Downgrade'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function SubscriptionScreen({ navigation }) {
  const [current, setCurrent] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [curRes, plansRes] = await Promise.allSettled([
        subscriptionService.current(),
        subscriptionService.plans(),
      ]);
      if (curRes.status === 'fulfilled') setCurrent(curRes.value?.data);
      if (plansRes.status === 'fulfilled') {
        const data = plansRes.value?.data?.data ?? plansRes.value?.data ?? [];
        setPlans(Array.isArray(data) ? data : []);
      }
    } catch (_) {}
  }, []);

  useEffect(() => { fetchData().finally(() => setLoading(false)); }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleUpgrade = (plan) => {
    Alert.alert(`Upgrade to ${plan.name}`, `Upgrade to the ${plan.name} plan?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Upgrade', onPress: async () => {
        setActionLoading(true);
        try {
          await subscriptionService.upgrade(plan.id ?? plan.name?.toLowerCase());
          await fetchData();
          Alert.alert('Success', `Upgraded to ${plan.name}!`);
        } catch (err) {
          Alert.alert('Error', err.response?.data?.message ?? 'Upgrade failed.');
        } finally { setActionLoading(false); }
      }},
    ]);
  };

  const handleDowngrade = (plan) => {
    Alert.alert(`Downgrade to ${plan.name}`, 'Some features may be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Downgrade', style: 'destructive', onPress: async () => {
        setActionLoading(true);
        try {
          await subscriptionService.downgrade(plan.id ?? plan.name?.toLowerCase());
          await fetchData();
          Alert.alert('Done', `Downgraded to ${plan.name}.`);
        } catch (err) {
          Alert.alert('Error', err.response?.data?.message ?? 'Downgrade failed.');
        } finally { setActionLoading(false); }
      }},
    ]);
  };

  const currentPlanName = current?.plan ?? current?.name ?? 'starter';

  if (loading || actionLoading) return <LoadingSpinner fullScreen label={actionLoading ? 'Processing...' : undefined} />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Subscription</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />}
      >
        <Text style={styles.sectionTitle}>Choose your plan</Text>
        <Text style={styles.sectionSub}>Upgrade anytime to unlock more features</Text>

        {plans.length === 0 ? (
          <View style={styles.empty}>
            <Gem size={48} color={Colors.borderMedium} strokeWidth={1.5} />
            <Text style={styles.emptyText}>No plans available right now.</Text>
          </View>
        ) : (
          plans.map((plan) => (
            <PlanCard
              key={plan.id ?? plan.name}
              plan={plan}
              isCurrent={(plan.name?.toLowerCase() ?? '') === currentPlanName?.toLowerCase()}
              currentPlanName={currentPlanName}
              onUpgrade={handleUpgrade}
              onDowngrade={handleDowngrade}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderSoft,
  },
  backBtn: { padding: Spacing.xs },
  title: { flex: 1, fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary, textAlign: 'center' },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['4xl'], gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  sectionSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  planCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.borderSoft,
    gap: Spacing.sm, position: 'relative', overflow: 'hidden',
  },
  currentBadge: { position: 'absolute', top: 0, right: 0, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderBottomLeftRadius: Radius.md },
  currentBadgeText: { fontSize: FontSize.xs, color: Colors.white, fontFamily: FontFamily.semibold },
  planIconBg: { width: 48, height: 48, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  planName: { fontSize: FontSize.lg, fontFamily: FontFamily.bold },
  planPrice: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary },
  featuresList: { gap: Spacing.xs, marginTop: Spacing.xs },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  featureText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  planBtn: { paddingVertical: Spacing.sm, borderRadius: Radius.lg, alignItems: 'center', marginTop: Spacing.sm },
  planBtnText: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.white },
  empty: { alignItems: 'center', paddingTop: Spacing['3xl'], gap: Spacing.sm },
  emptyText: { fontSize: FontSize.base, color: Colors.textMuted },
});
