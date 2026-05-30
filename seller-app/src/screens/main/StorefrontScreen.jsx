import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Store, Palette, Check } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { storefrontService } from '../../services/api';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';

const PRESET_COLORS = ['#008080', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#EC4899', '#06B6D4', '#F97316', '#64748B'];
const FONT_OPTIONS = ['Poppins', 'Inter', 'Roboto', 'Lato', 'Montserrat'];
const RADIUS_OPTIONS = [{ label: 'Sharp', value: '0' }, { label: 'Rounded', value: '8' }, { label: 'Pill', value: '24' }];

function SectionCard({ title, children }) {
  return (
    <View style={[styles.sectionCard, Shadow.sm]}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {children}
    </View>
  );
}

export default function StorefrontScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brandColor, setBrandColor] = useState('#008080');
  const [font, setFont] = useState('Poppins');
  const [radius, setRadius] = useState('8');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [showAds, setShowAds] = useState(true);

  const fetchConfig = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await storefrontService.get(user.id);
      const data = res.data;
      setBrandColor(data?.brand_color ?? data?.theme_color ?? '#008080');
      setFont(data?.font ?? 'Poppins');
      setRadius(String(data?.border_radius ?? '8'));
      setTagline(data?.tagline ?? '');
      setDescription(data?.description ?? '');
      setShowAds(data?.show_ads !== false);
    } catch (_) {}
  }, [user?.id]);

  useEffect(() => { fetchConfig().finally(() => setLoading(false)); }, [fetchConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await storefrontService.update({ brand_color: brandColor, font, border_radius: parseInt(radius, 10), tagline: tagline.trim(), description: description.trim(), show_ads: showAds });
      Alert.alert('Saved', 'Storefront settings updated successfully.');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message ?? 'Could not save settings.');
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Storefront</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Live Preview */}
        <View style={[styles.previewStrip, { backgroundColor: brandColor }]}>
          <Store size={22} color={Colors.white} strokeWidth={2} />
          <Text style={styles.previewName}>{user?.store_name ?? 'Your Store'}</Text>
          {tagline ? <Text style={styles.previewTagline}>{tagline}</Text> : null}
        </View>

        {/* Brand Color */}
        <SectionCard title="Brand Color">
          <View style={styles.swatchRow}>
            {PRESET_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.swatch, { backgroundColor: c }, brandColor === c && styles.swatchSelected]}
                onPress={() => setBrandColor(c)}
                activeOpacity={0.8}
              >
                {brandColor === c && <Check size={14} color={Colors.white} strokeWidth={3} />}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.customColorRow}>
            <Palette size={18} color={Colors.textMuted} strokeWidth={2} />
            <TextInput
              style={styles.colorInput}
              value={brandColor}
              onChangeText={(v) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setBrandColor(v); }}
              placeholder="#008080"
              placeholderTextColor={Colors.textLight}
              maxLength={7}
              autoCapitalize="none"
            />
            <View style={[styles.colorPreview, { backgroundColor: brandColor }]} />
          </View>
        </SectionCard>

        {/* Font */}
        <SectionCard title="Font Family">
          <View style={styles.optionRow}>
            {FONT_OPTIONS.map((f) => (
              <TouchableOpacity key={f} style={[styles.optionChip, font === f && { ...styles.optionChipActive, borderColor: brandColor }]} onPress={() => setFont(f)}>
                <Text style={[styles.optionChipText, font === f && { color: brandColor }]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* Border Radius */}
        <SectionCard title="Button Style">
          <View style={styles.optionRow}>
            {RADIUS_OPTIONS.map(({ label, value }) => (
              <TouchableOpacity key={value} style={[styles.optionChip, radius === value && { ...styles.optionChipActive, borderColor: brandColor }]} onPress={() => setRadius(value)}>
                <Text style={[styles.optionChipText, radius === value && { color: brandColor }]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* Store Info */}
        <SectionCard title="Store Info">
          <Text style={styles.fieldLabel}>Tagline</Text>
          <TextInput style={styles.input} placeholder="e.g. Fresh products, fast delivery" placeholderTextColor={Colors.textLight} value={tagline} onChangeText={setTagline} maxLength={120} />
          <Text style={[styles.fieldLabel, { marginTop: Spacing.sm }]}>Store Description</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Tell customers about your store..." placeholderTextColor={Colors.textLight} value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" maxLength={600} />
        </SectionCard>

        {/* Options */}
        <SectionCard>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Show advertisements</Text>
              <Text style={styles.switchSub}>Allow platform ads on your storefront</Text>
            </View>
            <Switch value={showAds} onValueChange={setShowAds} trackColor={{ false: Colors.borderMedium, true: Colors.primaryLight }} thumbColor={showAds ? Colors.primary : Colors.white} />
          </View>
        </SectionCard>

        <Button title="Save Changes" onPress={handleSave} loading={saving} fullWidth style={{ marginTop: Spacing.sm }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderSoft },
  backBtn: { padding: Spacing.xs },
  title: { flex: 1, fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary, textAlign: 'center' },
  scroll: { padding: Spacing.base, gap: Spacing.md, paddingBottom: Spacing['4xl'] },
  previewStrip: { borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center', gap: Spacing.xs, ...Shadow.md },
  previewName: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.white },
  previewTagline: { fontSize: FontSize.sm, color: Colors.white + 'CC' },
  sectionCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.base, borderWidth: 1, borderColor: Colors.borderSoft, gap: Spacing.sm },
  sectionTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.textPrimary, marginBottom: 2 },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  swatch: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  swatchSelected: { borderColor: Colors.white, elevation: 4 },
  customColorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md, paddingHorizontal: Spacing.sm, paddingVertical: 8, borderWidth: 1, borderColor: Colors.borderSoft },
  colorInput: { flex: 1, fontSize: FontSize.base, color: Colors.textPrimary, fontFamily: FontFamily.medium },
  colorPreview: { width: 28, height: 28, borderRadius: 14 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  optionChip: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.borderSoft, backgroundColor: Colors.surfaceAlt },
  optionChipActive: { backgroundColor: Colors.primaryMuted },
  optionChipText: { fontSize: FontSize.sm, color: Colors.textMuted, fontFamily: FontFamily.medium },
  fieldLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary, marginBottom: 4 },
  input: { backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.borderSoft, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: FontSize.base, color: Colors.textPrimary },
  textArea: { height: 100, paddingTop: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { fontSize: FontSize.base, fontFamily: FontFamily.medium, color: Colors.textPrimary },
  switchSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
});
