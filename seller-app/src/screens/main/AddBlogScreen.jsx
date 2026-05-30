import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { blogService } from '../../services/api';
import Button from '../../components/common/Button';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';

export default function AddBlogScreen({ navigation, route }) {
  const existing = route.params?.blog ?? null;
  const isEdit = !!existing;

  const [form, setForm] = useState({
    title: existing?.title ?? '',
    body: existing?.body ?? existing?.content ?? '',
    excerpt: existing?.excerpt ?? '',
    is_published: existing ? (!!existing.published_at || existing.status === 'published') : false,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Required', 'Please allow photo library access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [16, 9], quality: 0.85 });
    if (!result.canceled && result.assets?.[0]) setImage(result.assets[0]);
  };

  const handleSave = async () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.body.trim()) errs.body = 'Content is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (isEdit) {
        await blogService.update(existing.id, { title: form.title.trim(), body: form.body.trim(), excerpt: form.excerpt.trim(), is_published: form.is_published });
      } else {
        const fd = new FormData();
        fd.append('title', form.title.trim());
        fd.append('body', form.body.trim());
        if (form.excerpt.trim()) fd.append('excerpt', form.excerpt.trim());
        fd.append('is_published', form.is_published ? '1' : '0');
        if (image) {
          const ext = image.uri.split('.').pop() ?? 'jpg';
          fd.append('image', { uri: image.uri, type: `image/${ext}`, name: `blog.${ext}` });
        }
        await blogService.create(fd);
      }
      navigation.goBack();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) { const mapped = {}; Object.keys(data.errors).forEach((k) => { mapped[k] = data.errors[k][0]; }); setErrors(mapped); }
      else Alert.alert('Error', data?.message ?? 'Could not save post.');
    } finally { setLoading(false); }
  };

  const coverUri = image?.uri ?? existing?.thumbnail ?? existing?.image ?? null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>{isEdit ? 'Edit Post' : 'New Post'}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.coverPicker} onPress={pickImage} activeOpacity={0.75}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.coverImg} resizeMode="cover" />
          ) : (
            <View style={styles.coverPlaceholder}>
              <ImageIcon size={36} color={Colors.textMuted} strokeWidth={1.5} />
              <Text style={styles.coverPlaceholderText}>Tap to add cover image (16:9)</Text>
            </View>
          )}
        </TouchableOpacity>

        <FieldLabel label="Title *" error={errors.title} />
        <TextInput style={[styles.input, errors.title && styles.inputError]} placeholder="Your blog post title..." placeholderTextColor={Colors.textLight} value={form.title} onChangeText={(v) => setField('title', v)} maxLength={200} />

        <FieldLabel label="Short Description (optional)" />
        <TextInput style={[styles.input, styles.shortArea]} placeholder="Brief summary shown in listings..." placeholderTextColor={Colors.textLight} value={form.excerpt} onChangeText={(v) => setField('excerpt', v)} multiline numberOfLines={2} textAlignVertical="top" maxLength={300} />

        <FieldLabel label="Content *" error={errors.body} />
        <TextInput style={[styles.input, styles.bodyArea, errors.body && styles.inputError]} placeholder="Write your blog post content here..." placeholderTextColor={Colors.textLight} value={form.body} onChangeText={(v) => setField('body', v)} multiline textAlignVertical="top" />

        <View style={styles.publishRow}>
          <View>
            <Text style={styles.publishLabel}>Publish post</Text>
            <Text style={styles.publishSub}>{form.is_published ? 'Visible to customers' : 'Saved as draft'}</Text>
          </View>
          <Switch value={form.is_published} onValueChange={(v) => setField('is_published', v)} trackColor={{ false: Colors.borderMedium, true: Colors.primaryLight }} thumbColor={form.is_published ? Colors.primary : Colors.white} />
        </View>

        <Button title={isEdit ? 'Update Post' : 'Publish Post'} onPress={handleSave} loading={loading} fullWidth style={{ marginTop: Spacing.base }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FieldLabel({ label, error }) {
  return (
    <View style={{ marginBottom: 4, marginTop: Spacing.base }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderSoft },
  backBtn: { padding: Spacing.xs },
  title: { flex: 1, fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary, textAlign: 'center' },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['4xl'] },
  coverPicker: { height: 180, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderSoft, overflow: 'hidden', marginBottom: Spacing.sm, backgroundColor: Colors.surfaceAlt, ...Shadow.sm },
  coverImg: { width: '100%', height: '100%' },
  coverPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  coverPlaceholderText: { fontSize: FontSize.sm, color: Colors.textMuted },
  fieldLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  fieldError: { fontSize: FontSize.xs, color: Colors.danger, marginTop: 2 },
  input: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderSoft, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: FontSize.base, color: Colors.textPrimary, ...Shadow.sm },
  inputError: { borderColor: Colors.danger },
  shortArea: { height: 64, paddingTop: 12, textAlignVertical: 'top' },
  bodyArea: { height: 240, paddingTop: 12 },
  publishRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.borderSoft, marginTop: Spacing.base, ...Shadow.sm },
  publishLabel: { fontSize: FontSize.base, fontFamily: FontFamily.medium, color: Colors.textPrimary },
  publishSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
});
