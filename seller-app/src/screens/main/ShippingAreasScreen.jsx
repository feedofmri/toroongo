import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Modal, TextInput, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, MapPin, Pencil, Trash2 } from 'lucide-react-native';
import { shippingAreaService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';

const EMPTY_FORM = { name: '', city: '', charge: '', is_active: true };

function AreaCard({ item, onEdit, onDelete }) {
  return (
    <View style={[styles.card, Shadow.sm]}>
      <View style={styles.cardLeft}>
        <View style={styles.areaIcon}>
          <MapPin size={18} color={Colors.primary} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.areaName}>{item.name}</Text>
          {item.city ? <Text style={styles.areaCity}>{item.city}</Text> : null}
        </View>
      </View>
      <View style={styles.cardRight}>
        <View style={styles.chargeBox}>
          <Text style={styles.chargeText}>${parseFloat(item.charge ?? 0).toFixed(2)}</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => onEdit(item)} style={styles.iconBtn}>
            <Pencil size={16} color={Colors.info} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.iconBtn}>
            <Trash2 size={16} color={Colors.danger} strokeWidth={2} />
          </TouchableOpacity>
        </View>
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

export default function ShippingAreasScreen({ navigation }) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchAreas = useCallback(async () => {
    try {
      const res = await shippingAreaService.list();
      const data = res.data?.data ?? res.data ?? [];
      setAreas(Array.isArray(data) ? data : []);
    } catch (_) { setAreas([]); }
  }, []);

  useEffect(() => { fetchAreas().finally(() => setLoading(false)); }, [fetchAreas]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAreas();
    setRefreshing(false);
  }, [fetchAreas]);

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSave = async () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.charge || isNaN(form.charge)) errs.charge = 'Valid charge required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), city: form.city.trim(), charge: parseFloat(form.charge), is_active: form.is_active };
      if (editingId) await shippingAreaService.update(editingId, payload);
      else await shippingAreaService.create(payload);
      setShowModal(false);
      await fetchAreas();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) { const mapped = {}; Object.keys(data.errors).forEach((k) => { mapped[k] = data.errors[k][0]; }); setErrors(mapped); }
      else Alert.alert('Error', data?.message ?? 'Could not save.');
    } finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Remove this shipping area?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await shippingAreaService.delete(id); setAreas((prev) => prev.filter((a) => a.id !== id)); }
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
        <Text style={styles.title}>Shipping Areas</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setEditingId(null); setForm(EMPTY_FORM); setErrors({}); setShowModal(true); }}>
          <Plus size={22} color={Colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={areas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <AreaCard item={item} onEdit={(i) => { setEditingId(i.id); setForm({ name: i.name ?? '', city: i.city ?? '', charge: String(i.charge ?? ''), is_active: !!i.is_active }); setErrors({}); setShowModal(true); }} onDelete={handleDelete} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MapPin size={56} color={Colors.borderMedium} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No shipping areas</Text>
            <Text style={styles.emptyText}>Add the areas and cities you ship to.</Text>
          </View>
        }
      />

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setShowModal(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{editingId ? 'Edit' : 'Add'} Shipping Area</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <FieldLabel label="Area Name *" error={errors.name} />
            <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="e.g. Dhaka North" placeholderTextColor={Colors.textLight} value={form.name} onChangeText={(v) => setField('name', v)} />
            <FieldLabel label="City (optional)" />
            <TextInput style={styles.input} placeholder="e.g. Dhaka" placeholderTextColor={Colors.textLight} value={form.city} onChangeText={(v) => setField('city', v)} />
            <FieldLabel label="Shipping Charge ($) *" error={errors.charge} />
            <TextInput style={[styles.input, errors.charge && styles.inputError]} placeholder="e.g. 3.50" placeholderTextColor={Colors.textLight} value={form.charge} onChangeText={(v) => setField('charge', v)} keyboardType="decimal-pad" />
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Active</Text>
              <Switch value={form.is_active} onValueChange={(v) => setField('is_active', v)} trackColor={{ false: Colors.borderMedium, true: Colors.primaryLight }} thumbColor={form.is_active ? Colors.primary : Colors.white} />
            </View>
            <Button title={editingId ? 'Update Area' : 'Add Area'} onPress={handleSave} loading={saving} fullWidth style={{ marginTop: Spacing.base }} />
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
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  areaIcon: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  areaName: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  areaCity: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: Spacing.sm },
  chargeBox: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: Colors.primaryMuted },
  chargeText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.primary },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { padding: 4 },
  empty: { alignItems: 'center', paddingTop: Spacing['4xl'], paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  backdrop: { flex: 1, backgroundColor: Colors.overlay },
  sheet: { backgroundColor: Colors.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: Spacing['4xl'], maxHeight: '80%' },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.borderMedium, alignSelf: 'center', marginBottom: Spacing.md },
  sheetTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  fieldLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  fieldError: { fontSize: FontSize.xs, color: Colors.danger, marginTop: 2 },
  input: { backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.borderSoft, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing.xs },
  inputError: { borderColor: Colors.danger },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.sm },
  switchLabel: { fontSize: FontSize.base, color: Colors.textPrimary, fontFamily: FontFamily.medium },
});
