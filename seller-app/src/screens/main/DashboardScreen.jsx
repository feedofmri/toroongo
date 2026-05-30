import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell, Gem, DollarSign, Receipt, Clock, CheckCircle,
  PlusCircle, ShoppingBag, MessageCircle, Store,
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { orderService, subscriptionService, productService } from '../../services/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';
import { ORDER_STATUSES, PLAN_COLORS } from '../../constants/config';

function StatCard({ label, value, Icon, bgColor, iconColor }) {
  return (
    <View style={[styles.statCard, Shadow.sm]}>
      <View style={[styles.statIconBg, { backgroundColor: bgColor }]}>
        <Icon size={20} color={iconColor} strokeWidth={2} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({ Icon, label, onPress, color }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.quickIconBg, { backgroundColor: color + '18' }]}>
        <Icon size={22} color={color} strokeWidth={2} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function getStatusMeta(status) {
  return ORDER_STATUSES.find((s) => s.value === status) ?? { label: status, color: Colors.textMuted };
}

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, planRes] = await Promise.allSettled([
        orderService.listSeller({ per_page: 50 }),
        subscriptionService.current(),
      ]);
      if (ordersRes.status === 'fulfilled') {
        const data = ordersRes.value?.data;
        setOrders(data?.data ?? (Array.isArray(data) ? data : []));
      }
      if (planRes.status === 'fulfilled') {
        setPlan(planRes.value?.data);
      }
    } catch (_) {}
  }, []);

  useEffect(() => { fetchData().finally(() => setLoading(false)); }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total ?? 0), 0);
  const pending = orders.filter((o) => o.status === 'pending').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const recentOrders = orders.slice(0, 8);

  const planName = plan?.plan ?? plan?.name ?? 'Starter';
  const planColor = PLAN_COLORS[planName.toLowerCase()] ?? Colors.primary;

  if (loading) return <LoadingSpinner fullScreen label="Loading dashboard..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Good day, {user?.name?.split(' ')[0] ?? 'Seller'}</Text>
            <Text style={styles.storeName}>{user?.store_name ?? 'Your Store'}</Text>
          </View>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={20} color={Colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('Settings')}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarText}>{(user?.name ?? 'S')[0].toUpperCase()}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Plan Card */}
        <TouchableOpacity
          style={[styles.planCard, { borderLeftColor: planColor }]}
          onPress={() => navigation.navigate('Subscription')}
          activeOpacity={0.85}
        >
          <View style={[styles.planIconBg, { backgroundColor: planColor + '20' }]}>
            <Gem size={20} color={planColor} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.planLabel}>Current Plan</Text>
            <Text style={[styles.planName, { color: planColor }]}>{planName}</Text>
          </View>
          <Text style={[styles.planManage, { color: planColor }]}>Manage →</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Revenue" value={`$${totalRevenue.toFixed(0)}`} Icon={DollarSign} bgColor={Colors.primaryMuted} iconColor={Colors.primary} />
          <StatCard label="Orders" value={orders.length} Icon={Receipt} bgColor={Colors.infoLight} iconColor={Colors.info} />
          <StatCard label="Pending" value={pending} Icon={Clock} bgColor={Colors.warningLight} iconColor={Colors.warning} />
          <StatCard label="Delivered" value={delivered} Icon={CheckCircle} bgColor={Colors.successLight} iconColor={Colors.success} />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <QuickAction Icon={PlusCircle} label="Add Product" color={Colors.primary} onPress={() => navigation.navigate('AddProduct')} />
          <QuickAction Icon={Receipt} label="Orders" color={Colors.info} onPress={() => navigation.navigate('Orders')} />
          <QuickAction Icon={MessageCircle} label="Messages" color={Colors.warning} onPress={() => navigation.navigate('Messages')} />
          <QuickAction Icon={Store} label="Storefront" color={Colors.success} onPress={() => navigation.navigate('Storefront')} />
        </View>

        {/* Recent Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.length === 0 ? (
          <View style={[styles.emptyCard, Shadow.sm]}>
            <ShoppingBag size={40} color={Colors.borderMedium} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>When customers place orders, they'll appear here.</Text>
          </View>
        ) : (
          recentOrders.map((order) => {
            const meta = getStatusMeta(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={[styles.orderCard, Shadow.sm]}
                onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                activeOpacity={0.75}
              >
                <View style={styles.orderRow}>
                  <View style={styles.orderIconBg}>
                    <Receipt size={16} color={Colors.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.orderMid}>
                    <Text style={styles.orderId}>Order #{order.id}</Text>
                    <Text style={styles.orderBuyer} numberOfLines={1}>
                      {order.buyer?.name ?? order.user?.name ?? 'Customer'}
                    </Text>
                    <Text style={styles.orderDate}>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                    </Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderTotal}>${parseFloat(order.total ?? 0).toFixed(2)}</Text>
                    <Badge label={meta.label} color={meta.color} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },

  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg, gap: Spacing.sm },
  greeting: { fontSize: FontSize.sm, color: Colors.textMuted },
  storeName: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  iconBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.borderSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 40, height: 40 },
  avatarText: { color: Colors.white, fontSize: FontSize.base, fontFamily: FontFamily.bold },

  planCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSoft,
    borderLeftWidth: 4, marginBottom: Spacing.lg, gap: Spacing.sm,
    ...Shadow.sm,
  },
  planIconBg: { width: 38, height: 38, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  planLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  planName: { fontSize: FontSize.base, fontFamily: FontFamily.bold, marginTop: 1 },
  planManage: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSoft, gap: Spacing.xs,
  },
  statIconBg: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  statValue: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted },

  sectionTitle: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.base },
  viewAll: { fontSize: FontSize.sm, color: Colors.primary, fontFamily: FontFamily.medium },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  quickAction: { alignItems: 'center', flex: 1 },
  quickIconBg: { width: 52, height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  quickLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontFamily: FontFamily.medium, textAlign: 'center' },

  orderCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSoft, marginBottom: Spacing.sm,
  },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  orderIconBg: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  orderMid: { flex: 1 },
  orderRight: { alignItems: 'flex-end', gap: 6 },
  orderId: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  orderBuyer: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  orderDate: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 1 },
  orderTotal: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.textPrimary },

  emptyCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing['2xl'], alignItems: 'center',
    borderWidth: 1, borderColor: Colors.borderSoft, gap: Spacing.sm,
  },
  emptyTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});
