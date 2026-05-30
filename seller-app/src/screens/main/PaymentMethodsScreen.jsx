import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, CreditCard, Building2, Smartphone, Pencil, Trash2 } from 'lucide-react-native';
import { paymentMethodService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';

const EMPTY_FORM = { type: 'bank', name: '', account_number: '', instructions: '' };
const TYPE_ICONS = { bank: Building2, mobile: Smartphone, card: CreditCard };
const TYPE_COLORS = { bank: Colors.info, mobile: Colors.success, card: Colors.warning };

function MethodCard({ item, onEdit, onDelete }) {
  const type = item.type ?? 'bank';
  const IconComp = TYPE_ICONS[type] ?? CreditCard;
  const color = TYPE_COLORS[type] ?? Colors.primary;
  return (
    <View style={[styles.card, Shadow.sm]}>
      <View style={[styles.methodIcon, { backgroundColor: color + '18' }]}>
        <IconComp size={22} color={color} strokeWidth={2} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.methodName}>{item.name}</Text>
        {item.account_number ? <Text style={styles.accountNum}>{item.account_number}</Text> : null}
        {item.instructions ? <Text style={styles.instructions} numberOfLines={2}>{item.instructions}</Text> : null}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.iconBtn}>
          <Pencil size={16} color={Colors.info} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.iconBtn}>
          <Trash2 size={16} color={Colors.danger} strokeWidth={2} />
        </TouchableOpacity>
      </View>
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

export default function PaymentMethodsScreen({ navigation }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchMethods = useCallback(async () => {
    try {
      const res = await paymentMethodService.list();
      const data = res.data?.data ?? res.data ?? [];
      setMethods(Array.isArray(data) ? data : []);
    } catch (_) { setMethods([]); }
  }, []);

  useEffect(() => { fetchMethods().finally(() => setLoading(false)); }, [fetchMethods]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMethods();
    setRefreshing(false);
  }, [fetchMethods]);

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setErrors({ name: 'Name is required' }); return; }
    setSaving(true);
    try {
      const payload = { type: form.type, name: form.name.trim(), account_number: form.account_number.trim(), instructions: form.instructions.trim() };
      if (editingId) await paymentMethodService.update(editingId, payload);
      else await paymentMethodService.create(payload);
      setShowModal(false);
      await fetchMethods();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) { const mapped = {}; Object.keys(data.errors).forEach((k) => { mapped[k] = data.errors[k][0]; }); setErrors(mapped); }
      else Alert.alert('Error', data?.message ?? 'Could not save.');
    } finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Remove this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await paymentMethodService.delete(id); setMethods((prev) => prev.filter((m) => m.id !== id)); }
        catch (_) { Alert.alert('Error', 'Could not delete.'); }
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
        <Text style={styles.title}>Payment Methods</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setEditingId(null); setForm(EMPTY_FORM); setErrors({}); setShowModal(true); }}>
          <Plus size={22} color={Colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={methods}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MethodCard item={item} onEdit={(i) => { setEditingId(i.id); setForm({ type: i.type ?? 'bank', name: i.name ?? '', account_number: i.account_number ?? '', instructions: i.instructions ?? '' }); setErrors({}); setShowModal(true); }} onDelete={handleDelete} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <CreditCard size={56} color={Colors.borderMedium} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No payment methods</Text>
            <Text style={styles.emptyText}>Add bank or mobile payment accounts for your customers.</Text>
          </View>
        }
      />

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setShowModal(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{editingId ? 'Edit' : 'Add'} Payment Method</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <FieldLabel label="Type" />
            <View style={styles.typeRow}>
              {['bank', 'mobile', 'card'].map((t) => {
                const IconComp = TYPE_ICONS[t];
                return (
                  <TouchableOpacity key={t} style={[styles.typeBtn, form.type === t && styles.typeBtnActive]} onPress={() => setField('type', t)}>
                    <IconComp size={16} color={form.type === t ? Colors.primary : Colors.textMuted} strokeWidth={2} />
                    <Text style={[styles.typeBtnText, form.type === t && styles.typeBtnTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <FieldLabel label="Method Name *" error={errors.name} />
            <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="e.g. Dutch Bangla Bank / bKash" placeholderTextColor={Colors.textLight} value={form.name} onChangeText={(v) => setField('name', v)} />
            <FieldLabel label="Account Number / Phone" />
            <TextInput style={styles.input} placeholder="e.g. 01XXXXXXXXX" placeholderTextColor={Colors.textLight} value={form.account_number} onChangeText={(v) => setField('account_number', v)} keyboardType="phone-pad" />
            <FieldLabel label="Payment Instructions (optional)" />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Instructions for customers..." placeholderTextColor={Colors.textLight} value={form.instructions} onChangeText={(v) => setField('instructions', v)} multiline numberOfLines={3} textAlignVertical="top" />
            <Button title={editingId ? 'Update Method' : 'Add Method'} onPress={handleSave} loading={saving} fullWidth style={{ marginTop: Spacing.base }} />
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
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSoft, flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  methodIcon: { width: 44, height: 44, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1, gap: 2 },
  methodName: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  accountNum: { fontSize: FontSize.sm, color: Colors.textMuted },
  instructions: { fontSize: FontSize.xs, color: Colors.textLight, lineHeight: 16 },
  cardActions: { flexDirection: 'row', gap: Spacing.xs, alignItems: 'center' },
  iconBtn: { padding: 6 },
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
  textArea: { height: 80, paddingTop: 12 },
  typeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xs },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.borderSoft, backgroundColor: Colors.surfaceAlt, gap: 6 },
  typeBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  typeBtnText: { fontSize: FontSize.sm, color: Colors.textMuted, fontFamily: FontFamily.medium },
  typeBtnTextActive: { color: Colors.primary },
});
