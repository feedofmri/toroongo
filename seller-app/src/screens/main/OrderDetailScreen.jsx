import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Check } from 'lucide-react-native';
import { orderService } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius } from '../../constants/theme';
import { ORDER_STATUSES } from '../../constants/config';

export default function OrderDetailScreen({ navigation, route }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    orderService.getById(orderId)
      .then((res) => setOrder(res.data))
      .catch(() => Alert.alert('Error', 'Could not load order.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleStatusUpdate = async (newStatus) => {
    setShowStatusModal(false);
    setUpdating(true);
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrder((o) => ({ ...o, status: newStatus }));
      Alert.alert('Updated', `Order status changed to "${newStatus}".`);
    } catch (_) {
      Alert.alert('Error', 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusMeta = (status) =>
    ORDER_STATUSES.find((s) => s.value === status) ?? { label: status, color: Colors.textMuted };

  if (loading) return <LoadingSpinner fullScreen label="Loading order..." />;
  if (!order) return null;

  const meta = getStatusMeta(order.status);
  const items = order.items ?? order.order_items ?? [];
  const buyer = order.buyer ?? order.user ?? {};

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Order #{order.id}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status */}
        <Card style={styles.section}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.label}>Status</Text>
              <Badge label={meta.label} color={meta.color} style={styles.badge} />
            </View>
            <Button
              title={updating ? '...' : 'Update Status'}
              onPress={() => setShowStatusModal(true)}
              variant="outline"
              size="sm"
              disabled={updating}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Calendar size={14} color={Colors.textMuted} strokeWidth={2} />
            <Text style={styles.dateText}>
              Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : ''}
            </Text>
          </View>
        </Card>

        {/* Buyer Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Buyer Details</Text>
          <InfoRow label="Name" value={buyer.name ?? '—'} />
          <InfoRow label="Email" value={buyer.email ?? '—'} />
          {order.shipping_address && (
            <InfoRow label="Address" value={
              typeof order.shipping_address === 'string'
                ? order.shipping_address
                : `${order.shipping_address.line1 ?? ''}, ${order.shipping_address.city ?? ''}`
            } />
          )}
        </Card>

        {/* Order Items */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {items.map((item, i) => (
            <View key={i} style={[styles.itemRow, i < items.length - 1 && styles.itemDivider]}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.product?.name ?? item.name ?? 'Product'}
                </Text>
                {item.variant && <Text style={styles.itemVariant}>{item.variant}</Text>}
              </View>
              <View style={styles.itemPricing}>
                <Text style={styles.itemQty}>×{item.quantity}</Text>
                <Text style={styles.itemPrice}>${parseFloat(item.price ?? 0).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Payment Summary */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <SummaryRow label="Subtotal" value={`$${parseFloat(order.subtotal ?? order.total ?? 0).toFixed(2)}`} />
          {order.shipping_fee !== undefined && (
            <SummaryRow label="Shipping" value={`$${parseFloat(order.shipping_fee ?? 0).toFixed(2)}`} />
          )}
          {order.discount !== undefined && order.discount > 0 && (
            <SummaryRow label="Discount" value={`-$${parseFloat(order.discount).toFixed(2)}`} color={Colors.success} />
          )}
          <View style={styles.totalDivider} />
          <SummaryRow
            label="Total"
            value={`$${parseFloat(order.total ?? 0).toFixed(2)}`}
            bold
          />
          {order.payment_method && (
            <SummaryRow label="Payment" value={order.payment_method} />
          )}
        </Card>
      </ScrollView>

      {/* Status Modal */}
      <Modal visible={showStatusModal} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setShowStatusModal(false)} activeOpacity={1}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Update Order Status</Text>
            {ORDER_STATUSES.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[styles.statusOption, order.status === s.value && styles.statusOptionActive]}
                onPress={() => handleStatusUpdate(s.value)}
              >
                <View style={[styles.dot, { backgroundColor: s.color }]} />
                <Text style={[styles.statusOptionText, order.status === s.value && styles.statusOptionTextActive]}>
                  {s.label}
                </Text>
                {order.status === s.value && <Check size={18} color={Colors.primary} strokeWidth={2.5} />}
              </TouchableOpacity>
            ))}
            <Button title="Cancel" onPress={() => setShowStatusModal(false)} variant="ghost" fullWidth style={styles.cancelBtn} />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SummaryRow({ label, value, bold, color }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.summaryBold]}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.summaryBold, color && { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderSoft,
  },
  backBtn: { padding: Spacing.xs },
  title: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary },

  scroll: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  section: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.textPrimary, marginBottom: Spacing.md },

  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  label: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 4 },
  badge: { marginTop: 2 },
  dateText: { fontSize: FontSize.sm, color: Colors.textMuted },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { fontSize: FontSize.sm, color: Colors.textMuted, flex: 1 },
  infoValue: { fontSize: FontSize.sm, color: Colors.textPrimary, fontFamily: FontFamily.medium, flex: 2, textAlign: 'right' },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm },
  itemDivider: { borderBottomWidth: 1, borderBottomColor: Colors.borderSoft },
  itemInfo: { flex: 1, paddingRight: Spacing.sm },
  itemName: { fontSize: FontSize.sm, color: Colors.textPrimary, fontFamily: FontFamily.medium },
  itemVariant: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  itemPricing: { alignItems: 'flex-end' },
  itemQty: { fontSize: FontSize.xs, color: Colors.textMuted },
  itemPrice: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.textPrimary },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryValue: { fontSize: FontSize.sm, color: Colors.textPrimary },
  summaryBold: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  totalDivider: { height: 1, backgroundColor: Colors.borderSoft, marginVertical: Spacing.sm },

  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
    padding: Spacing.xl, paddingBottom: Spacing['3xl'],
  },
  modalTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary, marginBottom: Spacing.lg, textAlign: 'center' },
  statusOption: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.base,
    borderRadius: Radius.md, marginBottom: Spacing.xs,
  },
  statusOptionActive: { backgroundColor: Colors.primaryMuted },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.md },
  statusOptionText: { fontSize: FontSize.base, color: Colors.textPrimary, flex: 1 },
  statusOptionTextActive: { color: Colors.primary, fontFamily: FontFamily.semibold },
  cancelBtn: { marginTop: Spacing.sm },
});
