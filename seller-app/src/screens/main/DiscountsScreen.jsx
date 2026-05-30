import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, Alert, Modal, TextInput, Switch, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Tag, ShoppingCart, Calendar, Trash2 } from 'lucide-react-native';
import { discountService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';

const EMPTY_FORM = { code: '', type: 'percentage', value: '', min_order_amount: '', expires_at: '' };

function DiscountCard({ item, onToggle, onDelete }) {
  const isActive = !!item.is_active;
  const typeLabel = item.type === 'percentage' ? `${item.value}%` : `$${item.value}`;
  return (
    <View style={[styles.card, Shadow.sm]}>
      <View style={styles.cardTop}>
        <View style={[styles.codeBox, { backgroundColor: isActive ? Colors.primaryMuted : Colors.surfaceAlt }]}>
          <Text style={[styles.codeText, { color: isActive ? Colors.primary : Colors.textMuted }]}>{item.code}</Text>
        </View>
        <View style={styles.cardActions}>
          <Switch
            value={isActive}
            onValueChange={() => onToggle(item.id)}
            trackColor={{ false: Colors.borderMedium, true: Colors.primaryLight }}
            thumbColor={isActive ? Colors.primary : Colors.white}
          />
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Trash2 size={18} color={Colors.danger} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.chips}>
        <Chip Icon={Tag} text={`${typeLabel} off`} color={Colors.info} />
        {item.min_order_amount ? <Chip Icon={ShoppingCart} text={`Min $${item.min_order_amount}`} color={Colors.textMuted} /> : null}
        {item.expires_at ? <Chip Icon={Calendar} text={`Exp ${new Date(item.expires_at).toLocaleDateString()}`} color={Colors.warning} /> : null}
      </View>
    </View>
  );
}

function Chip({ Icon, text, color }) {
  return (
    <View style={styles.chip}>
      <Icon size={12} color={color} strokeWidth={2} />
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

function FieldLabel({ label, error }) {
  return (
    <View style={{ marginBottom: 4, marginTop: Spacing.sm }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

export default function DiscountsScreen({ navigation }) {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchDiscounts = useCallback(async () => {
    try {
      const res = await discountService.list();
      const data = res.data?.data ?? res.data ?? [];
      setDiscounts(Array.isArray(data) ? data : []);
    } catch (_) { setDiscounts([]); }
  }, []);

  useEffect(() => { fetchDiscounts().finally(() => setLoading(false)); }, [fetchDiscounts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDiscounts();
    setRefreshing(false);
  }, [fetchDiscounts]);

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleCreate = async () => {
    const errs = {};
    if (!form.code.trim()) errs.code = 'Code is required';
    if (!form.value || isNaN(form.value)) errs.value = 'Valid value required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await discountService.create({
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: parseFloat(form.value),
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
        expires_at: form.expires_at || null,
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      await fetchDiscounts();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.keys(data.errors).forEach((k) => { mapped[k] = data.errors[k][0]; });
        setErrors(mapped);
      } else Alert.alert('Error', data?.message ?? 'Could not create discount.');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    try {
      await discountService.toggle(id);
      setDiscounts((prev) => prev.map((d) => d.id === id ? { ...d, is_active: !d.is_active } : d));
    } catch (_) { Alert.alert('Error', 'Could not update discount.'); }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Discount', 'Delete this discount code?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await discountService.delete(id);
          setDiscounts((prev) => prev.filter((d) => d.id !== id));
        } catch (_) { Alert.alert('Error', 'Could not delete discount.'); }
      }},
    ]);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Discounts</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setForm(EMPTY_FORM); setErrors({}); setShowModal(true); }}>
          <Plus size={22} color={Colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={discounts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <DiscountCard item={item} onToggle={handleToggle} onDelete={handleDelete} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Tag size={56} color={Colors.borderMedium} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No discounts yet</Text>
            <Text style={styles.emptyText}>Tap + to create your first discount code.</Text>
          </View>
        }
      />

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setShowModal(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>New Discount</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <FieldLabel label="Discount Code *" error={errors.code} />
            <TextInput style={[styles.input, errors.code && styles.inputError]} placeholder="e.g. SAVE20" placeholderTextColor={Colors.textLight} value={form.code} onChangeText={(v) => setField('code', v)} autoCapitalize="characters" />

            <FieldLabel label="Discount Type" />
            <View style={styles.typeRow}>
              {['percentage', 'fixed'].map((t) => (
                <TouchableOpacity key={t} style={[styles.typeBtn, form.type === t && styles.typeBtnActive]} onPress={() => setField('type', t)}>
                  <Text style={[styles.typeBtnText, form.type === t && styles.typeBtnTextActive]}>
                    {t === 'percentage' ? '% Percentage' : '$ Fixed Amount'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FieldLabel label={`Value * ${form.type === 'percentage' ? '(%)' : '($)'}`} error={errors.value} />
            <TextInput style={[styles.input, errors.value && styles.inputError]} placeholder={form.type === 'percentage' ? 'e.g. 20' : 'e.g. 5.00'} placeholderTextColor={Colors.textLight} value={form.value} onChangeText={(v) => setField('value', v)} keyboardType="decimal-pad" />

            <FieldLabel label="Minimum Order Amount (optional)" />
            <TextInput style={styles.input} placeholder="e.g. 50.00" placeholderTextColor={Colors.textLight} value={form.min_order_amount} onChangeText={(v) => setField('min_order_amount', v)} keyboardType="decimal-pad" />

            <FieldLabel label="Expires At (optional, YYYY-MM-DD)" />
            <TextInput style={styles.input} placeholder="2025-12-31" placeholderTextColor={Colors.textLight} value={form.expires_at} onChangeText={(v) => setField('expires_at', v)} />

            <Button title="Create Discount" onPress={handleCreate} loading={saving} fullWidth style={{ marginTop: Spacing.base }} />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderSoft },
  backBtn: { padding: Spacing.xs },
  title: { flex: 1, fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary, textAlign: 'center' },
  addBtn: { width: 38, height: 38, borderRadius: Radius.md, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing['3xl'] },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSoft, gap: Spacing.sm },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codeBox: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.sm },
  codeText: { fontSize: FontSize.base, fontFamily: FontFamily.bold, letterSpacing: 1 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surfaceAlt, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  chipText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontFamily: FontFamily.medium },
  empty: { alignItems: 'center', paddingTop: Spacing['4xl'], paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  backdrop: { flex: 1, backgroundColor: Colors.overlay },
  sheet: { backgroundColor: Colors.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: Spacing['4xl'], maxHeight: '85%' },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.borderMedium, alignSelf: 'center', marginBottom: Spacing.md },
  sheetTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  fieldLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  fieldError: { fontSize: FontSize.xs, color: Colors.danger, marginTop: 2 },
  input: { backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.borderSoft, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing.xs },
  inputError: { borderColor: Colors.danger },
  typeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xs },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.borderSoft, alignItems: 'center', backgroundColor: Colors.surfaceAlt },
  typeBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  typeBtnText: { fontSize: FontSize.sm, color: Colors.textMuted, fontFamily: FontFamily.medium },
  typeBtnTextActive: { color: Colors.primary },
});
