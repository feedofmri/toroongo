import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Image, KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { productService } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { ArrowLeft, X, Camera } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius } from '../../constants/theme';

export default function AddProductScreen({ navigation, route }) {
  const editProduct = route?.params?.product ?? null;
  const isEdit = !!editProduct;

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: '',
    status: true,
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name ?? '',
        price: String(editProduct.price ?? ''),
        description: editProduct.description ?? '',
        stock: editProduct.stock !== undefined ? String(editProduct.stock) : '',
        category: editProduct.category ?? '',
        status: editProduct.status === 'active',
      });
      setImages(editProduct.images?.map((uri) => ({ uri })) ?? []);
    }
  }, []);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photo library to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets].slice(0, 5));
    }
  };

  const removeImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price) errs.price = 'Price is required';
    else if (isNaN(Number(form.price)) || Number(form.price) < 0) errs.price = 'Enter a valid price';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', form.name.trim());
      data.append('price', form.price);
      data.append('description', form.description);
      data.append('stock', form.stock || '');
      data.append('category', form.category);
      data.append('status', form.status ? 'active' : 'inactive');

      images.forEach((img, i) => {
        if (!img.uri.startsWith('http')) {
          data.append(`images[${i}]`, {
            uri: img.uri,
            name: `product_${i}.jpg`,
            type: 'image/jpeg',
          });
        }
      });

      if (isEdit) {
        await productService.update(editProduct.id, data);
        Alert.alert('Success', 'Product updated successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        await productService.create(data);
        Alert.alert('Success', 'Product added successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.keys(data.errors).forEach((k) => { mapped[k] = data.errors[k][0]; });
        setErrors(mapped);
      } else {
        Alert.alert('Error', data?.message ?? 'Failed to save product.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>{isEdit ? 'Edit Product' : 'Add Product'}</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Images */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Product Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
              {images.map((img, i) => (
                <View key={i} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.imageThumb} />
                  <TouchableOpacity style={styles.removeImg} onPress={() => removeImage(i)}>
                    <X size={12} color={Colors.white} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
                  <Camera size={24} color={Colors.textMuted} strokeWidth={1.5} />
                  <Text style={styles.addImageText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
            <Text style={styles.imageHint}>Up to 5 images. First image is the cover.</Text>
          </Card>

          {/* Basic Info */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Info</Text>
            <Input
              label="Product Name *"
              placeholder="e.g. Wireless Headphones"
              value={form.name}
              onChangeText={(t) => set('name', t)}
              error={errors.name}
            />
            <Input
              label="Price ($) *"
              placeholder="0.00"
              value={form.price}
              onChangeText={(t) => set('price', t)}
              keyboardType="decimal-pad"
              error={errors.price}
            />
            <Input
              label="Stock Quantity"
              placeholder="Leave blank for unlimited"
              value={form.stock}
              onChangeText={(t) => set('stock', t)}
              keyboardType="number-pad"
              error={errors.stock}
            />
            <Input
              label="Category"
              placeholder="e.g. Electronics"
              value={form.category}
              onChangeText={(t) => set('category', t)}
            />
          </Card>

          {/* Description */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Input
              label="Product Description"
              placeholder="Describe your product..."
              value={form.description}
              onChangeText={(t) => set('description', t)}
              multiline
              numberOfLines={5}
              style={styles.descInput}
              textAlignVertical="top"
            />
          </Card>

          {/* Status */}
          <Card style={styles.section}>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.sectionTitle}>Active Listing</Text>
                <Text style={styles.statusHint}>Visible to buyers on your store</Text>
              </View>
              <Switch
                value={form.status}
                onValueChange={(v) => set('status', v)}
                trackColor={{ false: Colors.borderMedium, true: Colors.primaryLight }}
                thumbColor={form.status ? Colors.primary : Colors.white}
              />
            </View>
          </Card>

          <Button
            title={isEdit ? 'Save Changes' : 'Add Product'}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  kav: { flex: 1 },
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

  imageRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  imageWrapper: { marginRight: Spacing.sm, position: 'relative' },
  imageThumb: { width: 80, height: 80, borderRadius: Radius.md },
  removeImg: {
    position: 'absolute', top: -6, right: -6,
    backgroundColor: Colors.danger, borderRadius: Radius.full,
    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },
  addImageBtn: {
    width: 80, height: 80, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt, borderWidth: 1.5,
    borderColor: Colors.borderMedium, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  addImageText: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  imageHint: { fontSize: FontSize.xs, color: Colors.textLight },

  descInput: { height: 120 },

  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusHint: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  submitBtn: { marginTop: Spacing.sm },
});
