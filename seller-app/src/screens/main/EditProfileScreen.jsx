import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { ArrowLeft, Camera, Store } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius } from '../../constants/theme';

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    store_name: user?.store_name ?? '',
    description: user?.description ?? '',
    slug: user?.slug ?? '',
  });
  const [avatar, setAvatar] = useState(user?.avatar ? { uri: user.avatar } : null);
  const [logo, setLogo] = useState(user?.logo ? { uri: user.logo } : null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const pickImage = async (type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) {
      if (type === 'avatar') setAvatar(result.assets[0]);
      else setLogo(result.assets[0]);
    }
  };

  const handleSave = async () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', form.name.trim());
      data.append('store_name', form.store_name.trim());
      data.append('description', form.description.trim());
      data.append('slug', form.slug.trim().toLowerCase());

      if (avatar && !avatar.uri.startsWith('http')) {
        data.append('avatar', { uri: avatar.uri, name: 'avatar.jpg', type: 'image/jpeg' });
      }
      if (logo && !logo.uri.startsWith('http')) {
        data.append('logo', { uri: logo.uri, name: 'logo.jpg', type: 'image/jpeg' });
      }

      const res = await userService.updateProfile(data);
      updateUser(res.data?.user ?? res.data);
      Alert.alert('Saved', 'Profile updated successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.keys(data.errors).forEach((k) => { mapped[k] = data.errors[k][0]; });
        setErrors(mapped);
      } else {
        Alert.alert('Error', data?.message ?? 'Failed to save profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Avatar + Logo */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Images</Text>
            <View style={styles.imagesRow}>
              <View style={styles.imageBlock}>
                <Text style={styles.imageLabel}>Profile Photo</Text>
                <TouchableOpacity onPress={() => pickImage('avatar')} style={styles.imageCircle}>
                  {avatar ? (
                    <Image source={{ uri: avatar.uri }} style={styles.imageCircleImg} />
                  ) : (
                    <Camera size={28} color={Colors.textMuted} strokeWidth={1.5} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.imageBlock}>
                <Text style={styles.imageLabel}>Store Logo</Text>
                <TouchableOpacity onPress={() => pickImage('logo')} style={styles.imageSquare}>
                  {logo ? (
                    <Image source={{ uri: logo.uri }} style={styles.imageSquareImg} />
                  ) : (
                    <Store size={28} color={Colors.textMuted} strokeWidth={1.5} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Personal Info */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <Input label="Full Name *" value={form.name} onChangeText={(t) => set('name', t)} error={errors.name} placeholder="Your name" />
          </Card>

          {/* Store Info */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Store Info</Text>
            <Input label="Store Name" value={form.store_name} onChangeText={(t) => set('store_name', t)} placeholder="My Awesome Store" />
            <Input
              label="Store Handle"
              value={form.slug}
              onChangeText={(t) => set('slug', t.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="my-store"
              autoCapitalize="none"
              error={errors.slug}
            />
            <Input
              label="Store Description"
              value={form.description}
              onChangeText={(t) => set('description', t)}
              placeholder="Tell buyers about your store..."
              multiline
              numberOfLines={4}
              style={styles.descInput}
              textAlignVertical="top"
            />
          </Card>

          <Button title="Save Changes" onPress={handleSave} loading={loading} fullWidth />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
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

  imagesRow: { flexDirection: 'row', gap: Spacing.xl, justifyContent: 'center' },
  imageBlock: { alignItems: 'center' },
  imageLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.sm },
  imageCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surfaceAlt, borderWidth: 1.5,
    borderColor: Colors.borderMedium, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  imageCircleImg: { width: 80, height: 80, borderRadius: 40 },
  imageSquare: {
    width: 80, height: 80, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt, borderWidth: 1.5,
    borderColor: Colors.borderMedium, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  imageSquareImg: { width: 80, height: 80 },

  descInput: { height: 100 },
});
