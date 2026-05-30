import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Receipt, Calendar, List } from 'lucide-react-native';
import { orderService } from '../../services/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';
import { ORDER_STATUSES } from '../../constants/config';

const FILTERS = [{ value: '', label: 'All' }, ...ORDER_STATUSES];

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchOrders = useCallback(async (status = filter) => {
    try {
      const res = await orderService.listSeller({ status: status || undefined });
      setOrders(res.data?.data ?? res.data ?? []);
    } catch (_) {
      setOrders([]);
    }
  }, [filter]);

  useEffect(() => { fetchOrders().finally(() => setLoading(false)); }, [filter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const getStatusMeta = (status) =>
    ORDER_STATUSES.find((s) => s.value === status) ?? { label: status, color: Colors.textMuted };

  const renderOrder = ({ item }) => {
    const meta = getStatusMeta(item.status);
    const buyer = item.buyer?.name ?? item.user?.name ?? 'Customer';
    const date = item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric',
    }) : '';
    const itemCount = item.items?.length ?? item.order_items?.length ?? 0;

    return (
      <TouchableOpacity
        style={[styles.orderCard, Shadow.sm]}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.orderTop}>
          <View style={styles.orderIconBg}>
            <Receipt size={16} color={Colors.primary} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.orderBuyer}>{buyer}</Text>
          </View>
          <Badge label={meta.label} color={meta.color} />
        </View>

        <View style={styles.orderBottom}>
          <View style={styles.orderMeta}>
            <View style={styles.metaChip}>
              <Calendar size={12} color={Colors.textMuted} strokeWidth={2} />
              <Text style={styles.metaText}>{date}</Text>
            </View>
            <View style={styles.metaChip}>
              <List size={12} color={Colors.textMuted} strokeWidth={2} />
              <Text style={styles.metaText}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
            </View>
          </View>
          <Text style={styles.total}>${parseFloat(item.total ?? 0).toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <LoadingSpinner label="Loading orders..." />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Receipt size={56} color={Colors.borderMedium} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No orders found</Text>
              <Text style={styles.emptyText}>
                {filter ? `No ${filter} orders at the moment.` : 'Your orders will appear here.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary },

  filtersScroll: { maxHeight: 50 },
  filters: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.borderSoft,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontFamily: FontFamily.medium },
  filterTextActive: { color: Colors.white },

  list: { paddingHorizontal: Spacing.base, paddingBottom: Spacing['3xl'], gap: Spacing.sm },

  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    gap: Spacing.sm,
  },
  orderTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  orderIconBg: {
    width: 36, height: 36, borderRadius: Radius.md,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  orderId: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  orderBuyer: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },

  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSoft,
  },
  orderMeta: { flexDirection: 'row', gap: Spacing.sm },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSize.xs, color: Colors.textMuted },
  total: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.primary },

  empty: { alignItems: 'center', paddingTop: Spacing['4xl'], gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});
