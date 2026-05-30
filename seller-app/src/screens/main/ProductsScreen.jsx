import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, X, Package, Pencil, Trash2 } from 'lucide-react-native';
import { productService } from '../../services/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProducts = useCallback(async (pg = 1, query = search) => {
    try {
      const res = await productService.list({ page: pg, search: query || undefined });
      const data = res.data?.data ?? res.data ?? [];
      if (pg === 1) setProducts(data);
      else setProducts((prev) => [...prev, ...data]);
      setHasMore(data.length >= 10);
    } catch (_) { if (pg === 1) setProducts([]); }
  }, [search]);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, search).finally(() => setLoading(false));
  }, [search]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await fetchProducts(1, search);
    setRefreshing(false);
  }, [fetchProducts, search]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    setPage(next);
    await fetchProducts(next, search);
    setLoadingMore(false);
  }, [hasMore, loadingMore, page, fetchProducts, search]);

  const handleDelete = (id) => {
    Alert.alert('Delete Product', 'Delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await productService.delete(id); setProducts((prev) => prev.filter((p) => p.id !== id)); }
        catch (_) { Alert.alert('Error', 'Failed to delete product.'); }
      }},
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.productCard, Shadow.sm]}>
      <View style={styles.productRow}>
        {item.images?.[0] ? (
          <Image source={{ uri: item.images[0] }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.thumbPlaceholder]}>
            <Package size={28} color={Colors.textMuted} strokeWidth={1.5} />
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>${parseFloat(item.price ?? 0).toFixed(2)}</Text>
          <View style={styles.productMeta}>
            <Badge label={item.status === 'active' ? 'Active' : 'Inactive'} color={item.status === 'active' ? Colors.success : Colors.textMuted} />
            {item.stock !== undefined && <Text style={styles.stock}>Stock: {item.stock ?? '∞'}</Text>}
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('AddProduct', { product: item })}>
            <Pencil size={14} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
            <Trash2 size={14} color={Colors.danger} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProduct')}>
          <Plus size={20} color={Colors.white} strokeWidth={2.5} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color={Colors.textMuted} strokeWidth={2} style={{ marginRight: Spacing.sm }} />
        <TextInput style={styles.searchInput} placeholder="Search products..." placeholderTextColor={Colors.textLight} value={search} onChangeText={setSearch} />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <X size={18} color={Colors.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <LoadingSpinner label="Loading products..." />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <LoadingSpinner size="small" /> : null}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Package size={56} color={Colors.borderMedium} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No products yet</Text>
              <Text style={styles.emptyText}>Tap "Add" to list your first product.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  addBtnText: { color: Colors.white, fontFamily: FontFamily.semibold, fontSize: FontSize.sm },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, marginHorizontal: Spacing.base, marginBottom: Spacing.sm, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderSoft, paddingHorizontal: Spacing.md, paddingVertical: 10, ...Shadow.sm },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.textPrimary },
  list: { paddingHorizontal: Spacing.base, paddingBottom: Spacing['3xl'], gap: Spacing.sm },
  productCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderSoft, overflow: 'hidden' },
  productRow: { flexDirection: 'row', alignItems: 'center' },
  thumbnail: { width: 76, height: 76 },
  thumbPlaceholder: { backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  productInfo: { flex: 1, paddingVertical: Spacing.sm, paddingLeft: Spacing.sm },
  productName: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.textPrimary, lineHeight: 18 },
  productPrice: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.primary, marginTop: 3 },
  productMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 6 },
  stock: { fontSize: FontSize.xs, color: Colors.textMuted },
  actions: { paddingRight: Spacing.sm, gap: Spacing.sm, alignItems: 'center' },
  editBtn: { width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: Colors.dangerLight, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: Spacing['4xl'], gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted },
});
