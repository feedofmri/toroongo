import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, FileText, ImageIcon, Trash2 } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { blogService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';

function BlogCard({ item, onEdit, onDelete }) {
  const published = !!item.published_at || item.status === 'published';
  return (
    <TouchableOpacity style={[styles.card, Shadow.sm]} onPress={() => onEdit(item)} activeOpacity={0.8}>
      {item.thumbnail || item.image ? (
        <Image source={{ uri: item.thumbnail ?? item.image }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <ImageIcon size={28} color={Colors.borderMedium} strokeWidth={1.5} />
        </View>
      )}
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <View style={[styles.statusDot, { backgroundColor: published ? Colors.success : Colors.warning }]} />
          <Text style={styles.statusText}>{published ? 'Published' : 'Draft'}</Text>
        </View>
        <Text style={styles.blogTitle} numberOfLines={2}>{item.title ?? 'Untitled'}</Text>
        {item.excerpt || item.body ? (
          <Text style={styles.blogExcerpt} numberOfLines={2}>
            {item.excerpt ?? item.body?.replace(/<[^>]*>/g, '')}
          </Text>
        ) : null}
        <View style={styles.cardFooter}>
          <Text style={styles.cardDate}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</Text>
          <TouchableOpacity onPress={() => onDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Trash2 size={16} color={Colors.danger} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function BlogsScreen({ navigation }) {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBlogs = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await blogService.listBySeller(user.id);
      const data = res.data?.data ?? res.data ?? [];
      setBlogs(Array.isArray(data) ? data : []);
    } catch (_) { setBlogs([]); }
  }, [user?.id]);

  useEffect(() => { fetchBlogs().finally(() => setLoading(false)); }, [fetchBlogs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBlogs();
    setRefreshing(false);
  }, [fetchBlogs]);

  const handleDelete = (id) => {
    Alert.alert('Delete Post', 'Delete this blog post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await blogService.delete(id); setBlogs((prev) => prev.filter((b) => b.id !== id)); }
        catch (_) { Alert.alert('Error', 'Could not delete post.'); }
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
        <Text style={styles.title}>Blog Posts</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddBlog', {})}>
          <Plus size={22} color={Colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={blogs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <BlogCard
            item={item}
            onEdit={(blog) => navigation.navigate('AddBlog', { blog })}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FileText size={56} color={Colors.borderMedium} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No blog posts yet</Text>
            <Text style={styles.emptyText}>Share your story and attract more customers.</Text>
            <TouchableOpacity style={styles.addPostBtn} onPress={() => navigation.navigate('AddBlog', {})}>
              <Text style={styles.addPostBtnText}>Write your first post</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderSoft, overflow: 'hidden', flexDirection: 'row' },
  thumbnail: { width: 90, height: 90 },
  thumbnailPlaceholder: { width: 90, height: 90, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, padding: Spacing.sm, gap: 4 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FontSize.xs, color: Colors.textMuted, fontFamily: FontFamily.medium },
  blogTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.textPrimary, lineHeight: 20 },
  blogExcerpt: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  cardDate: { fontSize: FontSize.xs, color: Colors.textLight },
  empty: { alignItems: 'center', paddingTop: Spacing['4xl'], paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  addPostBtn: { marginTop: Spacing.sm, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.lg },
  addPostBtnText: { color: Colors.white, fontFamily: FontFamily.semibold, fontSize: FontSize.sm },
});
